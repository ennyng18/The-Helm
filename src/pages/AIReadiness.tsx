import { toast } from "sonner";
import { AlertTriangle, Check, Copy } from "lucide-react";
import { PageHeader, Panel, StatusPill, Table, Th, Td, selectClass, Button } from "@/components/helm/ui";
import { aiPrompts, aiReadinessChecks, mondayColumns } from "@/data/helm";

export default function AIReadiness() {
  const warn = aiReadinessChecks.filter((c) => c.state === "warn").length;

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast.success("Copied — paste it into Monday AI");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="AI Readiness"
        subtitle="Helm does not answer these questions. It checks that the imported data is labelled and structured well enough for Monday's own AI to answer them."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Structure checks"
          description="Board: Accounts Receivable"
          actions={<StatusPill tone={warn ? "warning" : "ready"}>{warn ? `${warn} to review` : "All passing"}</StatusPill>}
        >
          <div className="space-y-2.5">
            {aiReadinessChecks.map((c) => (
              <div key={c.check} className="flex items-start gap-2.5">
                {c.state === "pass" ? (
                  <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm text-foreground">{c.check}</p>
                  <p className="text-xs text-muted-foreground">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Sample prompts" description="Copy one into Monday AI and see whether it can answer from the imported board">
          <select className={`${selectClass} mb-3`}><option>Accounts Receivable</option><option>AP Tracker</option><option>Project Billing</option></select>
          <div className="space-y-1.5">
            {aiPrompts.map((p) => (
              <button key={p} onClick={() => copy(p)} className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-border text-left text-sm hover:bg-muted transition-colors">
                <span className="text-foreground">{p}</span>
                <Copy className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            The test passes if Monday AI recognises the columns and reasons over the data without you explaining the board.
          </p>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel title="How the board reads to AI" description="Visible columns should be human-readable; technical IDs stay hidden">
          <Table head={<><Th>Column</Th><Th>Type</Th><Th>Visible to AI</Th><Th>Why</Th></>}>
            {mondayColumns.map((c) => {
              const hidden = c.type.includes("hidden");
              return (
                <tr key={c.label}>
                  <Td className="font-medium">{c.label}</Td>
                  <Td className="text-muted-foreground">{c.type}</Td>
                  <Td><StatusPill tone={hidden ? "neutral" : "ready"}>{hidden ? "Hidden" : "Visible"}</StatusPill></Td>
                  <Td className="text-xs text-muted-foreground">{hidden ? "Technical field kept for syncing only" : "Plain business language AI can interpret"}</Td>
                </tr>
              );
            })}
          </Table>
          <div className="pt-4">
            <Button variant="secondary" onClick={() => toast.success("Readiness report generated")}>Run readiness check</Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
