import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { EventFormDialog } from '@/features/events/EventFormDialog';
import { DeleteEventDialog } from '@/features/events/DeleteEventDialog';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Global Dialogs */}
      <EventFormDialog />
      <DeleteEventDialog />
    </div>
  );
}
