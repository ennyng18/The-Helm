import { PageHeader, Panel, Table, Th, Td, StatusPill } from "@/components/helm/ui";
import { permissions } from "@/data/helm";

const members = [
  { name: "Jeff Wilson II", email: "jeff@riverstone.com", role: "Owner" },
  { name: "Dana Reyes", email: "dana@riverstone.com", role: "Integration Admin" },
  { name: "Marcus Hale", email: "marcus@riverstone.com", role: "Finance User" },
  { name: "Priya Nandi", email: "priya@riverstone.com", role: "Viewer" },
];

export default function Permissions() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Permissions" subtitle="Who can change connections and mappings, and who can post records into QuickBooks." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="People">
          <Table head={<><Th>Name</Th><Th>Email</Th><Th>Role</Th></>}>
            {members.map((m) => (
              <tr key={m.email}>
                <Td className="font-medium">{m.name}</Td>
                <Td className="text-muted-foreground">{m.email}</Td>
                <Td><StatusPill tone="info">{m.role}</StatusPill></Td>
              </tr>
            ))}
          </Table>
        </Panel>

        <Panel title="What each role can do">
          <Table head={<><Th>Role</Th><Th>Connections</Th><Th>Mappings</Th><Th>Syncs</Th><Th>Write-back</Th></>}>
            {permissions.map((p) => (
              <tr key={p.role}>
                <Td className="font-medium">{p.role}</Td>
                <Td className="text-muted-foreground">{p.connections}</Td>
                <Td className="text-muted-foreground">{p.mappings}</Td>
                <Td className="text-muted-foreground">{p.syncs}</Td>
                <Td className="text-muted-foreground">{p.writeBack}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}
