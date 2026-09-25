import { useState } from "react";
import { toast } from "sonner";
import { Check, Columns3, Search } from "lucide-react";
import { PageHeader, Panel, Button, StatusPill, Table, Th, Td, Field, selectClass } from "@/components/helm/ui";
import { mondayBoards, boardPurposes, mondayColumns } from "@/data/helm";

const detectedColumns = [
  { name: "Name", type: "Name", meaning: "Invoice Number" },
  { name: "Client", type: "Text", meaning: "Customer Name" },
  { name: "Date", type: "Date", meaning: "Invoice Date" },
  { name: "Deadline", type: "Date", meaning: "Due Date" },
  { name: "Value", type: "Numbers", meaning: "Invoice Amount" },
  { name: "Status", type: "Status", meaning: "Payment Status" },
  { name: "Owner", type: "People", meaning: "— not used —" },
];

export default function BoardSetup() {
  const [selected, setSelected] = useState("Accounts Receivable");
  const [purpose, setPurpose] = useState("Invoice preparation");
  const board = mondayBoards.find((b) => b.name === selected)!;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Monday Board Setup"
        subtitle="Prepare a board to receive QuickBooks data. Helm inspects the board, then you tell it what each column means."
        actions={<Button onClick={() => toast.success(`“${selected}” is ready for QuickBooks data`)}><Check className="w-4 h-4" /> Save board setup</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Panel title="Boards" description="Pick a board to prepare">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input mb-3">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input placeholder="Search boards" className="bg-transparent text-sm outline-none w-full" />
          </div>
          <div className="space-y-1.5">
            {mondayBoards.map((b) => (
              <button
                key={b.name}
                onClick={() => { setSelected(b.name); setPurpose(b.purpose); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                  selected === b.name ? "border-primary bg-accent" : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{b.name}</p>
                  {b.linked && <StatusPill tone="ready">Linked</StatusPill>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{b.workspace} · {b.items} items</p>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title={`What is “${board.name}” for?`} description="The purpose decides which fields are required and how records are validated">
            <div className="grid gap-2 sm:grid-cols-3">
              {boardPurposes.map((p) => (
                <button
                  key={p}
                  onClick={() => setPurpose(p)}
                  className={`px-3 py-2.5 rounded-lg border text-sm text-left transition-colors ${
                    purpose === p ? "border-primary bg-accent text-accent-foreground font-medium" : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Panel>

          <Panel
            title="Columns found on this board"
            description="Tell Helm what each column means in business terms"
            actions={<StatusPill tone="ready">{detectedColumns.length} columns detected</StatusPill>}
          >
            <Table head={<><Th>Monday column</Th><Th>Column type</Th><Th>Business meaning</Th></>}>
              {detectedColumns.map((c) => (
                <tr key={c.name}>
                  <Td className="font-medium flex items-center gap-2"><Columns3 className="w-3.5 h-3.5 text-primary" /> {c.name}</Td>
                  <Td className="text-muted-foreground">{c.type}</Td>
                  <Td>
                    <select className="px-2 py-1 rounded-md border border-input bg-background text-sm" defaultValue={c.meaning}>
                      <option>{c.meaning}</option>
                      {mondayColumns.map((m) => <option key={m.label}>{m.label}</option>)}
                      <option>— not used —</option>
                    </select>
                  </Td>
                </tr>
              ))}
            </Table>
          </Panel>

          <Panel title={`Required for “${purpose}”`} description="These must be filled before Helm will sync or post a record">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Group new items into"><select className={selectClass}><option>Customer</option><option>Month</option><option>Status</option></select></Field>
              <Field label="Match existing items by" hint="Prevents duplicates on repeat syncs"><select className={selectClass}><option>QuickBooks Record ID</option><option>Invoice Number</option><option>Item name</option></select></Field>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {["Customer Name", "Invoice Number", "Invoice Date", "Invoice Amount"].map((r) => (
                <StatusPill key={r} tone="info">{r}</StatusPill>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
