import { PageHeader, Panel, StatusPill, Table, Th, Td, Stat, selectClass } from "@/components/helm/ui";
import { syncHistory } from "@/data/helm";

export default function SyncHistory() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Sync History" subtitle="Every completed run, what it changed, and how much API activity it used." />

      <div className="grid gap-4 sm:grid-cols-4 mb-4">
        <Stat label="Runs this week" value="38" />
        <Stat label="Records processed" value="4,912" />
        <Stat label="Failed records" value="2" tone="blocked" />
        <Stat label="API calls used" value="5,389" hint="QuickBooks + Monday combined" />
      </div>

      <Panel
        title="Recent runs"
        actions={
          <div className="flex gap-2">
            <select className={`${selectClass} w-auto text-xs py-1.5`}><option>All syncs</option><option>Open Invoices</option><option>Bills → AP Tracker</option></select>
            <select className={`${selectClass} w-auto text-xs py-1.5`}><option>Last 7 days</option><option>Last 30 days</option></select>
          </div>
        }
      >
        <Table head={<><Th>When</Th><Th>Sync</Th><Th>Processed</Th><Th>Created</Th><Th>Updated</Th><Th>Skipped</Th><Th>Failed</Th><Th>API calls</Th><Th>Result</Th></>}>
          {syncHistory.map((h, i) => (
            <tr key={i}>
              <Td className="text-muted-foreground whitespace-nowrap">{h.time}</Td>
              <Td className="font-medium">{h.sync}</Td>
              <Td>{h.processed}</Td>
              <Td>{h.created}</Td>
              <Td>{h.updated}</Td>
              <Td className={h.skipped ? "text-warning-foreground" : ""}>{h.skipped}</Td>
              <Td className={h.failed ? "text-destructive font-medium" : ""}>{h.failed}</Td>
              <Td className="text-muted-foreground">{h.calls}</Td>
              <Td><StatusPill tone={h.result === "success" ? "ready" : "warning"}>{h.result === "success" ? "Success" : "Partial"}</StatusPill></Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
