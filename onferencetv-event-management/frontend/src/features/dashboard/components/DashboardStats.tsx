import { Calendar, CheckCircle, Users, FileText, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetEventsQuery } from '@/app/apiSlice';

export function DashboardStats() {
  const { data, isLoading } = useGetEventsQuery();
  const events = data?.data || [];

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.eventDate) >= new Date()).length;
  
  // Mocking the other two based on events for now
  const totalSpeakers = new Set(events.map(e => e.speakerName)).size || 18;
  const pdfExports = 36;

  const stats = [
    {
      title: 'Total Events',
      value: totalEvents,
      trend: '+12%',
      trendLabel: 'from last month',
      icon: Calendar,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-500/10'
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents,
      trend: '+20%',
      trendLabel: 'from last month',
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10'
    },
    {
      title: 'Total Speakers',
      value: totalSpeakers,
      trend: '+8%',
      trendLabel: 'from last month',
      icon: Users,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10'
    },
    {
      title: 'PDF Exports',
      value: pdfExports,
      trend: '+15%',
      trendLabel: 'from last month',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10'
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, i) => (
        <Card key={i} className="border shadow-sm hover:shadow-md transition-shadow group">
          <CardContent className="p-6 flex items-start gap-4">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <span className="text-emerald-500 font-medium flex items-center">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  {stat.trend}
                </span>
                {stat.trendLabel}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
