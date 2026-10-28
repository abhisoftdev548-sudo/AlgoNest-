import { useMemo, useState } from 'react';
import { Activity, Ban, Check, ChevronLeft, ChevronRight, Flag, History, LayoutDashboard, Search, ShieldCheck, Users, X } from 'lucide-react';
import { PERMISSIONS, ROLE_LABELS, ROLE_PERMISSIONS, ROLE_VALUES, USER_STATUSES } from '@algonest/shared';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Card from '../../../components/ui/Card.jsx';
import Input from '../../../components/ui/Input.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { useAuthStore } from '../../auth/store/authStore.js';
import useDebouncedValue from '../../../hooks/useDebouncedValue.js';
import { useAdminAudit, useAdminFlags, useAdminModeration, useAdminOverview, useAdminReports, useAdminUsers, useAdminMutations } from '../hooks/useAdmin.js';

const PAGE_SIZE = 12;
const STATUS_LABELS = { active: 'Active', suspended: 'Suspended', banned: 'Banned' };
const dateTime = (value) => value ? new Date(value).toLocaleString() : '—';
const errorText = (error) => error?.message || 'Something went wrong. Please retry.';
const has = (permissions, permission) => permissions.includes(permission);

function Metric({ label, value, hint, icon: Icon, tone = 'teal' }) {
  const colors = tone === 'purple' ? 'bg-accent/10 text-accent' : tone === 'amber' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary';
  return <Card className="p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted">{label}</p><p className="mt-2 text-2xl font-bold tabular-nums text-ink">{value ?? '—'}</p><p className="mt-1 text-xs text-muted">{hint}</p></div><span className={`rounded-xl p-2.5 ${colors}`}><Icon className="h-5 w-5" aria-hidden="true" /></span></div></Card>;
}

function Pagination({ pagination, page, setPage }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  return <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4"><span className="text-xs text-muted">Page {pagination.page} of {pagination.totalPages} · {pagination.total} records</span><div className="flex gap-2"><Button size="sm" variant="secondary" disabled={!pagination.hasPrev} onClick={() => setPage(Math.max(1, page - 1))}><ChevronLeft className="h-4 w-4" /> Previous</Button><Button size="sm" variant="secondary" disabled={!pagination.hasNext} onClick={() => setPage(page + 1)}>Next <ChevronRight className="h-4 w-4" /></Button></div></div>;
}

function OverviewPanel({ canAnalytics, canModerate, canUsers }) {
  const overview = useAdminOverview();
  const data = overview.data;
  if (overview.isLoading) return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-28" />)}</div>;
  if (overview.isError) return <Alert variant="error" title="Overview unavailable">{errorText(overview.error)}</Alert>;
  const maxSignup = Math.max(1, ...(data?.signups?.series ?? []).map((row) => row.count));
  return <div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {canUsers ? <Metric label="Total users" value={data?.users?.total?.toLocaleString()} hint={`${data?.users?.active ?? 0} active`} icon={Users} /> : null}
      {canAnalytics ? <Metric label="Daily active" value={data?.engagement?.dau?.toLocaleString()} hint="Active in the last 24 hours" icon={Activity} tone="purple" /> : null}
      {canAnalytics ? <Metric label="Monthly active" value={data?.engagement?.mau?.toLocaleString()} hint="Active in the last 30 days" icon={Activity} /> : null}
      {canModerate ? <Metric label="Pending review" value={data?.moderation?.pending?.toLocaleString()} hint={`${data?.moderation?.openReports ?? 0} open reports`} icon={ShieldCheck} tone="amber" /> : null}
      {canAnalytics ? <Metric label="Completed quiz attempts" value={data?.engagement?.completedQuizAttempts?.toLocaleString()} hint="Submitted or timed out" icon={Check} tone="purple" /> : null}
      {canAnalytics ? <Metric label="Quiz average score" value={`${data?.quizPerformance?.averageScore ?? 0}%`} hint={`${data?.quizPerformance?.attempts ?? 0} attempts · ${data?.quizPerformance?.averageAccuracy ?? 0}% accuracy`} icon={Activity} /> : null}
      {canUsers ? <Metric label="Suspended" value={data?.users?.suspended ?? 0} hint={`${data?.users?.banned ?? 0} banned`} icon={Ban} tone="amber" /> : null}
      {canAnalytics ? <Metric label="Signups · 30 days" value={data?.signups?.last30Days?.toLocaleString()} hint={`${data?.engagement?.completedMocks ?? 0} completed mock tests`} icon={Users} tone="purple" /> : null}
    </div>
    {canAnalytics ? <div className="grid gap-4 xl:grid-cols-[1.3fr_.7fr]">
      <Card className="p-5"><div className="flex items-end justify-between gap-3"><div><h2 className="font-semibold text-ink">Signups</h2><p className="mt-1 text-xs text-muted">Daily new accounts · last 30 days</p></div><span className="text-sm font-bold text-primary">{data?.signups?.last30Days ?? 0} total</span></div>
        <div className="mt-6 flex h-36 items-end gap-1" role="img" aria-label="Daily signup bar chart for the last 30 days">{(data?.signups?.series ?? []).map((row) => <div key={row.date} title={`${row.date}: ${row.count}`} className="min-w-1 flex-1 rounded-t-sm bg-primary/70 transition-all hover:bg-primary" style={{ height: `${Math.max(row.count ? 8 : 3, row.count / maxSignup * 100)}%` }} />)}</div>
        <div className="mt-2 flex justify-between text-[10px] text-muted"><span>{data?.signups?.series?.[0]?.date}</span><span>{data?.signups?.series?.at(-1)?.date}</span></div>
      </Card>
      <Card className="p-5"><h2 className="font-semibold text-ink">Popular topics</h2><p className="mt-1 text-xs text-muted">Quiz activity and average topic accuracy</p>
        {data?.popularTopics?.length ? <div className="mt-4 space-y-3">{data.popularTopics.slice(0, 6).map((topic, index) => <div key={topic.topic} className="flex items-center gap-3"><span className="w-5 text-xs text-muted">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex justify-between gap-2 text-sm"><span className="truncate font-medium text-ink">{topic.topic}</span><span className="shrink-0 text-muted">{topic.accuracy}%</span></div><div className="mt-1 h-1.5 rounded-full bg-surface-2"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, Math.max(0, topic.accuracy))}%` }} /></div></div><span className="w-12 text-right text-xs text-muted">{topic.attempts}</span></div>)}</div> : <p className="mt-5 text-sm text-muted">No quiz-topic activity in this period.</p>}
      </Card>
    </div> : <Card className="p-5 text-sm text-muted">Detailed engagement and learning analytics require the analytics:read permission.</Card>}
    {canAnalytics ? <p className="text-right text-[11px] text-muted">Metrics generated {dateTime(data?.generatedAt)} · activity is counted from quiz, mock and resource events.</p> : null}
    {!canModerate ? <p className="text-xs text-muted">Content review actions are limited to staff with content moderation permission.</p> : null}
  </div>;
}

function ModerationPanel({ page, setPage, mutations }) {
  const [type, setType] = useState('all');
  const [notes, setNotes] = useState({});
  const query = useAdminModeration({ page, limit: PAGE_SIZE, type });
  const rows = query.data?.items ?? [];
  const decide = (item, decision) => mutations.moderate.mutate({ type: item.type, id: item.id, body: { decision, note: notes[item.id] ?? '' } });
  return <Card className="p-4 sm:p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-ink">Content moderation</h2><p className="mt-1 text-xs text-muted">Review author submissions. Approval does not publish content automatically.</p></div><select aria-label="Filter moderation type" value={type} onChange={(event) => { setType(event.target.value); setPage(1); }} className="ag-input min-w-40"><option value="all">All content</option><option value="sheet">Sheets</option><option value="quiz">Quizzes</option><option value="resource">Resources</option></select></div>
    {query.isError ? <Alert variant="error">{errorText(query.error)}</Alert> : null}{mutations.moderate.isError ? <Alert variant="error" className="mb-3">{errorText(mutations.moderate.error)}</Alert> : null}
    {query.isLoading ? <div className="space-y-3"><Skeleton className="h-28" /><Skeleton className="h-28" /></div> : rows.length ? <div className="space-y-3">{rows.map((item) => <article key={`${item.type}:${item.id}`} className="rounded-xl border border-line bg-surface-2/30 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-ink">{item.title}</h3><Badge variant="accent">{item.type}</Badge></div><p className="mt-1 text-sm text-muted">By {item.author?.name ?? 'Unknown'} · submitted {dateTime(item.submittedAt ?? item.createdAt)}</p><p className="mt-2 line-clamp-2 text-sm text-muted">{item.description || 'No description provided.'}</p></div><a className="text-xs font-semibold text-primary hover:underline" href={item.href}>Open item ↗</a></div>
      {item.topics?.length ? <div className="mt-2 flex flex-wrap gap-1">{item.topics.slice(0, 4).map((topic) => <span key={topic} className="rounded-md bg-surface-2 px-2 py-1 text-[11px] text-muted">{topic}</span>)}</div> : null}
      <div className="mt-3 flex flex-wrap items-center gap-2"><input value={notes[item.id] ?? ''} onChange={(event) => setNotes((value) => ({ ...value, [item.id]: event.target.value }))} aria-label={`Review note for ${item.title}`} placeholder="Note required for request changes or reject" className="ag-input min-w-56 flex-1" maxLength={1000} /><Button size="sm" disabled={mutations.moderate.isPending} onClick={() => decide(item, 'approve')}><Check className="h-4 w-4" /> Approve</Button><Button size="sm" variant="secondary" disabled={mutations.moderate.isPending || !(notes[item.id] ?? '').trim()} onClick={() => decide(item, 'request_changes')}>Request changes</Button><Button size="sm" variant="danger" disabled={mutations.moderate.isPending || !(notes[item.id] ?? '').trim()} onClick={() => decide(item, 'reject')}><X className="h-4 w-4" /> Reject</Button></div>
    </article>)}</div> : <div className="py-10 text-center text-sm text-muted">The moderation queue is clear.</div>}
    <Pagination pagination={query.data?.pagination} page={page} setPage={setPage} />
  </Card>;
}

function UsersPanel({ page, setPage, canManage, mutations }) {
  const [search, setSearch] = useState(''); const [roleFilter, setRoleFilter] = useState(''); const [statusFilter, setStatusFilter] = useState('');
  const q = useDebouncedValue(search, 250);
  const params = useMemo(() => ({ page, limit: PAGE_SIZE, ...(q ? { q } : {}), ...(roleFilter ? { role: roleFilter } : {}), ...(statusFilter ? { status: statusFilter } : {}) }), [page, q, roleFilter, statusFilter]);
  const query = useAdminUsers(params);
  const users = query.data?.items ?? [];
  const reset = (setter, value) => { setter(value); setPage(1); };
  return <Card className="p-4 sm:p-5"><div className="mb-4"><h2 className="font-semibold text-ink">User management</h2><p className="mt-1 text-xs text-muted">Search accounts, manage access, assign staff roles and verify creators.</p></div>
    <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_180px_160px]"><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" /><Input className="pl-9" value={search} onChange={(event) => reset(setSearch, event.target.value)} placeholder="Search name or email" aria-label="Search users" /></label><select className="ag-input" aria-label="Filter by role" value={roleFilter} onChange={(event) => reset(setRoleFilter, event.target.value)}><option value="">All roles</option>{ROLE_VALUES.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}</select><select className="ag-input" aria-label="Filter by account status" value={statusFilter} onChange={(event) => reset(setStatusFilter, event.target.value)}><option value="">All statuses</option>{Object.values(USER_STATUSES).map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select></div>
    {query.isError ? <Alert variant="error">{errorText(query.error)}</Alert> : null}{mutations.role.isError || mutations.status.isError || mutations.verification.isError ? <Alert variant="error" className="mb-3">{errorText(mutations.role.error ?? mutations.status.error ?? mutations.verification.error)}</Alert> : null}
    {query.isLoading ? <Skeleton className="h-64" /> : users.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-line text-xs uppercase tracking-wide text-muted"><th className="px-2 py-3">Account</th><th className="px-2 py-3">Role</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Joined</th><th className="px-2 py-3">Creator</th><th className="px-2 py-3">Access</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b border-line/70 last:border-0"><td className="px-2 py-3"><p className="font-semibold text-ink">{user.name}</p><p className="text-xs text-muted">{user.email}</p></td><td className="px-2 py-3">{canManage ? <select className="ag-input w-40" aria-label={`Role for ${user.name}`} value={user.role} disabled={mutations.role.isPending} onChange={(event) => mutations.role.mutate({ id: user.id, role: event.target.value })}>{ROLE_VALUES.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}</select> : <span>{ROLE_LABELS[user.role] ?? user.role}</span>}</td><td className="px-2 py-3"><Badge variant={user.status === 'active' ? 'success' : 'warning'}>{STATUS_LABELS[user.status] ?? user.status}</Badge></td><td className="px-2 py-3 text-xs text-muted">{dateTime(user.createdAt)}</td><td className="px-2 py-3">{canManage ? <Button size="sm" variant="secondary" disabled={mutations.verification.isPending} onClick={() => mutations.verification.mutate({ id: user.id, verified: !user.verifiedCreator })}>{user.verifiedCreator ? 'Verified ✓' : 'Verify'}</Button> : user.verifiedCreator ? 'Verified ✓' : '—'}</td><td className="px-2 py-3">{canManage ? <select className="ag-input w-36" aria-label={`Account status for ${user.name}`} value={user.status} disabled={mutations.status.isPending} onChange={(event) => mutations.status.mutate({ id: user.id, status: event.target.value })}>{Object.values(USER_STATUSES).map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select> : 'Read only'}</td></tr>)}</tbody></table></div> : <p className="py-10 text-center text-sm text-muted">No accounts match your filters.</p>}
    <Pagination pagination={query.data?.pagination} page={page} setPage={setPage} />
  </Card>;
}

function ReportsPanel({ page, setPage, mutations }) {
  const [status, setStatus] = useState('open'); const query = useAdminReports({ page, limit: PAGE_SIZE, status });
  return <Card className="p-4 sm:p-5"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-semibold text-ink">Reports</h2><p className="mt-1 text-xs text-muted">Handle user reports on sheets and resources.</p></div><select className="ag-input w-36" value={status} aria-label="Report status" onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="open">Open</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option></select></div>
    {query.isError ? <Alert variant="error">{errorText(query.error)}</Alert> : null}{mutations.report.isError ? <Alert variant="error" className="mb-3">{errorText(mutations.report.error)}</Alert> : null}
    {query.isLoading ? <Skeleton className="h-56" /> : query.data?.items?.length ? <div className="space-y-3">{query.data.items.map((item) => <div key={`${item.type}:${item.id}`} className="rounded-xl border border-line p-4"><div className="flex flex-wrap justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-ink">{item.target}</h3><Badge variant="accent">{item.type}</Badge><Badge variant={item.status === 'open' ? 'warning' : 'neutral'}>{item.status}</Badge></div><p className="mt-1 text-xs text-muted">Reported by {item.reporter} · {item.reason} · {dateTime(item.createdAt)}</p><p className="mt-2 text-sm text-muted">{item.details || 'No additional details.'}</p></div>{item.status === 'open' ? <div className="flex shrink-0 items-start gap-2"><Button size="sm" onClick={() => mutations.report.mutate({ type: item.type, id: item.id, body: { status: 'resolved', note: '' } })}>Resolve</Button><Button size="sm" variant="secondary" onClick={() => mutations.report.mutate({ type: item.type, id: item.id, body: { status: 'dismissed', note: '' } })}>Dismiss</Button></div> : null}</div></div>)}</div> : <p className="py-10 text-center text-sm text-muted">No {status} reports.</p>}
    <Pagination pagination={query.data?.pagination} page={page} setPage={setPage} />
  </Card>;
}

function AuditPanel({ page, setPage }) {
  const query = useAdminAudit({ page, limit: 30 });
  return <Card className="p-4 sm:p-5"><div className="mb-4"><h2 className="font-semibold text-ink">Audit log</h2><p className="mt-1 text-xs text-muted">Append-only history of administrative changes, moderation decisions and report handling.</p></div>
    {query.isError ? <Alert variant="error">{errorText(query.error)}</Alert> : null}{query.isLoading ? <Skeleton className="h-60" /> : query.data?.items?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-line text-xs uppercase tracking-wide text-muted"><th className="px-2 py-3">Time</th><th className="px-2 py-3">Actor</th><th className="px-2 py-3">Action</th><th className="px-2 py-3">Target</th><th className="px-2 py-3">Summary</th></tr></thead><tbody>{query.data.items.map((log) => <tr key={log.id} className="border-b border-line/70"><td className="whitespace-nowrap px-2 py-3 text-xs text-muted">{dateTime(log.createdAt)}</td><td className="px-2 py-3"><span className="font-medium text-ink">{log.actor?.name ?? 'Deleted user'}</span><span className="block text-xs text-muted">{log.actor?.email ?? '—'}</span></td><td className="px-2 py-3"><code className="rounded bg-surface-2 px-1.5 py-1 text-xs text-primary">{log.action}</code></td><td className="px-2 py-3 text-xs text-muted">{log.targetType} · {log.targetId}</td><td className="px-2 py-3 text-xs text-muted">{log.summary}</td></tr>)}</tbody></table></div> : <p className="py-10 text-center text-sm text-muted">No admin actions have been recorded yet.</p>}
    <Pagination pagination={query.data?.pagination} page={page} setPage={setPage} />
  </Card>;
}

function FlagsPanel({ page, setPage, mutations }) {
  const query = useAdminFlags({ page, limit: PAGE_SIZE }); const [key, setKey] = useState(''); const [description, setDescription] = useState('');
  const items = query.data?.items ?? [];
  const save = (flagKey, enabled, desc) => mutations.flag.mutate({ key: flagKey, body: { enabled, description: desc } });
  return <Card className="p-4 sm:p-5"><div className="mb-4"><h2 className="font-semibold text-ink">Feature flags</h2><p className="mt-1 text-xs text-muted">Persisted rollout switches. New keys use lowercase letters, numbers, dots, hyphens or underscores.</p></div>
    {query.isError ? <Alert variant="error">{errorText(query.error)}</Alert> : null}{mutations.flag.isError ? <Alert variant="error" className="mb-3">{errorText(mutations.flag.error)}</Alert> : null}
    <form className="mb-5 grid gap-2 rounded-xl border border-line bg-surface-2/30 p-3 sm:grid-cols-[.8fr_1.4fr_auto]" onSubmit={(event) => { event.preventDefault(); if (key.trim()) { save(key.trim().toLowerCase(), false, description.trim()); setKey(''); setDescription(''); } }}><Input value={key} onChange={(event) => setKey(event.target.value)} placeholder="e.g. community.enabled" aria-label="New feature flag key" required maxLength={80} /><Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description / rollout purpose" aria-label="New feature flag description" maxLength={240} /><Button type="submit" disabled={mutations.flag.isPending}>Add disabled flag</Button></form>
    {query.isLoading ? <Skeleton className="h-48" /> : items.length ? <div className="divide-y divide-line">{items.map((flag) => <div key={flag.key} className="flex flex-wrap items-center justify-between gap-3 py-3"><div className="min-w-0"><code className="text-sm font-semibold text-ink">{flag.key}</code><p className="mt-1 text-xs text-muted">{flag.description || 'No description'}{flag.updatedBy ? ` · updated by ${flag.updatedBy}` : ''}</p></div><label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted"><input type="checkbox" checked={flag.enabled} disabled={mutations.flag.isPending} onChange={(event) => save(flag.key, event.target.checked, flag.description)} className="h-4 w-4 accent-teal-500" />{flag.enabled ? 'Enabled' : 'Disabled'}</label></div>)}</div> : <p className="py-8 text-center text-sm text-muted">No flags configured yet. Add one above.</p>}
    <Pagination pagination={query.data?.pagination} page={page} setPage={setPage} />
  </Card>;
}

export default function AdminPage() {
  const user = useAuthStore((state) => state.user);
  const permissions = user?.role ? (ROLE_PERMISSIONS[user.role] ?? []) : [];
  const canModerate = has(permissions, PERMISSIONS.CONTENT_MODERATE);
  const canReadUsers = has(permissions, PERMISSIONS.USER_READ);
  const canManageUsers = has(permissions, PERMISSIONS.USER_MANAGE);
  const canAnalytics = has(permissions, PERMISSIONS.ANALYTICS_READ);
  const canAudit = canAnalytics || canReadUsers || canModerate;
  const canAuditLogs = has(permissions, PERMISSIONS.AUDIT_READ);
  const [tab, setTab] = useState('overview'); const [page, setPage] = useState(1);
  const mutations = useAdminMutations();
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, show: canAudit },
    { id: 'users', label: 'Users', icon: Users, show: canReadUsers },
    { id: 'moderation', label: 'Moderation', icon: ShieldCheck, show: canModerate },
    { id: 'reports', label: 'Reports', icon: Flag, show: canModerate },
    { id: 'audit', label: 'Audit log', icon: History, show: canAuditLogs },
    { id: 'flags', label: 'Feature flags', icon: Activity, show: canManageUsers },
  ].filter((item) => item.show);
  const selectTab = (id) => { setTab(id); setPage(1); };
  const currentTab = tabs.some((item) => item.id === tab) ? tab : tabs[0]?.id;

  return <div className="space-y-6"><header className="flex flex-wrap items-start justify-between gap-4"><div><div className="text-[11px] font-bold uppercase tracking-[.2em] text-primary">Operations · restricted workspace</div><h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Admin dashboard</h1><p className="mt-1.5 max-w-2xl text-sm text-muted">A permission-scoped control room for platform health, users, content review, reports and rollout controls.</p></div><Badge variant="accent">{ROLE_LABELS[user?.role] ?? user?.role}</Badge></header>
    {mutations.moderate.isSuccess || mutations.role.isSuccess || mutations.status.isSuccess || mutations.verification.isSuccess || mutations.report.isSuccess || mutations.flag.isSuccess ? <Alert variant="success">Action saved. Audit history was recorded.</Alert> : null}
    <nav className="flex gap-2 overflow-x-auto border-b border-line pb-3" aria-label="Admin sections">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => selectTab(id)} aria-current={currentTab === id ? 'page' : undefined} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${currentTab === id ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink'}`}><Icon className="h-4 w-4" aria-hidden="true" />{label}</button>)}</nav>
    {currentTab === 'overview' ? <OverviewPanel canAnalytics={canAnalytics} canModerate={canModerate} canUsers={canReadUsers} /> : null}
    {currentTab === 'users' ? <UsersPanel page={page} setPage={setPage} canManage={canManageUsers} mutations={mutations} /> : null}
    {currentTab === 'moderation' ? <ModerationPanel page={page} setPage={setPage} mutations={mutations} /> : null}
    {currentTab === 'reports' ? <ReportsPanel page={page} setPage={setPage} mutations={mutations} /> : null}
    {currentTab === 'audit' ? <AuditPanel page={page} setPage={setPage} /> : null}
    {currentTab === 'flags' ? <FlagsPanel page={page} setPage={setPage} mutations={mutations} /> : null}
  </div>;
}
