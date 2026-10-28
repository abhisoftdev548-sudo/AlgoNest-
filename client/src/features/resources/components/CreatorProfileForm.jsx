import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { creatorProfileSchema } from '@algonest/shared';
import { SHEET_TOPICS } from '@algonest/shared/constants';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { contractErrors } from '../lib/resourceUtils.js';

function blankSocial() { return { label: '', url: '' }; }

export default function CreatorProfileForm({ initial, onSubmit, pending = false, error }) {
  const [form, setForm] = useState(() => ({
    displayName: initial?.displayName ?? '',
    headline: initial?.headline ?? '',
    bio: initial?.bio ?? '',
    website: initial?.website ?? '',
    expertise: initial?.expertise ?? [],
    socials: initial?.socials?.length ? initial.socials : [],
  }));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const toggleExpertise = (topic) => set('expertise', form.expertise.includes(topic)
    ? form.expertise.filter((item) => item !== topic)
    : [...form.expertise, topic].slice(0, 12));

  const save = () => {
    const parsed = creatorProfileSchema.safeParse({
      ...form,
      socials: form.socials.filter((social) => social.label && social.url),
    });
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); setMessage(parsed.error.issues[0]?.message ?? 'Check the form.'); return; }
    setErrors({}); setMessage('');
    onSubmit(parsed.data);
  };

  return (
    <section className="ag-card space-y-4 p-5">
      <h2 className="text-base font-semibold text-ink">Edit creator profile</h2>
      {message ? <Alert variant="error">{message}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Display name" required value={form.displayName} onChange={(event) => set('displayName', event.target.value)} error={errors.displayName} maxLength={60} />
        <Input label="Website" type="url" value={form.website} onChange={(event) => set('website', event.target.value)} error={errors.website} placeholder="https://…" />
      </div>
      <Input label="Headline" value={form.headline} onChange={(event) => set('headline', event.target.value)} maxLength={140} placeholder="DSA educator · 200k learners" />
      <div>
        <label htmlFor="creator-bio" className="mb-1.5 block text-sm font-medium text-ink">Bio</label>
        <textarea id="creator-bio" rows={3} maxLength={600} value={form.bio} onChange={(event) => set('bio', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" placeholder="What do you teach?" />
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Expertise ({form.expertise.length}/12)</legend>
        <div className="flex flex-wrap gap-1.5">
          {SHEET_TOPICS.map((topic) => (
            <button key={topic} type="button" aria-pressed={form.expertise.includes(topic)} onClick={() => toggleExpertise(topic)} className={`rounded-lg border px-2 py-1 text-[11px] font-medium ${form.expertise.includes(topic) ? 'border-primary bg-primary/12 text-primary' : 'border-line text-muted hover:border-primary/40'}`}>{topic}</button>
          ))}
        </div>
      </fieldset>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-medium text-ink">Social links</h3><Button size="sm" variant="ghost" disabled={form.socials.length >= 5} onClick={() => set('socials', [...form.socials, blankSocial()])}>+ Add</Button></div>
        {form.socials.map((social, index) => (
          <div key={index} className="flex flex-wrap items-end gap-2">
            <Input label="Label" value={social.label} onChange={(event) => set('socials', form.socials.map((item, i) => i === index ? { ...item, label: event.target.value } : item))} placeholder="GitHub" />
            <Input label="URL" type="url" value={social.url} onChange={(event) => set('socials', form.socials.map((item, i) => i === index ? { ...item, url: event.target.value } : item))} placeholder="https://…" />
            <Button size="icon" variant="ghost" aria-label={`Remove social link ${index + 1}`} onClick={() => set('socials', form.socials.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4 text-danger" /></Button>
          </div>
        ))}
        {errors.socials ? <p className="text-xs text-danger">{errors.socials}</p> : null}
      </div>
      <div className="flex justify-end border-t border-line pt-4"><Button className="gap-1.5" loading={pending} onClick={save}><Save className="h-3.5 w-3.5" aria-hidden="true" /> Save profile</Button></div>
    </section>
  );
}
