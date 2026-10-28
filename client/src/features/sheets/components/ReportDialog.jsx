import { useState } from 'react';
import Modal from '../../../components/ui/Modal.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { REASON_OPTIONS, errorMessage } from '../lib/sheetUtils.js';
import { useReportSheet } from '../hooks/useSheets.js';

export default function ReportDialog({ sheetId, open, onClose }) {
  const [reason, setReason] = useState('broken_link');
  const [details, setDetails] = useState('');
  const [done, setDone] = useState(false);
  const report = useReportSheet(sheetId);

  const submit = (event) => {
    event.preventDefault();
    setDone(false);
    report.mutate({ reason, details }, {
      onSuccess: () => { setDone(true); setDetails(''); },
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Report this sheet"
      description="Reports go to the moderation queue. Please be specific."
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <form onSubmit={submit} className="space-y-4">
        {done ? <Alert variant="success" title="Report submitted">Thank you — a moderator will review it shortly.</Alert> : null}
        {report.isError ? <Alert variant="error">{errorMessage(report.error)}</Alert> : null}
        <Select label="Reason" options={REASON_OPTIONS} value={reason} onChange={(e) => setReason(e.target.value)} />
        <label className="block text-sm font-medium text-ink" htmlFor="report-details">Details</label>
        <textarea
          id="report-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="e.g. problem 12 links to a 404 page"
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        <div className="flex justify-end">
          <Button type="submit" loading={report.isPending}>Submit report</Button>
        </div>
      </form>
    </Modal>
  );
}
