import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, UserRound, UsersRound } from "lucide-react";
import { Button, StatusPill } from "@/components/helm/ui";

export type BoardKind =
  | "accounts-receivable"
  | "invoice-prep"
  | "customers"
  | "tax-returns"
  | "monthly-close"
  | "advisory-projects"
  | "client-onboarding";

type Row = { item: string; owner: string; group: string; amount: string; date: string; status: string };

type BoardConfig = { itemLabel: string; groupLabel: string; amountLabel: string; dateLabel: string; rows: Row[] };

const boardConfig: Record<BoardKind, BoardConfig> = {
  "accounts-receivable": {
    itemLabel: "Item", groupLabel: "Group", amountLabel: "Amount", dateLabel: "Date",
    rows: [
      { item: "INV-1047 · Northwind Partners", owner: "Maya", group: "Open Invoices", amount: "$18,400", date: "Sep 12", status: "Open" },
      { item: "INV-1046 · Cascade Logistics", owner: "Leo", group: "Overdue", amount: "$9,250", date: "Sep 4", status: "Overdue" },
      { item: "INV-1044 · Bright Harbor Media", owner: "Maya", group: "Open Invoices", amount: "$4,980", date: "Aug 28", status: "Open" },
      { item: "INV-1041 · Sable Architecture", owner: "Priya", group: "Paid", amount: "$31,750", date: "Aug 16", status: "Paid" },
      { item: "INV-1039 · Greenline Studio", owner: "Leo", group: "Paid", amount: "$7,600", date: "Aug 8", status: "Paid" },
    ],
  },
  "invoice-prep": {
    itemLabel: "Item", groupLabel: "Group", amountLabel: "Amount", dateLabel: "Date",
    rows: [
      { item: "Q3 Retainer · Northwind Partners", owner: "Maya", group: "Ready to Post", amount: "$18,400", date: "Sep 12", status: "Approved" },
      { item: "Implementation · Sable Architecture", owner: "Priya", group: "Ready to Post", amount: "$31,750", date: "Sep 11", status: "Approved" },
      { item: "Discovery · Bright Harbor Media", owner: "Leo", group: "Needs Review", amount: "$4,980", date: "Sep 10", status: "Review" },
      { item: "Monthly Advisory · Cascade Logistics", owner: "Maya", group: "Drafts", amount: "$9,250", date: "Sep 8", status: "Draft" },
    ],
  },
  customers: {
    itemLabel: "Item", groupLabel: "Group", amountLabel: "Lifetime value", dateLabel: "Since",
    rows: [
      { item: "Northwind Partners", owner: "Maya", group: "Active Clients", amount: "$184,500", date: "Jan 14", status: "Active" },
      { item: "Sable Architecture", owner: "Priya", group: "Active Clients", amount: "$128,750", date: "Mar 2", status: "Active" },
      { item: "Bright Harbor Media", owner: "Leo", group: "New Clients", amount: "$42,980", date: "Aug 20", status: "New" },
      { item: "Cascade Logistics", owner: "Maya", group: "Active Clients", amount: "$96,200", date: "Apr 9", status: "Active" },
    ],
  },
  "tax-returns": {
    itemLabel: "Engagement", groupLabel: "Phase", amountLabel: "Fee", dateLabel: "Due",
    rows: [
      { item: "Northwind Partners · 1120-S", owner: "Priya", group: "In Preparation", amount: "$4,500", date: "Sep 15", status: "Working" },
      { item: "Cascade Logistics · 1065", owner: "Leo", group: "In Review", amount: "$3,800", date: "Sep 18", status: "Review" },
      { item: "Bright Harbor Media · 1120", owner: "Maya", group: "Waiting on Client", amount: "$2,950", date: "Sep 22", status: "Blocked" },
      { item: "Sable Architecture · 1040 (owners)", owner: "Priya", group: "Filed", amount: "$1,600", date: "Aug 30", status: "Done" },
    ],
  },
  "monthly-close": {
    itemLabel: "Client close", groupLabel: "Phase", amountLabel: "Monthly fee", dateLabel: "Close date",
    rows: [
      { item: "Northwind Partners · August close", owner: "Maya", group: "Reconciliation", amount: "$1,200", date: "Sep 10", status: "Working" },
      { item: "Greenline Studio · August close", owner: "Leo", group: "Reconciliation", amount: "$850", date: "Sep 11", status: "Working" },
      { item: "Cascade Logistics · August close", owner: "Priya", group: "Manager Review", amount: "$1,450", date: "Sep 9", status: "Review" },
      { item: "Sable Architecture · August close", owner: "Maya", group: "Delivered", amount: "$1,100", date: "Sep 5", status: "Done" },
    ],
  },
  "advisory-projects": {
    itemLabel: "Project", groupLabel: "Phase", amountLabel: "Budget", dateLabel: "Target",
    rows: [
      { item: "CFO advisory · Northwind Partners", owner: "Priya", group: "Active Projects", amount: "$28,000", date: "Dec 1", status: "Working" },
      { item: "Cash flow forecast · Cascade Logistics", owner: "Leo", group: "Active Projects", amount: "$12,500", date: "Oct 15", status: "Working" },
      { item: "System migration · Bright Harbor Media", owner: "Maya", group: "Discovery", amount: "$9,000", date: "Nov 4", status: "Review" },
      { item: "Valuation support · Sable Architecture", owner: "Priya", group: "Complete", amount: "$16,200", date: "Aug 22", status: "Done" },
    ],
  },
  "client-onboarding": {
    itemLabel: "New client", groupLabel: "Stage", amountLabel: "Annual value", dateLabel: "Kickoff",
    rows: [
      { item: "Harborview Dental", owner: "Maya", group: "Documents Requested", amount: "$18,000", date: "Sep 16", status: "Working" },
      { item: "Ridgeway Construction", owner: "Leo", group: "Engagement Letter", amount: "$34,000", date: "Sep 20", status: "Review" },
      { item: "Lumen Physical Therapy", owner: "Priya", group: "Books Setup", amount: "$12,400", date: "Sep 24", status: "Working" },
      { item: "Atlas Freight Co.", owner: "Maya", group: "Onboarded", amount: "$27,500", date: "Aug 12", status: "Done" },
    ],
  },
};

const tone = (status: string) =>
  status === "Overdue" || status === "Blocked" ? "blocked" : status === "Review" ? "warning" : status === "Draft" ? "neutral" : "ready";

export default function BoardTable({ board }: { board: BoardKind }) {
  const [query, setQuery] = useState("");
  const config = boardConfig[board];
  const rows = useMemo(
    () => config.rows.filter((row) => row.item.toLowerCase().includes(query.toLowerCase())),
    [config, query],
  );

  return (
    <div className="min-w-[780px]">
      <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Button className="h-8"><span className="text-base leading-none">+</span> New item</Button>
          <label className="flex h-8 w-56 items-center gap-2 rounded border border-input bg-card px-2.5 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-foreground outline-none" placeholder="Search" />
          </label>
          <Button variant="ghost" className="h-8"><UsersRound className="h-4 w-4" /> Person</Button>
          <Button variant="ghost" className="h-8"><SlidersHorizontal className="h-4 w-4" /> Filter</Button>
        </div>
        <p className="text-xs text-muted-foreground">Updated moments ago</p>
      </div>

      <div className="overflow-x-auto p-6">
        <div className="overflow-hidden rounded border border-border bg-card">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="w-10 border-r border-border px-3 py-2 text-center font-medium"><span className="block h-3.5 w-3.5 rounded-sm border border-input" /></th>
                <th className="min-w-72 border-r border-border px-3 py-2 text-left font-medium">{config.itemLabel}</th>
                <th className="w-28 border-r border-border px-3 py-2 text-left font-medium">Owner</th>
                <th className="w-44 border-r border-border px-3 py-2 text-left font-medium">{config.groupLabel}</th>
                <th className="w-32 border-r border-border px-3 py-2 text-right font-medium">{config.amountLabel}</th>
                <th className="w-28 border-r border-border px-3 py-2 text-left font-medium">{config.dateLabel}</th>
                <th className="w-32 px-3 py-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.item} className="hover:bg-muted/30">
                  <td className="border-r border-border px-3 py-3"><span className="block h-3.5 w-3.5 rounded-sm border border-input" /></td>
                  <td className="border-r border-border px-3 py-3 font-medium text-foreground">{row.item}</td>
                  <td className="border-r border-border px-3 py-3"><span className="inline-flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground"><UserRound className="h-3.5 w-3.5" /></span>{row.owner}</span></td>
                  <td className="border-r border-border px-3 py-3"><span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" />{row.group}</span></td>
                  <td className="border-r border-border px-3 py-3 text-right font-medium">{row.amount}</td>
                  <td className="border-r border-border px-3 py-3 text-muted-foreground">{row.date}</td>
                  <td className="px-3 py-3"><StatusPill tone={tone(row.status)}>{row.status}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
