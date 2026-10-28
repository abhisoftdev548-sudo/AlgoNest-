import { useState } from 'react';
import { Flag } from 'lucide-react';
import { resourceReportSchema } from '@algonest/shared';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';
import Select from '../../../components/ui/Select.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { REPORT_REASON_OPTIONS, contractErrors } from '../lib/resourceUtils.js';

export default function ReportDialog({ open, onClose, onSubmit, pending = false, error }) {
  const [reason, setReason] = useState('broken_link');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const submit = () => {
    const parsed = resourceReportSchema.safeParse({ reason, details: details.trim() });
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); setMessage(parsed.error.issues[0]?.message ?? 'Check the form.'); return; }
    setErrors({}); setMessage('');
    onSubmit(parsed.data);
  };

  return (
    <Modal open={open} onClose={onClose} title="Report this resource" description="Reports are reviewed by a moderator. Abuse of this form can lead to account restrictions."
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="danger" className="gap-1.5" loading={pending} onClick={submit}><Flag className="h-3.5 w-3.5" aria-hidden="true" /> Send report</Button></>}>
      <div className="space-y-3">
        {message ? <Alert variant="error">{message}</Alert> : null}
        {error ? <Alert variant="error">{error}</Alert> : null}
        <Select label="Reason" options={REPORT_REASON_OPTIONS} value={reason} onChange={(event) => setReason(event.target.value)} error={errors.reason} />
        <div>
          <label htmlFor="report-details" className="mb-1.5 block text-sm font-medium text-ink">Details</label>
          <textarea id="report-details" rows={4} maxLength={1000} value={details} onChange={(event) => setDetails(event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" placeholder="What exactly is wrong? Include enough detail for a moderator to verify." />
          {errors.details ? <p role="alert" className="mt-1 text-xs text-danger">{errors.details}</p> : null}
        </div>
      </div>
    </Modal>
  );
}
