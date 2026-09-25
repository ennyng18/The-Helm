import { Link } from "react-router-dom";
import { ArrowRight, Download, Link2, Plug, Upload, CheckCircle2 } from "lucide-react";
import { PageHeader, Panel, Stat, StatusPill, Button, Dot } from "@/components/helm/ui";
import { connections, syncs } from "@/data/helm";

export default function IntegrationHome() {

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Integration Home"
        subtitle="Bring QuickBooks into Monday. QuickBooks stays the accounting system of record; Monday stays where the work happens."
        actions={
          <>
            <Link to="/build/import">
              <Button variant="secondary"><Download className="w-4 h-4" /> Import QuickBooks Data</Button>
            </Link>
            <Link to="/build/actions">
              <Button><Upload className="w-4 h-4" /> Create QuickBooks Action</Button>
            </Link>
          </>
        }
      />

      {/* Connection status */}
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        {[
          { name: "QuickBooks Online", c: connections.quickbooks, detail: connections.quickbooks.company, sub: `Realm ${connections.quickbooks.realmId} · ${connections.quickbooks.environment}` },
          { name: "Monday.com", c: connections.monday, detail: connections.monday.workspace, sub: connections.monday.account },
        ].map((item) => (
          <div key={item.name} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                  <Plug className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
              <StatusPill tone="ready"><Dot tone="ready" /> Connected</StatusPill>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{item.sub}</p>
            <p className="text-xs text-muted-foreground mt-1">Access expires {item.c.tokenExpires}</p>
            <Link to="/connect" className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3 hover:underline">
              Manage connection <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>

      {/* Key numbers */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <Stat label="Data connections" value="4" hint="3 running · 1 paused" />
        <Stat label="Field mappings" value="46" hint="Across 4 boards" />
        <Stat label="Last successful sync" value="12 min ago" hint="Open Invoices → Accounts Receivable" />
        <Stat label="Records synced this week" value="4,912" hint="Across all connections" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Data connections"
          description="What is moving between QuickBooks and Monday right now"
          className="lg:col-span-2"
          actions={<Link to="/operate/history" className="text-xs font-medium text-primary hover:underline">View sync history</Link>}
        >
          <div className="space-y-3">
            {syncs.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.source} → {s.destination}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <StatusPill tone={s.state === "running" ? "ready" : s.state === "attention" ? "warning" : "neutral"}>
                    {s.state === "running" ? "Running" : s.state === "attention" ? `${s.failed} errors` : "Paused"}
                  </StatusPill>
                  <p className="text-xs text-muted-foreground mt-1">Last sync {s.last}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Start something new">
            <div className="space-y-2">
              {[
                { to: "/connect", label: "Connect an account", icon: Plug },
                { to: "/build/import", label: "Import QuickBooks data", icon: Download },
                { to: "/build/mapping", label: "Open Data Mapping Studio", icon: Link2 },
                { to: "/build/actions", label: "Send data to QuickBooks", icon: Upload },
                { to: "/test/ai-readiness", label: "Check AI readiness", icon: CheckCircle2 },
              ].map((a) => (
                <Link key={a.to} to={a.to} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors">
                  <a.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{a.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
