export const queryKeys = {
  auth: {
    me: ['auth', 'me'],
  },
  users: {
    all: ['users'],
    list: (params) => ['users', 'list', params],
  },
  // Phase 2 — DSA Sheets. Keys are deterministic so invalidation is precise.
  sheets: {
    all: ['sheets'],
    list: (params) => ['sheets', 'list', params],
    detail: (id) => ['sheets', 'detail', id],
    versions: (id) => ['sheets', 'versions', id],
    ratings: (id, params) => ['sheets', 'ratings', id, params],
    reports: (params) => ['sheets', 'reports', params],
    progress: (id, params) => ['sheets', 'progress', id, params],
  },
  personalResources: {
    all: ['personal-resources'],
    list: (params) => ['personal-resources', 'list', params],
  },
  // Phase 3 — Quizzes, question bank and per-user attempts.
  quizzes: {
    all: ['quizzes'],
    list: (params) => ['quizzes', 'list', params],
    detail: (id) => ['quizzes', 'detail', id],
    versions: (id) => ['quizzes', 'versions', id],
    questions: (id, params) => ['quizzes', 'questions', id, params],
    attempts: (id, params) => ['quizzes', 'attempts', id, params],
  },
  questionBank: {
    all: ['question-bank'],
    list: (params) => ['question-bank', 'list', params],
  },
  attempts: {
    all: ['attempts'],
    detail: (id) => ['attempts', 'detail', id],
    questions: (id, params) => ['attempts', 'questions', id, params],
    result: (id) => ['attempts', 'result', id],
  },
  // Phase 4 — Mock tests.
  mocks: {
    all: ['mocks'],
    list: (params) => ['mocks', 'list', params],
    detail: (id) => ['mocks', 'detail', id],
    versions: (id) => ['mocks', 'versions', id],
    sections: (id, sectionId, params) => ['mocks', 'sections', id, sectionId, params],
    attempts: (id, params) => ['mocks', 'attempts', id, params],
  },
  // Phase 5 — Adaptive plans + student dashboard.
  plans: {
    all: ['plans'],
    list: (params) => ['plans', 'list', params],
    active: () => ['plans', 'active'],
    content: () => ['plans', 'content'],
    detail: (id) => ['plans', 'detail', id],
    tasks: (id, params) => ['plans', 'tasks', id, params],
  },
  dashboard: {
    all: ['dashboard'],
    get: (params) => ['dashboard', 'overview', params],
  },
  // Phase 6 — Public resource directory + creators.
  resources: {
    all: ['resources'],
    list: (params) => ['resources', 'list', params],
    saved: (params) => ['resources', 'saved', params],
    detail: (id) => ['resources', 'detail', id],
    ratings: (id, params) => ['resources', 'ratings', id, params],
    reports: (params) => ['resources', 'reports', params],
    duplicate: (url) => ['resources', 'duplicate', url],
  },
  creators: {
    all: ['creators'],
    list: (params) => ['creators', 'list', params],
    me: () => ['creators', 'me'],
    detail: (id, params) => ['creators', 'detail', id, params],
    analytics: (id, params) => ['creators', 'analytics', id, params],
  },
  mockAttempts: {
    all: ['mock-attempts'],
    detail: (id) => ['mock-attempts', 'detail', id],
    questions: (id, params) => ['mock-attempts', 'questions', id, params],
    result: (id) => ['mock-attempts', 'result', id],
  },
};

export default queryKeys;
