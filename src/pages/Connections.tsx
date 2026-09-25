import { CheckCircle2, RefreshCw, ShieldCheck, Unplug } from "lucide-react";
import { PageHeader, Panel, StatusPill, Button, Dot, Table, Th, Td } from "@/components/helm/ui";
import { connections } from "@/data/helm";
import { toast } from "sonner";

export default function Connections() {
  const cards = [
    {
      key: "qbo",
      name: "QuickBooks Online",
      blurb: "The accounting system of record. Helm reads supported objects and reports, and posts approved records back.",
      rows: [
        ["Company", connections.quickbooks.company],
        ["Company ID", connections.quickbooks.realmId],
        ["Environment", connections.quickbooks.environment],
        ["Connected on", connections.quickbooks.connectedOn],
        ["Access expires", connections.quickbooks.tokenExpires],
      ],
      scopes: connections.quickbooks.scopes,
    },
    {
      key: "monday",
      name: "Monday.com",
      blurb: "Where your team works. Helm creates and updates boards, groups, columns and items here.",
      rows: [
        ["Workspace", connections.monday.workspace],
        ["Account", connections.monday.account],
        ["Connected on", connections.monday.connectedOn],
        ["Access expires", connections.monday.tokenExpires],
      ],
      scopes: connections.monday.scopes,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Connections"
        subtitle="Both accounts must stay connected for data to move. Reconnect if access expires or permissions change."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((c) => (
          <Panel
            key={c.key}
            title={c.name}
            description={c.blurb}
            actions={<StatusPill tone="ready"><Dot tone="ready" /> Connected</StatusPill>}
          >
            <dl className="space-y-2.5">
              {c.rows.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="text-sm text-foreground text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Permissions granted
              </p>
              <div className="flex flex-wrap gap-1.5">
                {c.scopes.map((s) => (
                  <StatusPill key={s} tone="info">{s}</StatusPill>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => toast.success(`${c.name} reconnected`)}>
                <RefreshCw className="w-4 h-4" /> Reconnect
              </Button>
              <Button variant="ghost" onClick={() => toast(`Demo only — ${c.name} stays connected`)}>
                <Unplug className="w-4 h-4" /> Disconnect
              </Button>
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-4">
        <Panel title="Connection health" description="Recent checks on both accounts">
          <Table
            head={<><Th>Check</Th><Th>Account</Th><Th>Last run</Th><Th>Result</Th></>}
          >
            {[
              ["Access token valid", "QuickBooks Online", "2 min ago"],
              ["Company permissions", "QuickBooks Online", "2 min ago"],
              ["Usage limit headroom", "QuickBooks Online", "2 min ago"],
              ["Workspace access", "Monday.com", "2 min ago"],
              ["Board write permission", "Monday.com", "2 min ago"],
            ].map(([check, acct, when]) => (
              <tr key={check}>
                <Td>{check}</Td>
                <Td className="text-muted-foreground">{acct}</Td>
                <Td className="text-muted-foreground">{when}</Td>
                <Td>
                  <span className="inline-flex items-center gap-1.5 text-success text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Passing
                  </span>
                </Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}
