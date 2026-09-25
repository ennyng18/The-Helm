import { PageHeader, Panel, Stat, Table, Th, Td, StatusPill } from "@/components/helm/ui";
import { apiUsage, syncs } from "@/data/helm";

export default function ApiUsage() {
  const max = Math.max(...apiUsage.map((d) => d.qbo + d.monday));

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="API Usage"
        subtitle="QuickBooks limits how often Helm can call it, and calls carry a cost. Keep an eye on which syncs use the most."
      />

      <div className="grid gap-4 sm:grid-cols-4 mb-4">
        <Stat label="QuickBooks calls (7d)" value="8,831" hint="Limit 500 per minute" />
        <Stat label="Monday calls (7d)" value="5,985" hint="Complexity budget 62% used" />
        <Stat label="Busiest day" value="Friday" hint="3,400 calls" />
        <Stat label="Cached responses" value="41%" hint="Avoided 6,100 calls" />
      </div>

      <Panel title="Calls per day" description="QuickBooks and Monday combined" className="mb-4">
        <div className="flex items-end gap-3 h-48">
          {apiUsage.map((d) => {
            const total = d.qbo + d.monday;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{total.toLocaleString()}</span>
                <div className="w-full flex flex-col justify-end" style={{ height: `${(total / max) * 100}%` }}>
                  <div className="w-full bg-primary rounded-t" style={{ height: `${(d.qbo / total) * 100}%` }} />
                  <div className="w-full bg-primary/35 rounded-b" style={{ height: `${(d.monday / total) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary" /> QuickBooks</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary/35" /> Monday</span>
        </div>
      </Panel>

      <Panel title="Usage by sync">
        <Table head={<><Th>Sync</Th><Th>Schedule</Th><Th>Calls (7d)</Th><Th>Records</Th><Th>Efficiency</Th></>}>
          {syncs.map((s, i) => (
            <tr key={s.name}>
              <Td className="font-medium">{s.name}</Td>
              <Td className="text-muted-foreground">{s.schedule}</Td>
              <Td>{[2840, 1498, 3126, 203][i].toLocaleString()}</Td>
              <Td>{s.records}</Td>
              <Td><StatusPill tone={i === 2 ? "warning" : "ready"}>{i === 2 ? "Consider batching" : "Efficient"}</StatusPill></Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
