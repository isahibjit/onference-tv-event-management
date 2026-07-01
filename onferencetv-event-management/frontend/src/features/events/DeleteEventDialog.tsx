import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { closeDeleteDialog } from './eventSlice';
import { useDeleteEventMutation } from '@/app/apiSlice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export function DeleteEventDialog() {
  const dispatch = useAppDispatch();
  const { isDeleteDialogOpen, selectedEventId } = useAppSelector((state) => state.event);
  
  const [deleteEvent, { isLoading }] = useDeleteEventMutation();

  const handleDelete = async () => {
    if (!selectedEventId) return;
    
    try {
      await deleteEvent(selectedEventId).unwrap();
      toast.success('Event deleted successfully');
      dispatch(closeDeleteDialog());
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete event');
    }
  };

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && dispatch(closeDeleteDialog())}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the event
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
