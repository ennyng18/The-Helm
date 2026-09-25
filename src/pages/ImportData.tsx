import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Database, Filter, Layers, Play } from "lucide-react";
import { PageHeader, Panel, Button, StatusPill, FlowSteps, Field, selectClass, Table, Th, Td } from "@/components/helm/ui";
import { qboObjects, dateRanges, groupingOptions, filterPresets, activeMapping, previewRows, mondayBoards } from "@/data/helm";

const STEPS = ["Data", "Dates", "Filters", "Destination", "Mapping", "Grouping", "Preview"];

export default function ImportData() {
  const [step, setStep] = useState(0);
  const [object, setObject] = useState("invoices");
  const [range, setRange] = useState("This Quarter");
  const [board, setBoard] = useState("Accounts Receivable");
  const [grouping, setGrouping] = useState("Customer");
  const [statusFilter, setStatusFilter] = useState("Open + Overdue");

  const objectLabel = qboObjects.find((o) => o.id === object)?.label ?? "Invoices";
  const blocked = previewRows.filter((r) => r.state === "blocked").length;
  const warnings = previewRows.filter((r) => r.state === "warning").length;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Import QuickBooks Data"
        subtitle="Choose what comes in from QuickBooks, where it lands in Monday, and how it is organized — then preview before anything is created."
      />

      <div className="mb-5">
        <FlowSteps steps={STEPS} current={step} />
      </div>

      {step === 0 && (
        <Panel title="What do you want to bring in?" description="Pick a QuickBooks list, transaction type or report">
          <div className="grid gap-4 md:grid-cols-3">
            {["Transactions", "Lists", "Company", "Reports"].map((group) => (
              <div key={group}>
                <p className="stat-label mb-2">{group}</p>
                <div className="space-y-1.5">
                  {qboObjects.filter((o) => o.group === group).map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setObject(o.id)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-sm transition-colors ${
                        object === o.id ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0"><Database className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate">{o.label}</span></span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0"><span className="font-mono text-[10px]">{o.api}</span> · {o.records}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {step === 1 && (
        <Panel title="Which time period?" description="Same date ranges you use in QuickBooks reporting">
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {dateRanges.map((d) => (
              <button
                key={d}
                onClick={() => setRange(d)}
                className={`px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                  range === d ? "border-primary bg-accent text-accent-foreground font-medium" : "border-border bg-background hover:bg-muted"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          {range === "Custom" && (
            <div className="grid gap-4 sm:grid-cols-2 mt-4 max-w-md">
              <Field label="From"><input type="date" className={selectClass} defaultValue="2026-07-01" /></Field>
              <Field label="To"><input type="date" className={selectClass} defaultValue="2026-09-30" /></Field>
            </div>
          )}
        </Panel>
      )}

      {step === 2 && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Filters" description={`Narrow the ${objectLabel.toLowerCase()} before they reach Monday`} className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer"><select className={selectClass}><option>All customers</option><option>Northwind Partners</option><option>Cascade Logistics</option></select></Field>
              <Field label="Payment status">
                <select className={selectClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option>All</option><option>Open + Overdue</option><option>Paid only</option><option>Overdue only</option>
                </select>
              </Field>
              <Field label="Project"><select className={selectClass}><option>All projects</option><option>Harbor Redesign</option><option>ERP Migration</option></select></Field>
              <Field label="Class / Location"><select className={selectClass}><option>All</option><option>East Region</option><option>West Region</option></select></Field>
              <Field label="Minimum amount"><input className={selectClass} placeholder="$0" /></Field>
              <Field label="Maximum amount"><input className={selectClass} placeholder="No limit" /></Field>
            </div>
          </Panel>
          <Panel title="Saved presets" description="Reusable filter sets">
            <div className="space-y-1.5">
              {filterPresets.map((p) => (
                <button key={p.name} onClick={() => toast.success(`Applied preset “${p.name}”`)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                  <span className="flex items-center gap-2"><Filter className="w-3.5 h-3.5 text-primary" /> {p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.records}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {step === 3 && (
        <Panel title="Where should it land in Monday?" description="Choose a workspace, board and group — or create new ones">
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mb-5">
            <Field label="Workspace"><select className={selectClass}><option>Finance Operations</option><option>Delivery</option></select></Field>
            <Field label="Group" hint="New items will be added here"><select className={selectClass}><option>Open Invoices</option><option>Create new group…</option></select></Field>
          </div>
          <p className="stat-label mb-2">Board</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {mondayBoards.map((b) => (
              <button
                key={b.name}
                onClick={() => setBoard(b.name)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-lg border text-left transition-colors ${
                  board === b.name ? "border-primary bg-accent" : "border-border bg-background hover:bg-muted"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.workspace} · {b.items} items · {b.purpose}</p>
                </div>
                {board === b.name && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
            <button onClick={() => toast("Demo only — a new board would be created")} className="px-3.5 py-3 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
              + Create a new board
            </button>
          </div>
        </Panel>
      )}

      {step === 4 && (
        <Panel title="Field mapping" description={`${objectLabel} in QuickBooks → columns on “${board}”`}>
          <Table head={<><Th>QuickBooks field</Th><Th>Monday column</Th><Th>Rule</Th><Th>Status</Th></>}>
            {activeMapping.map((m) => (
              <tr key={m.qbo}>
                <Td className="font-medium">{m.qbo}</Td>
                <Td className={m.status === "unmapped" ? "text-muted-foreground" : ""}>{m.monday}</Td>
                <Td className="text-muted-foreground text-xs">{m.rule}</Td>
                <Td>
                  <StatusPill tone={m.status === "ready" ? "ready" : m.status === "warning" ? "warning" : "neutral"}>
                    {m.status === "ready" ? "Mapped" : m.status === "warning" ? "Check rule" : "Not mapped"}
                  </StatusPill>
                </Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {step === 5 && (
        <Panel title="How should the items be organized?" description="Grouping is what keeps financial data usable inside Monday">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {groupingOptions.map((g) => (
              <button
                key={g}
                onClick={() => setGrouping(g)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                  grouping === g ? "border-primary bg-accent text-accent-foreground font-medium" : "border-border bg-background hover:bg-muted"
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> {g}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Items will be grouped by <span className="text-foreground font-medium">{grouping}</span>. Groups are created on the board automatically and reused on future syncs.
          </p>
        </Panel>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="bg-card border border-border rounded-xl p-4"><p className="stat-label">Records</p><p className="text-2xl font-bold mt-1">62</p></div>
            <div className="bg-card border border-border rounded-xl p-4"><p className="stat-label">Warnings</p><p className="text-2xl font-bold mt-1 text-warning">{warnings}</p></div>
            <div className="bg-card border border-border rounded-xl p-4"><p className="stat-label">Blocked</p><p className="text-2xl font-bold mt-1 text-destructive">{blocked}</p></div>
            <div className="bg-card border border-border rounded-xl p-4"><p className="stat-label">Est. API calls</p><p className="text-2xl font-bold mt-1">71</p></div>
          </div>

          <Panel
            title={`Preview — “${board}”, grouped by ${grouping}`}
            description={`${objectLabel} · ${range} · ${statusFilter}`}
            actions={<StatusPill tone={blocked ? "warning" : "ready"}>{blocked ? "Review before syncing" : "Ready"}</StatusPill>}
          >
            <Table head={<><Th>Item</Th><Th>Customer</Th><Th>Invoice Date</Th><Th>Due Date</Th><Th>Amount</Th><Th>Balance</Th><Th>Payment Status</Th><Th>Result</Th></>}>
              {previewRows.map((r) => (
                <tr key={r.name}>
                  <Td className="font-medium">{r.name}</Td>
                  <Td className={r.state === "blocked" ? "text-destructive" : ""}>{r.customer}</Td>
                  <Td>{r.date}</Td>
                  <Td>{r.due}</Td>
                  <Td>{r.amount}</Td>
                  <Td>{r.balance}</Td>
                  <Td><StatusPill tone={r.status === "Paid" ? "ready" : r.status === "Overdue" ? "warning" : "info"}>{r.status}</StatusPill></Td>
                  <Td>
                    <StatusPill tone={r.state === "ready" ? "ready" : r.state === "warning" ? "warning" : "blocked"}>
                      {r.state === "ready" ? "Ready" : r.state === "warning" ? "Warning" : "Blocked"}
                    </StatusPill>
                  </Td>
                </tr>
              ))}
            </Table>
          </Panel>

          {blocked > 0 && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl border border-destructive/30 bg-destructive/5">
              <div>
                <p className="text-sm font-medium text-destructive">1 record will be skipped</p>
                <p className="text-xs text-muted-foreground mt-0.5">INV-1045 has no customer in QuickBooks. Add a customer there, or map a default value, then run the sync again.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-5">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Continue <ArrowRight className="w-4 h-4" /></Button>
        ) : (
          <Button onClick={() => toast.success("Sync started — 61 records queued, 1 skipped")}>
            <Play className="w-4 h-4" /> Run sync
          </Button>
        )}
      </div>
    </div>
  );
}
