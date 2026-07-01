import { DashboardStats } from "./components/DashboardStats";
import { EventsTable } from "./components/EventsTable";
import { UpcomingEventsPanel } from "./components/UpcomingEventsPanel";
import { MonthlyStatistics } from "./components/MonthlyStatistics";
import { QuickActions } from "./components/QuickActions";
import { RecentActivity } from "./components/RecentActivity";

export default function EventDashboard() {
  return (
    <div className="flex flex-col w-full max-w-8xl mx-auto animate-in fade-in duration-500">
      <DashboardStats />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column (70%) */}
        <div className="xl:col-span-8 flex flex-col gap-8 min-w-0">
          <EventsTable />
          <RecentActivity />
        </div>

        {/* Right Column (30%) */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-w-0">
          <UpcomingEventsPanel />
          <MonthlyStatistics />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
