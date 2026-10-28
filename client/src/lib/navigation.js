/** Single source for sidebar + topbar search. `ready: false` = Phase 2+. */
export const NAV_ITEMS = [
  { label: 'Home', to: '/app', icon: 'LayoutDashboard', end: true, ready: true },
  { label: 'Sheets', to: '/app/sheets', icon: 'BookOpen', ready: true },
  { label: 'Quizzes', to: '/app/quizzes', icon: 'ListChecks', ready: true },
  { label: 'Mocks', to: '/app/mocks', icon: 'Timer', ready: true },
  { label: 'Plans', to: '/app/plans', icon: 'CalendarRange', ready: true },
  { label: 'Resources', to: '/app/resources', icon: 'FolderOpen', ready: true },
  { label: 'Community', to: '/app/community', icon: 'Users', ready: false },
];

export const isNavReady = (pathname) => NAV_ITEMS.find((item) => item.to === pathname)?.ready ?? true;
