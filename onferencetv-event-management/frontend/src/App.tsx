import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import EventDashboard from './features/dashboard/EventDashboard';
import { EventDetailsPage } from './features/events/EventDetailsPage';
import { AiContentPage } from './features/ai/AiContentPage';
import { PdfExportsPage } from './features/pdf/PdfExportsPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { SettingsPage } from './features/settings/SettingsPage';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="eventpro-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/events" replace />} />
            <Route path="events" element={<EventDashboard />} />
            <Route path="events/:id" element={<EventDetailsPage />} />
            <Route path="ai-content" element={<AiContentPage />} />
            <Route path="pdf-exports" element={<PdfExportsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
