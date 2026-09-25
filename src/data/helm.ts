// Sample data for The Helm Integrator prototype (Monday.com <-> QuickBooks Online)

export type ConnStatus = "connected" | "disconnected" | "attention";

export const connections = {
  quickbooks: {
    status: "connected" as ConnStatus,
    company: "Riverstone Consulting Group",
    realmId: "9341027384756",
    environment: "Production",
    connectedOn: "Mar 4, 2026",
    tokenExpires: "in 87 days",
    scopes: ["Accounting", "Payments (read)"],
  },
  monday: {
    status: "connected" as ConnStatus,
    workspace: "Finance Operations",
    account: "riverstone.monday.com",
    connectedOn: "Mar 4, 2026",
    tokenExpires: "does not expire",
    scopes: ["boards:read", "boards:write", "workspaces:read"],
  },
};

export const qboObjects = [
  // Most frequently used QuickBooks Online API entities
  { id: "invoices", label: "Invoices", group: "Transactions", records: 428, api: "Invoice" },
  { id: "bills", label: "Bills", group: "Transactions", records: 193, api: "Bill" },
  { id: "payments", label: "Payments", group: "Transactions", records: 361, api: "Payment" },
  { id: "expenses", label: "Expenses", group: "Transactions", records: 512, api: "Purchase" },
  { id: "time", label: "Time Activities", group: "Transactions", records: 1840, api: "TimeActivity" },
  { id: "estimates", label: "Estimates", group: "Transactions", records: 96, api: "Estimate" },
  { id: "customers", label: "Customers", group: "Lists", records: 84, api: "Customer" },
  { id: "vendors", label: "Vendors", group: "Lists", records: 57, api: "Vendor" },
  { id: "items", label: "Products & Services", group: "Lists", records: 39, api: "Item" },
  { id: "accounts", label: "Chart of Accounts", group: "Lists", records: 122, api: "Account" },
  { id: "classes", label: "Classes", group: "Lists", records: 12, api: "Class" },
  { id: "locations", label: "Locations", group: "Lists", records: 4, api: "Department" },
  { id: "projects", label: "Projects", group: "Lists", records: 26, api: "Customer (job)" },
  { id: "employees", label: "Employees", group: "Lists", records: 23, api: "Employee" },
  { id: "tax_agencies", label: "Tax Agencies", group: "Lists", records: 3, api: "TaxAgency" },
  { id: "company_info", label: "Company Info", group: "Company", records: 1, api: "CompanyInfo" },
  { id: "preferences", label: "Preferences", group: "Company", records: 1, api: "Preferences" },
  { id: "ar_aging", label: "A/R Aging Summary", group: "Reports", records: 84, api: "Report · AgedReceivables" },
  { id: "pnl", label: "Profit & Loss", group: "Reports", records: 1, api: "Report · ProfitAndLoss" },
  { id: "balance_sheet", label: "Balance Sheet", group: "Reports", records: 1, api: "Report · BalanceSheet" },
];

export const dateRanges = [
  "Today",
  "This Week",
  "This Month",
  "This Quarter",
  "This Year",
  "Last Month",
  "Last Quarter",
  "Last Year",
  "Custom",
];

export const groupingOptions = [
  "Customer",
  "Vendor",
  "Month",
  "Account",
  "Transaction Type",
  "Project",
  "Class / Location",
  "No grouping",
];

export const filterPresets = [
  { name: "Open Invoices", object: "Invoices", records: 62 },
  { name: "Overdue Invoices", object: "Invoices", records: 18 },
  { name: "This Month's Revenue", object: "Invoices", records: 47 },
  { name: "Bills Due in 30 Days", object: "Bills", records: 24 },
  { name: "Customer Transactions", object: "Invoices", records: 210 },
  { name: "Project Transactions", object: "Time Activities", records: 388 },
  { name: "Vendor Spend", object: "Expenses", records: 156 },
  { name: "Unpaid Invoices", object: "Invoices", records: 71 },
];

export const qboFields: Record<string, { label: string; api: string; type: string; required?: boolean }[]> = {
  invoices: [
    { label: "Customer Name", api: "CustomerRef.name", type: "Text", required: true },
    { label: "Invoice Number", api: "DocNumber", type: "Text", required: true },
    { label: "Invoice Date", api: "TxnDate", type: "Date", required: true },
    { label: "Due Date", api: "DueDate", type: "Date" },
    { label: "Invoice Amount", api: "TotalAmt", type: "Currency", required: true },
    { label: "Balance", api: "Balance", type: "Currency" },
    { label: "Payment Status", api: "derived.status", type: "Status" },
    { label: "Product / Service", api: "Line.SalesItemLineDetail.ItemRef", type: "Text" },
    { label: "Project", api: "CustomerRef.job", type: "Text" },
    { label: "Class", api: "ClassRef.name", type: "Text" },
    { label: "Location", api: "DepartmentRef.name", type: "Text" },
    { label: "Memo", api: "PrivateNote", type: "Long Text" },
    { label: "QuickBooks ID", api: "Id", type: "Technical" },
  ],
};

export const mondayColumns = [
  { label: "Item Name", type: "Name" },
  { label: "Customer", type: "Text" },
  { label: "Invoice #", type: "Text" },
  { label: "Invoice Date", type: "Date" },
  { label: "Due Date", type: "Date" },
  { label: "Amount", type: "Numbers" },
  { label: "Balance", type: "Numbers" },
  { label: "Payment Status", type: "Status" },
  { label: "Project", type: "Text" },
  { label: "QBO Record ID", type: "Text (hidden)" },
  { label: "Last Synced", type: "Date" },
];

export const activeMapping = [
  { qbo: "Customer Name", monday: "Customer", direction: "QBO → Monday", rule: "Trim whitespace", status: "ready" },
  { qbo: "Invoice Number", monday: "Item Name", direction: "QBO → Monday", rule: "Prefix “INV-”", status: "ready" },
  { qbo: "Invoice Date", monday: "Invoice Date", direction: "QBO → Monday", rule: "MM/DD/YYYY", status: "ready" },
  { qbo: "Due Date", monday: "Due Date", direction: "QBO → Monday", rule: "—", status: "ready" },
  { qbo: "Invoice Amount", monday: "Amount", direction: "QBO → Monday", rule: "USD, 2 decimals", status: "ready" },
  { qbo: "Balance", monday: "Balance", direction: "QBO → Monday", rule: "—", status: "ready" },
  { qbo: "Payment Status", monday: "Payment Status", direction: "Two-way", rule: "Paid / Open / Overdue", status: "warning" },
  { qbo: "Project", monday: "Project", direction: "QBO → Monday", rule: "—", status: "ready" },
  { qbo: "QuickBooks ID", monday: "QBO Record ID", direction: "QBO → Monday", rule: "Hidden technical field", status: "ready" },
  { qbo: "Location", monday: "— not mapped —", direction: "—", rule: "—", status: "unmapped" },
];

export const previewRows = [
  { name: "INV-1042", customer: "Northwind Partners", date: "Aug 28, 2026", due: "Sep 27, 2026", amount: "$18,400.00", balance: "$18,400.00", status: "Open", state: "ready" },
  { name: "INV-1043", customer: "Cascade Logistics", date: "Aug 29, 2026", due: "Sep 13, 2026", amount: "$7,250.00", balance: "$0.00", status: "Paid", state: "ready" },
  { name: "INV-1044", customer: "Bright Harbor Media", date: "Aug 30, 2026", due: "Aug 30, 2026", amount: "$4,980.00", balance: "$4,980.00", status: "Overdue", state: "warning" },
  { name: "INV-1045", customer: "(missing customer)", date: "Sep 1, 2026", due: "Oct 1, 2026", amount: "$2,100.00", balance: "$2,100.00", status: "Open", state: "blocked" },
  { name: "INV-1046", customer: "Sable Architecture", date: "Sep 2, 2026", due: "Oct 2, 2026", amount: "$31,750.00", balance: "$31,750.00", status: "Open", state: "ready" },
];

export const syncs = [
  { name: "Open Invoices → Accounts Receivable", source: "QuickBooks · Invoices", destination: "Monday · Accounts Receivable", schedule: "Every 2 hours", last: "12 min ago", next: "in 1h 48m", records: 62, failed: 0, state: "running" },
  { name: "Bills → AP Tracker", source: "QuickBooks · Bills", destination: "Monday · AP Tracker", schedule: "Daily 6:00 AM", last: "6 hours ago", next: "in 18h", records: 193, failed: 2, state: "attention" },
  { name: "Time Activities → Project Billing", source: "QuickBooks · Time Activities", destination: "Monday · Project Billing", schedule: "Every 4 hours", last: "1 hour ago", next: "in 3h", records: 388, failed: 0, state: "running" },
  { name: "Monday Approvals → QBO Invoices", source: "Monday · Invoice Prep", destination: "QuickBooks · Create Invoice", schedule: "Manual", last: "Yesterday", next: "—", records: 14, failed: 0, state: "paused" },
];

export const syncHistory = [
  { time: "Sep 12, 2026 01:52", sync: "Open Invoices → Accounts Receivable", processed: 62, created: 4, updated: 58, skipped: 0, failed: 0, calls: 71, result: "success" },
  { time: "Sep 11, 2026 23:52", sync: "Open Invoices → Accounts Receivable", processed: 61, created: 1, updated: 60, skipped: 0, failed: 0, calls: 68, result: "success" },
  { time: "Sep 11, 2026 20:14", sync: "Time Activities → Project Billing", processed: 388, created: 22, updated: 366, skipped: 3, failed: 0, calls: 402, result: "success" },
  { time: "Sep 11, 2026 06:00", sync: "Bills → AP Tracker", processed: 193, created: 6, updated: 185, skipped: 0, failed: 2, calls: 214, result: "partial" },
  { time: "Sep 10, 2026 18:30", sync: "Monday Approvals → QBO Invoices", processed: 14, created: 14, updated: 0, skipped: 0, failed: 0, calls: 29, result: "success" },
  { time: "Sep 10, 2026 06:00", sync: "Bills → AP Tracker", processed: 191, created: 3, updated: 188, skipped: 1, failed: 0, calls: 205, result: "success" },
];

export const exceptions = [
  { id: "EX-2291", sync: "Bills → AP Tracker", record: "Bill #4417 · Delta Office Supply", reason: "Vendor not found in Monday board", severity: "blocked", detected: "6 hours ago" },
  { id: "EX-2290", sync: "Bills → AP Tracker", record: "Bill #4418 · Harborview Realty", reason: "Amount field is empty in QuickBooks", severity: "blocked", detected: "6 hours ago" },
  { id: "EX-2287", sync: "Open Invoices → Accounts Receivable", record: "INV-1044 · Bright Harbor Media", reason: "Due date is in the past — flagged as overdue", severity: "warning", detected: "12 min ago" },
  { id: "EX-2284", sync: "Time Activities → Project Billing", record: "3 time entries", reason: "No project assigned — skipped", severity: "warning", detected: "1 hour ago" },
];

export const qboActions = [
  { id: "create_customer", label: "Create / Update Customer", object: "Customer", requires: ["Display Name"] },
  { id: "create_vendor", label: "Create Vendor", object: "Vendor", requires: ["Display Name"] },
  { id: "create_invoice", label: "Create Invoice", object: "Invoice", requires: ["Customer", "Line item", "Amount"] },
  { id: "create_estimate", label: "Create Estimate", object: "Estimate", requires: ["Customer", "Line item", "Amount"] },
  { id: "create_employee", label: "Create Employee", object: "Employee", requires: ["Display Name"] },
  { id: "create_bill", label: "Create Bill", object: "Bill", requires: ["Vendor", "Account", "Amount"] },
  { id: "create_time", label: "Create Time Activity", object: "TimeActivity", requires: ["Employee", "Hours", "Date"] },
  { id: "create_expense", label: "Create Expense", object: "Purchase", requires: ["Payment Account", "Amount"] },
];

export const boardPurposes = [
  "Customer management",
  "Vendor management",
  "Invoice preparation",
  "Bills / AP",
  "Expense tracking",
  "Time tracking",
  "Project financial tracking",
  "Financial reporting",
  "Custom",
];

export const mondayBoards = [
  { name: "Accounts Receivable", workspace: "Finance Operations", items: 62, purpose: "Invoice preparation", linked: true },
  { name: "AP Tracker", workspace: "Finance Operations", items: 193, purpose: "Bills / AP", linked: true },
  { name: "Project Billing", workspace: "Delivery", items: 388, purpose: "Project financial tracking", linked: true },
  { name: "Client Directory", workspace: "Finance Operations", items: 84, purpose: "Customer management", linked: false },
  { name: "Invoice Prep", workspace: "Finance Operations", items: 14, purpose: "Invoice preparation", linked: true },
];

export const aiPrompts = [
  "Which customers have the largest outstanding balances?",
  "Which invoices are overdue?",
  "Summarize this customer's invoices.",
  "Show transactions from this quarter.",
  "Which projects have the most invoiced revenue?",
  "Which customers generated the most revenue during the selected period?",
];

export const aiReadinessChecks = [
  { check: "Human-readable column names", detail: "No API field names visible on the board", state: "pass" },
  { check: "Technical IDs hidden", detail: "QBO Record ID stored in a hidden column", state: "pass" },
  { check: "Dates stored as date columns", detail: "Invoice Date and Due Date use Monday date columns", state: "pass" },
  { check: "Amounts stored as numbers", detail: "Amount and Balance use number columns, not text", state: "pass" },
  { check: "Status uses a status column", detail: "Paid / Open / Overdue labels defined", state: "pass" },
  { check: "Grouping is meaningful", detail: "Items grouped by customer", state: "pass" },
  { check: "Location field mapped", detail: "Location is not mapped — AI cannot answer location questions", state: "warn" },
];

export const apiUsage = [
  { day: "Mon", qbo: 1420, monday: 980 },
  { day: "Tue", qbo: 1610, monday: 1105 },
  { day: "Wed", qbo: 1290, monday: 870 },
  { day: "Thu", qbo: 1875, monday: 1240 },
  { day: "Fri", qbo: 2010, monday: 1390 },
  { day: "Sat", qbo: 340, monday: 210 },
  { day: "Sun", qbo: 285, monday: 190 },
];

export const auditLog = [
  { time: "Sep 12, 2026 01:52", actor: "System", action: "Sync completed", target: "Open Invoices → Accounts Receivable", detail: "62 records processed" },
  { time: "Sep 11, 2026 17:04", actor: "Jeff Wilson II", action: "Mapping updated", target: "Invoices ↔ Accounts Receivable", detail: "Payment Status set to two-way" },
  { time: "Sep 11, 2026 16:41", actor: "Jeff Wilson II", action: "Write-back posted", target: "QuickBooks Invoice 1041", detail: "From Monday item 8830142 · QBO ID 1041" },
  { time: "Sep 11, 2026 09:12", actor: "Dana Reyes", action: "Filter preset saved", target: "Bills Due in 30 Days", detail: "Applied to AP Tracker sync" },
  { time: "Sep 10, 2026 14:20", actor: "System", action: "Connection refreshed", target: "QuickBooks Online", detail: "OAuth token renewed" },
];

export const permissions = [
  { role: "Owner", connections: "Manage", mappings: "Manage", syncs: "Run & edit", writeBack: "Approve & post", admin: "Full" },
  { role: "Integration Admin", connections: "Manage", mappings: "Manage", syncs: "Run & edit", writeBack: "Approve & post", admin: "Limited" },
  { role: "Finance User", connections: "View", mappings: "View", syncs: "Run", writeBack: "Submit for approval", admin: "None" },
  { role: "Viewer", connections: "View", mappings: "View", syncs: "View", writeBack: "None", admin: "None" },
];
