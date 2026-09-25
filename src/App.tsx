import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/AppLayout";
import BoardTable from "./pages/BoardTable";
import IntegrationHome from "./pages/IntegrationHome";
import Connections from "./pages/Connections";
import ImportData from "./pages/ImportData";
import BoardSetup from "./pages/BoardSetup";
import MappingStudio from "./pages/MappingStudio";
import QuickBooksActions from "./pages/QuickBooksActions";
import SyncHistory from "./pages/SyncHistory";
import AIReadiness from "./pages/AIReadiness";
import Settings from "./pages/Settings";
import Permissions from "./pages/Permissions";
import ApiUsage from "./pages/ApiUsage";
import AuditLog from "./pages/AuditLog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const routes: [string, React.ReactNode][] = [
  ["/", <IntegrationHome />],
  ["/connect", <Connections />],
  ["/build/import", <ImportData />],
  ["/build/board-setup", <BoardSetup />],
  ["/build/mapping", <MappingStudio />],
  ["/build/actions", <QuickBooksActions />],
  ["/operate/history", <SyncHistory />],
  ["/test/ai-readiness", <AIReadiness />],
  ["/admin/settings", <Settings />],
  ["/admin/permissions", <Permissions />],
  ["/admin/api-usage", <ApiUsage />],
  ["/admin/audit-log", <AuditLog />],
  ["/boards/accounts-receivable", <BoardTable board="accounts-receivable" />],
  ["/boards/invoice-prep", <BoardTable board="invoice-prep" />],
  ["/boards/customers", <BoardTable board="customers" />],
  ["/boards/tax-returns", <BoardTable board="tax-returns" />],
  ["/boards/monthly-close", <BoardTable board="monthly-close" />],
  ["/boards/advisory-projects", <BoardTable board="advisory-projects" />],
  ["/boards/client-onboarding", <BoardTable board="client-onboarding" />],
];

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      {routes.map(([path, element]) => (
        <Route key={path} path={path} element={<AppLayout>{element}</AppLayout>} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
