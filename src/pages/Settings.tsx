import { toast } from "sonner";
import { Save } from "lucide-react";
import { PageHeader, Panel, Button, Field, selectClass, StatusPill } from "@/components/helm/ui";

function Toggle({ label, description, defaultOn }: { label: string; description: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0 cursor-pointer">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <input type="checkbox" defaultChecked={defaultOn} className="mt-1 w-4 h-4 accent-primary flex-shrink-0" />
    </label>
  );
}

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Settings"
        subtitle="Organization defaults for how Helm moves data between QuickBooks and Monday."
        actions={<Button onClick={() => toast.success("Settings saved")}><Save className="w-4 h-4" /> Save changes</Button>}
      />

      <div className="space-y-4">
        <Panel title="Organization" description="This account and the systems it is bridging">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organization name"><input className={selectClass} defaultValue="Riverstone Consulting Group" /></Field>
            <Field label="Time zone"><select className={selectClass}><option>Eastern Time (US)</option><option>Central Time (US)</option><option>Pacific Time (US)</option></select></Field>
            <Field label="Default QuickBooks company"><select className={selectClass}><option>Riverstone Consulting Group</option></select></Field>
            <Field label="Default Monday workspace"><select className={selectClass}><option>Finance Operations</option><option>Delivery</option></select></Field>
          </div>
        </Panel>

        <Panel title="Sync defaults" description="Applied to new data connections">
          <div className="grid gap-4 sm:grid-cols-2 mb-2">
            <Field label="Default schedule"><select className={selectClass}><option>Every 2 hours</option><option>Every 4 hours</option><option>Daily</option><option>Manual only</option></select></Field>
            <Field label="Duplicate matching"><select className={selectClass}><option>QuickBooks Record ID</option><option>Invoice / document number</option></select></Field>
          </div>
          <Toggle label="Pause a sync after repeated failures" description="Stops after 3 consecutive failed runs so bad data does not spread" defaultOn />
          <Toggle label="Batch requests where possible" description="Reduces QuickBooks API usage and cost" defaultOn />
          <Toggle label="Skip records instead of failing the run" description="A blocked record is skipped and reported rather than stopping everything" defaultOn />
        </Panel>

        <Panel title="Write-back safety" description="Controls on records created in QuickBooks">
          <Toggle label="Require approval before posting" description="Someone must approve the preview before any QuickBooks record is created" defaultOn />
          <Toggle label="Post invoices as drafts" description="Create the record without sending it to the customer" defaultOn />
          <Toggle label="Write status and record ID back to Monday" description="Keeps both systems linked and auditable" defaultOn />
        </Panel>

        <Panel title="Notifications">
          <Toggle label="Email me when a sync fails" description="Sent to the connection owner" defaultOn />
          <Toggle label="Daily summary" description="One message with records synced, skipped and failed" />
          <Toggle label="Warn when API usage is high" description="Alerts at 80% of the QuickBooks limit" defaultOn />
        </Panel>

        <Panel title="Helm Intelligence" description="Dashboards, forecasting and advisory features">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground max-w-xl">
              The analytics and recommendation layer is not part of this product. Helm's job today is to bring QuickBooks data into
              Monday in a structure that Monday's own AI can read.
            </p>
            <StatusPill tone="neutral">Planned — not available</StatusPill>
          </div>
        </Panel>
      </div>
    </div>
  );
}
