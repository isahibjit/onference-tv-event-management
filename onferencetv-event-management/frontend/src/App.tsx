import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import EventDashboard from './features/dashboard/EventDashboard';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="eventpro-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<EventDashboard />} />
            <Route path="events" element={<div className="p-8">Events (Coming Soon)</div>} />
            <Route path="ai-content" element={<div className="p-8">AI Content (Coming Soon)</div>} />
            <Route path="pdf-exports" element={<div className="p-8">PDF Exports (Coming Soon)</div>} />
            <Route path="reports" element={<div className="p-8">Reports (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
