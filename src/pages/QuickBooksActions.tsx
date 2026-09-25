import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Send, Upload } from "lucide-react";
import { PageHeader, Panel, Button, StatusPill, FlowSteps, Table, Th, Td, Field, selectClass } from "@/components/helm/ui";
import { qboActions, mondayBoards } from "@/data/helm";

const STEPS = ["Board", "Action", "Mapping", "Validate", "Preview", "Post"];

const writeMapping = [
  { monday: "Item Name", qbo: "Invoice number", required: true, value: "INV-1047", state: "ready" },
  { monday: "Client", qbo: "Customer", required: true, value: "Northwind Partners", state: "ready" },
  { monday: "Service", qbo: "Product / Service", required: true, value: "Advisory Retainer", state: "ready" },
  { monday: "Value", qbo: "Amount", required: true, value: "$18,400.00", state: "ready" },
  { monday: "Date", qbo: "Invoice date", required: true, value: "Sep 12, 2026", state: "ready" },
  { monday: "Deadline", qbo: "Due date", required: false, value: "Oct 12, 2026", state: "ready" },
  { monday: "Notes", qbo: "Memo", required: false, value: "Q3 retainer", state: "ready" },
  { monday: "— not mapped —", qbo: "Class", required: false, value: "—", state: "neutral" },
];

const queue = [
  { item: "Q3 Retainer — Northwind Partners", amount: "$18,400.00", state: "ready" },
  { item: "Implementation — Sable Architecture", amount: "$31,750.00", state: "ready" },
  { item: "Discovery — Bright Harbor Media", amount: "$4,980.00", state: "warning" },
  { item: "Untitled item", amount: "—", state: "blocked" },
];

export default function QuickBooksActions() {
  const [step, setStep] = useState(0);
  const [board, setBoard] = useState("Invoice Prep");
  const [action, setAction] = useState("create_invoice");
  const [posted, setPosted] = useState(false);
  const actionLabel = qboActions.find((a) => a.id === action)?.label ?? "";

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="QuickBooks Actions"
        subtitle="Turn approved Monday items into QuickBooks records. Nothing is created until you approve the preview."
      />

      <div className="mb-5"><FlowSteps steps={STEPS} current={step} /></div>

      {step === 0 && (
        <Panel title="Which Monday board holds the data?" description="Only boards prepared for a financial purpose can post to QuickBooks">
          <div className="grid gap-2 sm:grid-cols-2">
            {mondayBoards.map((b) => (
              <button key={b.name} onClick={() => setBoard(b.name)} className={`px-3.5 py-3 rounded-lg border text-left transition-colors ${board === b.name ? "border-primary bg-accent" : "border-border hover:bg-muted"}`}>
                <p className="text-sm font-medium text-foreground">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.workspace} · {b.items} items · {b.purpose}</p>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {step === 1 && (
        <Panel title="What should happen in QuickBooks?" description="Supported actions for this board">
          <div className="grid gap-2 sm:grid-cols-2">
            {qboActions.map((a) => (
              <button key={a.id} onClick={() => setAction(a.id)} className={`px-3.5 py-3 rounded-lg border text-left transition-colors ${action === a.id ? "border-primary bg-accent" : "border-border hover:bg-muted"}`}>
                <p className="text-sm font-medium text-foreground flex items-center gap-2"><Upload className="w-3.5 h-3.5 text-primary" /> {a.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Requires: {a.requires.join(", ")}</p>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {step === 2 && (
        <Panel title={`Map “${board}” columns to ${actionLabel}`} description="Required QuickBooks fields are marked">
          <Table head={<><Th>Monday column</Th><Th></Th><Th>QuickBooks field</Th><Th>Required</Th></>}>
            {writeMapping.map((m) => (
              <tr key={m.qbo}>
                <Td className={m.monday.startsWith("—") ? "text-muted-foreground" : "font-medium"}>{m.monday}</Td>
                <Td><ArrowRight className="w-3.5 h-3.5 text-muted-foreground" /></Td>
                <Td>{m.qbo}</Td>
                <Td>{m.required ? <StatusPill tone="info">Required</StatusPill> : <span className="text-xs text-muted-foreground">Optional</span>}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {step === 3 && (
        <Panel title="Validation" description={`${queue.length} items selected from “${board}”`} actions={<StatusPill tone="warning">1 blocked · 1 warning</StatusPill>}>
          <Table head={<><Th>Monday item</Th><Th>Amount</Th><Th>Result</Th><Th>Detail</Th></>}>
            {queue.map((q) => (
              <tr key={q.item}>
                <Td className="font-medium">{q.item}</Td>
                <Td>{q.amount}</Td>
                <Td>
                  <StatusPill tone={q.state === "ready" ? "ready" : q.state === "warning" ? "warning" : "blocked"}>
                    {q.state === "ready" ? "Ready" : q.state === "warning" ? "Warning" : "Blocked"}
                  </StatusPill>
                </Td>
                <Td className="text-xs text-muted-foreground">
                  {q.state === "ready" ? "All required fields present" : q.state === "warning" ? "Customer exists in QuickBooks with a different name" : "Missing customer and amount"}
                </Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {step === 4 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Invoice preview" description="This is exactly what will be created in QuickBooks">
            <div className="border border-border rounded-lg p-5 bg-background">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-lg font-bold text-foreground">Invoice</p>
                  <p className="text-xs text-muted-foreground">INV-1047 · Riverstone Consulting Group</p>
                </div>
                <StatusPill tone="info">Draft</StatusPill>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                <div><p className="text-xs text-muted-foreground">Bill to</p><p className="text-foreground">Northwind Partners</p></div>
                <div><p className="text-xs text-muted-foreground">Terms</p><p className="text-foreground">Net 30</p></div>
                <div><p className="text-xs text-muted-foreground">Invoice date</p><p className="text-foreground">Sep 12, 2026</p></div>
                <div><p className="text-xs text-muted-foreground">Due date</p><p className="text-foreground">Oct 12, 2026</p></div>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-sm py-1.5"><span>Advisory Retainer — Q3</span><span>$18,400.00</span></div>
                <div className="flex justify-between text-sm font-semibold border-t border-border pt-2 mt-2"><span>Total</span><span>$18,400.00</span></div>
              </div>
            </div>
          </Panel>
          <Panel title="What will be written" description="Field-by-field summary">
            <dl className="space-y-2.5">
              {writeMapping.filter((m) => m.value !== "—").map((m) => (
                <div key={m.qbo} className="flex items-baseline justify-between gap-4">
                  <dt className="text-xs text-muted-foreground">{m.qbo}</dt>
                  <dd className="text-sm text-foreground text-right">{m.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              After posting, Helm writes the QuickBooks record ID and sync status back to the Monday item so both systems stay linked.
            </div>
          </Panel>
        </div>
      )}

      {step === 5 && (
        <Panel title="Post to QuickBooks">
          {posted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
              <p className="text-base font-semibold text-foreground">Invoice created in QuickBooks</p>
              <p className="text-sm text-muted-foreground mt-1">QuickBooks record ID <span className="font-mono text-foreground">1047</span> · linked to Monday item <span className="font-mono text-foreground">8830147</span></p>
              <div className="mt-4 inline-flex flex-col gap-1 text-xs text-muted-foreground">
                <span>Monday item updated: Payment Status → Open</span>
                <span>Monday item updated: QBO Record ID → 1047</span>
                <span>Audit entry recorded</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-foreground">3 of 4 items are ready to post as {actionLabel.toLowerCase()} records.</p>
              <p className="text-xs text-muted-foreground mt-1">1 blocked item will be skipped.</p>
              <div className="mt-4 flex justify-center gap-2">
                <Field label=""><select className={selectClass}><option>Post as Draft</option><option>Post and send</option></select></Field>
              </div>
              <Button className="mt-3" onClick={() => { setPosted(true); toast.success("Posted to QuickBooks — 3 records created"); }}>
                <Send className="w-4 h-4" /> Approve and post
              </Button>
            </div>
          )}
        </Panel>
      )}

      <div className="flex items-center justify-between mt-5">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}><ArrowLeft className="w-4 h-4" /> Back</Button>
        {step < STEPS.length - 1 && <Button onClick={() => setStep((s) => s + 1)}>Continue <ArrowRight className="w-4 h-4" /></Button>}
      </div>
    </div>
  );
}
