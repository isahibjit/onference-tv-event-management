import { useEvents } from './eventQueries';
import { useAppDispatch } from '@/app/hooks';
import { openCreateDialog } from './eventSlice';
import EventTable from './EventTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import EventFormDialog from './EventFormDialog';
import EventDetailsDialog from './EventDetailsDialog';
import DeleteEventDialog from './DeleteEventDialog';

export default function EventDashboard() {
  const { data: events, isLoading, isError } = useEvents();
  const dispatch = useAppDispatch();

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Create, view, and manage your upcoming events.
          </p>
        </div>
        <Button onClick={() => dispatch(openCreateDialog())} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Create Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>A list of all events currently managed in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 p-8">
              Failed to load events. Please try again later.
            </div>
          ) : (
            <EventTable events={events || []} />
          )}
        </CardContent>
      </Card>

      <EventFormDialog />
      <EventDetailsDialog />
      <DeleteEventDialog />
    </div>
  );
}
