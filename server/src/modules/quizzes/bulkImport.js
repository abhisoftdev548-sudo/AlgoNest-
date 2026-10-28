import { QUIZ_LIMITS, questionImportSchema, questionInputSchema } from '@algonest/shared';
import { normaliseQuestion } from './questionNormalizer.js';

/**
 * Pure JSON/CSV question importer: text in, validated rows + per-row errors
 * out. It performs NO database writes and NO network access, so the preview
 * endpoint is safe to call on untrusted pasted content.
 *
 * Multi-value CSV cells use `|` (rather than commas) so a normal spreadsheet
 * export does not need nested quoting. Matching pairs use `left::right`.
 */

export const CSV_HEADERS = Object.freeze([
  'type', 'prompt', 'options', 'answer', 'items', 'pairs',
  'code', 'explanation', 'topic', 'difficulty', 'points', 'tags', 'caseSensitive',
]);

/** Build a correctly quoted CSV row from an object keyed by header name. */
function csvRow(values) {
  return CSV_HEADERS.map((header) => {
    const value = values[header] ?? '';
    const text = String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }).join(',');
}

export const CSV_TEMPLATE = [
  CSV_HEADERS.join(','),
  csvRow({
    type: 'mcq', prompt: 'Which data structure is LIFO?', options: 'Queue|Stack|Tree|Graph', answer: 'B',
    explanation: 'A stack follows last-in first-out.', topic: 'Stacks & Queues', difficulty: 'easy', points: '1',
  }),
  csvRow({
    type: 'multi', prompt: 'Pick the prime numbers', options: '2|3|4|9', answer: 'A|B',
    topic: 'Math', difficulty: 'medium', points: '2',
  }),
  csvRow({
    type: 'true_false', prompt: 'Binary search needs sorted input.', answer: 'true',
    explanation: 'It relies on a monotonic predicate.', topic: 'Binary Search', difficulty: 'easy', points: '1',
  }),
  csvRow({
    type: 'ordering', prompt: 'Order these by complexity (least first)',
    items: 'O(1)|O(log n)|O(n)|O(n log n)', topic: 'Big-O',
  }),
  csvRow({
    type: 'matching', prompt: 'Match ADT to property', pairs: 'Stack::LIFO|Queue::FIFO', topic: 'Stacks & Queues',
  }),
].join('\n');

/** A copy-paste-friendly JSON example covering all seven types. */
export const JSON_TEMPLATE = JSON.stringify([
  { type: 'mcq', prompt: 'Which data structure is LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], answer: 'B', topic: 'Stacks & Queues', difficulty: 'easy', explanation: 'A stack follows last-in first-out.' },
  { type: 'multi', prompt: 'Pick the prime numbers', options: ['2', '3', '4', '9'], answer: [0, 1], topic: 'Math', points: 2 },
  { type: 'true_false', prompt: 'Binary search needs sorted input.', answer: true, topic: 'Binary Search' },
  { type: 'ordering', prompt: 'Order these by complexity', items: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], topic: 'Big-O' },
  { type: 'matching', prompt: 'Match ADT to property', pairs: [['Stack', 'LIFO'], ['Queue', 'FIFO']], topic: 'Stacks & Queues' },
  { type: 'output', prompt: 'What does this print?', code: 'console.log([1, 2, 3].map(x => x * 2).join("-"));', options: ['1-2-3', '2-4-6', '2 4 6', 'Error'], answer: 1, topic: 'Arrays' },
  { type: 'fill_blank', prompt: 'A ________ is a FIFO structure.', answer: ['queue', 'queues'], topic: 'Stacks & Queues' },
], null, 2);

/** RFC 4180-ish parser: quoted fields, escaped quotes, CRLF, embedded newlines. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const source = String(text ?? '').replace(/^\uFEFF/, '');

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
      continue;
    }
    if (char === '"' && field === '') { quoted = true; continue; }
    if (char === ',') { row.push(field.trim()); field = ''; continue; }
    if (char === '\r' || char === '\n') {
      if (char === '\r' && source[index + 1] === '\n') index += 1;
      row.push(field.trim()); field = '';
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
      continue;
    }
    field += char;
  }
  row.push(field.trim());
  if (row.some((cell) => cell !== '')) rows.push(row);
  return rows;
}

const cleanList = (value) => String(value ?? '').split('|').map((part) => part.trim()).filter(Boolean);
const put = (target, key, value) => {
  if (value !== undefined && value !== null && String(value).trim() !== '') target[key] = value;
};

function csvRowToInput(row) {
  const input = { type: String(row.type ?? '').trim().toLowerCase() };
  put(input, 'prompt', row.prompt);
  put(input, 'code', row.code);
  put(input, 'explanation', row.explanation);
  put(input, 'topic', row.topic);
  put(input, 'difficulty', String(row.difficulty ?? '').trim().toLowerCase());
  put(input, 'points', row.points);
  put(input, 'caseSensitive', row.caseSensitive === undefined || row.caseSensitive === ''
    ? undefined
    : ['true', 'yes', '1'].includes(String(row.caseSensitive).trim().toLowerCase()));
  if (row.tags) input.tags = cleanList(row.tags);

  const options = cleanList(row.options);
  if (options.length) input.options = options;
  const items = cleanList(row.items);
  if (items.length) input.items = items;

  const pairs = cleanList(row.pairs).map((cell) => {
    const [left, right] = cell.split('::').map((part) => part.trim());
    return { left, right };
  });
  if (pairs.length) input.pairs = pairs;

  const answerCell = String(row.answer ?? '').trim();
  if (answerCell !== '') {
    if (input.type === 'multi' || input.type === 'fill_blank') input.answer = cleanList(answerCell);
    else input.answer = answerCell;
  }
  return input;
}

/**
 * @returns {{ items: object[], errors: Array<{row:number,message:string}>,
 *             skipped: Array<{row:number,reason:string}>, total:number }}
 */
export function parseBulkQuestions(format, text) {
  const parsed = questionImportSchema.safeParse({ format, text });
  if (!parsed.success) {
    return { items: [], errors: [{ row: 0, message: parsed.error.issues[0]?.message ?? 'Invalid import' }], skipped: [], total: 0 };
  }

  let rawRows = [];
  if (format === 'json') {
    let value;
    try {
      value = JSON.parse(text);
    } catch (error) {
      return { items: [], errors: [{ row: 0, message: `Invalid JSON: ${error.message}` }], skipped: [], total: 0 };
    }
    const list = Array.isArray(value) ? value : Array.isArray(value?.questions) ? value.questions : Array.isArray(value?.items) ? value.items : [value];
    rawRows = list.map((entry) => ({ row: entry, label: 'json' }));
  } else {
    const rows = parseCsv(text);
    if (rows.length < 2) {
      return { items: [], errors: [{ row: 0, message: 'CSV needs a header row and at least one question row' }], skipped: [], total: 0 };
    }
    const header = rows[0].map((column) => String(column).trim().toLowerCase().replace(/[\s_-]/g, ''));
    const missing = ['type', 'prompt'].filter((column) => !header.includes(column));
    if (missing.length) {
      return { items: [], errors: [{ row: 1, message: `CSV is missing required column(s): ${missing.join(', ')}` }], skipped: [], total: 0 };
    }
    const aliases = { casesensitive: 'caseSensitive' };
    rawRows = rows.slice(1, QUIZ_LIMITS.MAX_CSV_ROWS + 1).map((cells, index) => {
      const row = {};
      header.forEach((column, cellIndex) => {
        row[aliases[column] ?? column] = cells[cellIndex] ?? '';
      });
      return { row: csvRowToInput(row), label: 'csv' };
    });
  }

  const items = [];
  const errors = [];
  const skipped = [];
  const seen = new Set();

  rawRows.slice(0, QUIZ_LIMITS.MAX_IMPORT_BATCH).forEach(({ row }, index) => {
    const rowNumber = index + 1;
    const validated = questionInputSchema.safeParse(row);
    if (!validated.success) {
      const issue = validated.error.issues[0];
      errors.push({ row: rowNumber, message: `${issue?.path.join('.') || 'row'}: ${issue?.message ?? 'invalid question'}` });
      return;
    }
    try {
      const canonical = normaliseQuestion(validated.data);
      const fingerprint = `${canonical.type}:${canonical.prompt.toLowerCase()}`;
      if (seen.has(fingerprint)) {
        skipped.push({ row: rowNumber, reason: 'Duplicate question' });
        return;
      }
      seen.add(fingerprint);
      items.push({ input: validated.data, canonical });
    } catch (error) {
      errors.push({ row: rowNumber, message: error.message });
    }
  });

  return { items, errors, skipped, total: rawRows.length };
}
