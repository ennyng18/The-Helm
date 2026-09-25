import { ReactNode, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  AppWindow, Bell, Bot, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, FileClock,
  Grid2X2, LayoutGrid, MoreHorizontal, Search, Settings2, ShieldCheck, SlidersHorizontal,
  Sparkles, Table2, Upload, Users, Workflow,
} from "lucide-react";
import { Button } from "@/components/helm/ui";

type Board = { name: string; path: string; helm: string; color: string };

const workspaces: { id: string; name: string; initials: string; groupLabel: string; boards: Board[] }[] = [
  {
    id: "financial-operations",
    name: "Financial Operations",
    initials: "FO",
    groupLabel: "Financial Operations",
    boards: [
      { name: "Accounts Receivable", path: "/boards/accounts-receivable", helm: "/build/import", color: "bg-primary" },
      { name: "Invoice Prep", path: "/boards/invoice-prep", helm: "/build/actions", color: "bg-warning" },
      { name: "Customers", path: "/boards/customers", helm: "/build/mapping", color: "bg-success" },
    ],
  },
  {
    id: "work-management",
    name: "Work Management",
    initials: "WM",
    groupLabel: "Client Services",
    boards: [
      { name: "Tax Return Service", path: "/boards/tax-returns", helm: "/build/import", color: "bg-primary" },
      { name: "Monthly Accounting", path: "/boards/monthly-close", helm: "/build/import", color: "bg-success" },
      { name: "Advisory Projects", path: "/boards/advisory-projects", helm: "/build/mapping", color: "bg-warning" },
      { name: "Client Onboarding", path: "/boards/client-onboarding", helm: "/build/mapping", color: "bg-secondary-foreground" },
    ],
  },
];

const allBoards = workspaces.flatMap((w) => w.boards.map((b) => ({ ...b, workspaceId: w.id })));

const helmNav = [
  { to: "/", label: "Overview", icon: AppWindow },
  { to: "/build/import", label: "Import", icon: Upload },
  { to: "/build/mapping", label: "Mapping", icon: Workflow },
  { to: "/build/actions", label: "QuickBooks Actions", icon: SlidersHorizontal },
  { to: "/operate/history", label: "Sync History", icon: FileClock },
];

const boardFromPath = (pathname: string) => {
  const match = allBoards.find((b) => b.path === pathname);
  if (match) return match;
  if (pathname === "/build/actions") return allBoards[1];
  if (pathname === "/build/mapping" || pathname === "/build/board-setup") return allBoards[2];
  return allBoards[0];
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const currentBoard = useMemo(() => boardFromPath(pathname), [pathname]);
  const [workspaceId, setWorkspaceId] = useState(currentBoard.workspaceId);
  const workspace = workspaces.find((w) => w.id === workspaceId) ?? workspaces[0];
  const isBoardTable = pathname.startsWith("/boards/");

  return (
    <div className="flex h-screen min-w-[960px] overflow-hidden bg-card text-foreground">
      <aside className="flex w-14 flex-shrink-0 flex-col items-center border-r border-border bg-card py-3">
        <Link to="/" aria-label="Monday home" className="mb-5 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">m</Link>
        {[
          { icon: Grid2X2, label: "Workspace" }, { icon: Sparkles, label: "AI" }, { icon: Bot, label: "Apps" }, { icon: Workflow, label: "Workflows" },
        ].map(({ icon: Icon, label }, index) => (
          <button key={label} aria-label={label} title={label} className={`mb-2 flex h-10 w-10 items-center justify-center rounded-md transition-colors ${index === 0 ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <div className="mt-auto flex flex-col items-center gap-2">
          <button aria-label="Help" title="Help" className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"><CircleHelp className="h-4 w-4" /></button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">JW</div>
        </div>
      </aside>

      <aside className={`${sidebarOpen ? "w-64" : "w-0"} relative flex-shrink-0 overflow-hidden border-r border-border bg-background transition-[width] duration-200`}>
        <div className="w-64 px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium">Workspace</p>
            <div className="flex items-center gap-1 text-muted-foreground"><Search className="h-4 w-4" /><MoreHorizontal className="h-4 w-4" /></div>
          </div>
          <div className="relative mb-5">
            <button onClick={() => setWorkspaceOpen((open) => !open)} className="flex h-9 w-full items-center justify-between rounded border border-input bg-card px-3 text-sm">
              <span className="flex min-w-0 items-center gap-2"><span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-accent text-[10px] font-bold text-accent-foreground">{workspace.initials}</span><span className="truncate">{workspace.name}</span></span>
              <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
            </button>
            {workspaceOpen && (
              <div className="absolute left-0 top-10 z-30 w-full rounded border border-border bg-card p-1 shadow-lg">
                {workspaces.map((w) => (
                  <button key={w.id} onClick={() => { setWorkspaceId(w.id); setWorkspaceOpen(false); }} className={`flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm ${w.id === workspace.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}>
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-secondary text-[10px] font-bold text-secondary-foreground">{w.initials}</span>
                    {w.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="mb-2 px-2 text-xs font-semibold text-foreground">Workspace apps</p>
          <Link to="/" className={`mb-5 flex items-center gap-2 rounded px-2 py-2 text-sm ${pathname === "/" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">H</span>
            The Helm
          </Link>

          <p className="mb-2 px-2 text-xs font-semibold text-foreground">{workspace.groupLabel}</p>
          <nav className="space-y-1">
            {workspace.boards.map((board) => (
              <NavLink key={board.name} to={board.path} className={({ isActive }) => `flex items-center gap-2 rounded px-2 py-2 text-sm ${isActive || (currentBoard.name === board.name && !isBoardTable) ? "bg-accent text-accent-foreground" : "text-sidebar-foreground hover:bg-muted"}`}>
                <span className={`h-2.5 w-2.5 rounded-sm ${board.color}`} />
                <span className="truncate">{board.name}</span>
              </NavLink>
            ))}
          </nav>

          <p className="mb-2 mt-6 px-2 text-xs font-semibold text-foreground">Helm management</p>
          <nav className="space-y-1 text-sm">
            <NavLink to="/operate/history" className="flex items-center gap-2 rounded px-2 py-2 text-sidebar-foreground hover:bg-muted"><FileClock className="h-4 w-4" /> Sync history</NavLink>
            <NavLink to="/admin/permissions" className="flex items-center gap-2 rounded px-2 py-2 text-sidebar-foreground hover:bg-muted"><Users className="h-4 w-4" /> Permissions</NavLink>
            <NavLink to="/admin/settings" className="flex items-center gap-2 rounded px-2 py-2 text-sidebar-foreground hover:bg-muted"><Settings2 className="h-4 w-4" /> Settings</NavLink>
          </nav>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-card">
        <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-border bg-background px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? "Collapse workspace" : "Expand workspace"} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <div className="hidden h-8 w-80 items-center gap-2 rounded-full bg-secondary px-4 text-xs text-muted-foreground lg:flex"><Search className="h-3.5 w-3.5" /> Search for anything...</div>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground"><Bell className="h-4 w-4" /><CircleHelp className="h-4 w-4" /><LayoutGrid className="h-4 w-4" /></div>
        </header>

        <section className="flex-shrink-0 border-b border-border bg-card px-6 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className={`h-7 w-2 rounded-sm ${currentBoard.color}`} />
              <h1 className="truncate text-xl font-semibold">{currentBoard.name}</h1>
              <button aria-label="Board options" className="rounded p-1 text-muted-foreground hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center gap-2"><Button variant="ghost" className="h-8">Invite / 3</Button><div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">JW</div></div>
          </div>
          <nav className="flex h-9 items-end gap-6 text-sm">
            <Link to={currentBoard.path} className={`flex h-9 items-center gap-2 border-b-2 px-1 ${isBoardTable ? "border-primary font-medium text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}><Table2 className="h-4 w-4" /> Main Table</Link>
            <Link to={currentBoard.helm} className={`flex h-9 items-center gap-2 border-b-2 px-1 ${!isBoardTable ? "border-primary font-medium text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}><ShieldCheck className="h-4 w-4" /> The Helm</Link>
            <button aria-label="Add view" className="flex h-9 items-center border-b-2 border-transparent px-1 text-lg text-muted-foreground hover:text-foreground">+</button>
          </nav>
        </section>

        {!isBoardTable && (
          <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-border bg-card px-5">
            <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
              {helmNav.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `flex h-8 flex-shrink-0 items-center gap-2 rounded px-3 text-xs font-medium transition-colors ${isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-3.5 w-3.5" />{label}</NavLink>
              ))}
              <div className="relative">
                <button onClick={() => setMoreOpen((open) => !open)} className="flex h-8 items-center gap-1 rounded px-3 text-xs font-medium text-muted-foreground hover:bg-muted">More <ChevronDown className="h-3 w-3" /></button>
                {moreOpen && <div className="absolute left-0 top-9 z-20 w-48 rounded border border-border bg-card p-1 shadow-lg">
                  {[{ to: "/build/board-setup", label: "Board setup" }, { to: "/test/ai-readiness", label: "AI readiness" }, { to: "/admin/api-usage", label: "API usage" }, { to: "/admin/audit-log", label: "Audit log" }].map((item) => <Link key={item.to} to={item.to} onClick={() => setMoreOpen(false)} className="block rounded px-3 py-2 text-xs hover:bg-muted">{item.label}</Link>)}
                </div>}
              </div>
            </nav>
            <div className="ml-4 hidden flex-shrink-0 items-center gap-2 text-xs font-medium text-success xl:flex"><span className="h-2 w-2 rounded-full bg-success" />QuickBooks connected</div>
          </div>
        )}

        <main className={`min-w-0 flex-1 overflow-auto ${isBoardTable ? "bg-card" : "bg-background p-6"}`}>{children}</main>
      </div>
    </div>
  );
}
