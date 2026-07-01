import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetEventsQuery } from '@/app/apiSlice';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function UpcomingEventsPanel() {
  const { data, isLoading } = useGetEventsQuery();
  
  // Get next 4 upcoming events
  const upcomingEvents = (data?.data || [])
    .filter(e => new Date(e.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 4);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-bold">Upcoming Events</CardTitle>
        <Link to="/events" className="text-xs font-semibold text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="grid gap-5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-3 group">
              <div className="h-12 w-12 rounded-lg bg-indigo-950 overflow-hidden flex-shrink-0 relative border">
                {/* Placeholder thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                  <Calendar className="h-5 w-5 text-indigo-300" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                  {event.eventName}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 truncate">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(event.eventDate), 'dd MMM yyyy')}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(event.eventDate), 'hh:mm a')}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 mt-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No upcoming events.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
