import { NavLink, Outlet } from 'react-router-dom';

const navigationItems = [
  { to: '/rooms', label: 'Rooms' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/leave-request', label: 'Leave Request' },
];

function getNavClasses(isActive: boolean): string {
  return isActive
    ? 'rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm'
    : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900';
}

export function AppShell() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.5)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Hostel Management
              </p>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Frontend integrated through REST APIs only
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                  The current backend exposes a health route and a rooms endpoint.
                  Maintenance and leave flows are wired to API calls and will display
                  backend errors until those routes are available server-side.
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2 rounded-full bg-slate-100/90 p-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) => getNavClasses(isActive)}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
