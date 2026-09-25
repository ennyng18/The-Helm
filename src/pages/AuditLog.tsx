import { PageHeader, Panel, Table, Th, Td, selectClass } from "@/components/helm/ui";
import { auditLog } from "@/data/helm";

export default function AuditLog() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Audit Log"
        subtitle="Every change and every record written to QuickBooks can be traced back to its source in Monday."
      />
      <Panel
        title="Activity"
        actions={
          <div className="flex gap-2">
            <select className={`${selectClass} w-auto text-xs py-1.5`}><option>All activity</option><option>Write-backs only</option><option>Mapping changes</option></select>
            <select className={`${selectClass} w-auto text-xs py-1.5`}><option>All people</option><option>Jeff Wilson II</option><option>System</option></select>
          </div>
        }
      >
        <Table head={<><Th>When</Th><Th>Who</Th><Th>Action</Th><Th>Target</Th><Th>Detail</Th></>}>
          {auditLog.map((a, i) => (
            <tr key={i}>
              <Td className="text-muted-foreground whitespace-nowrap">{a.time}</Td>
              <Td>{a.actor}</Td>
              <Td className="font-medium">{a.action}</Td>
              <Td>{a.target}</Td>
              <Td className="text-muted-foreground text-xs">{a.detail}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
