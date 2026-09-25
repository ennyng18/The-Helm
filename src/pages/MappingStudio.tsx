import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Database, Eye, EyeOff, Plus, Save, Columns3 } from "lucide-react";
import { PageHeader, Panel, Button, StatusPill, Field, selectClass, Table, Th, Td } from "@/components/helm/ui";
import { qboObjects, qboFields, mondayColumns, activeMapping } from "@/data/helm";

export default function MappingStudio() {
  const [object, setObject] = useState("invoices");
  const [advanced, setAdvanced] = useState(false);
  const fields = qboFields[object] ?? qboFields.invoices;
  const objectLabel = qboObjects.find((o) => o.id === object)?.label ?? "Invoices";

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Data Mapping Studio"
        subtitle="Decide exactly which QuickBooks information appears in which Monday column."
        actions={
          <>
            <Button variant="secondary" onClick={() => setAdvanced((a) => !a)}>
              {advanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {advanced ? "Hide technical names" : "Show technical names"}
            </Button>
            <Button onClick={() => toast.success("Mapping saved")}><Save className="w-4 h-4" /> Save mapping</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] 2xl:grid-cols-[240px_minmax(0,1fr)_280px]">
        {/* Left: QuickBooks source */}
        <Panel title="QuickBooks source" description="Choose the data to map">
          <select className={`${selectClass} mb-4`} value={object} onChange={(e) => setObject(e.target.value)}>
            {["Transactions", "Lists", "Company", "Reports"].map((g) => (
              <optgroup key={g} label={g}>
                {qboObjects.filter((o) => o.group === g).map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="stat-label mb-2">Available fields</p>
          <div className="space-y-1">
            {fields.map((f) => (
              <div key={f.label} className="flex items-start justify-between gap-2 px-2.5 py-2 rounded-lg border border-border">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-primary flex-shrink-0" />
                    {f.label}
                    {f.required && <span className="text-destructive">*</span>}
                  </p>
                  {advanced && <p className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate">{f.api}</p>}
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{f.type}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Center: mapping */}
        <Panel
          title={`${objectLabel} → Accounts Receivable`}
          description="Required QuickBooks fields must be mapped before a sync can run"
          actions={<StatusPill tone="warning">1 field unmapped</StatusPill>}
        >
          <Table head={<><Th>QuickBooks field</Th><Th></Th><Th>Monday column</Th><Th>Direction</Th><Th>Rule / default</Th><Th>Status</Th></>}>
            {activeMapping.map((m) => (
              <tr key={m.qbo}>
                <Td className="font-medium">{m.qbo}</Td>
                <Td><ArrowRight className="w-3.5 h-3.5 text-muted-foreground" /></Td>
                <Td>
                  <select className="px-2 py-1 rounded-md border border-input bg-background text-sm" defaultValue={m.monday}>
                    <option>{m.monday}</option>
                    {mondayColumns.map((c) => <option key={c.label}>{c.label}</option>)}
                  </select>
                </Td>
                <Td className="text-xs text-muted-foreground">{m.direction}</Td>
                <Td className="text-xs text-muted-foreground">{m.rule}</Td>
                <Td>
                  <StatusPill tone={m.status === "ready" ? "ready" : m.status === "warning" ? "warning" : "neutral"}>
                    {m.status === "ready" ? "Ready" : m.status === "warning" ? "Warning" : "Unmapped"}
                  </StatusPill>
                </Td>
              </tr>
            ))}
          </Table>
          <div className="pt-4 mt-1">
            <Button variant="secondary" onClick={() => toast("Add a field mapping")}><Plus className="w-4 h-4" /> Add mapping</Button>
          </div>
        </Panel>

        {/* Right: Monday destination */}
        <Panel title="Monday destination" description="Where the data lands" className="lg:col-span-2 2xl:col-span-1">
          <div className="space-y-3 mb-4">
            <Field label="Workspace"><select className={selectClass}><option>Finance Operations</option><option>Delivery</option></select></Field>
            <Field label="Board"><select className={selectClass}><option>Accounts Receivable</option><option>AP Tracker</option><option>Invoice Prep</option></select></Field>
            <Field label="Group"><select className={selectClass}><option>Open Invoices</option><option>Paid</option></select></Field>
          </div>
          <p className="stat-label mb-2">Columns on this board</p>
          <div className="space-y-1">
            {mondayColumns.map((c) => (
              <div key={c.label} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-border">
                <span className="text-xs text-foreground flex items-center gap-1.5"><Columns3 className="w-3 h-3 text-primary" /> {c.label}</span>
                <span className="text-[10px] text-muted-foreground">{c.type}</span>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="w-full justify-center mt-3" onClick={() => toast("Demo only — a new column would be created")}>
            <Plus className="w-4 h-4" /> Create column
          </Button>
        </Panel>
      </div>
    </div>
  );
}
