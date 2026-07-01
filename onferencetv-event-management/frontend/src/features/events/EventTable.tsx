import { format } from 'date-fns';
import { MoreHorizontal, Eye, Edit2, Trash2 } from 'lucide-react';
import type { EventResponse } from './eventSchemas';
import { useAppDispatch } from '@/app/hooks';
import { openEditDialog, openViewDialog, openDeleteDialog } from './eventSlice';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface EventTableProps {
  events: EventResponse[];
}

export default function EventTable({ events }: EventTableProps) {
  const dispatch = useAppDispatch();

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No events found</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          You haven't created any events yet. Click the "Create Event" button to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Speaker</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.eventName}</TableCell>
              <TableCell>
                {format(new Date(event.eventDate), 'PPP')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{event.speakerName}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {event.speakerDesignation}
                </Badge>
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[160px] p-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-9"
                      onClick={() => dispatch(openViewDialog(event.id))}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-9"
                      onClick={() => dispatch(openEditDialog(event.id))}
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Event
                    </Button>
                    <div className="h-px bg-border my-1" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-9 text-red-600 hover:text-red-600 hover:bg-red-100"
                      onClick={() => dispatch(openDeleteDialog(event.id))}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
