import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from './eventSchemas';
import type { EventInput } from './eventSchemas';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { closeCreateDialog, closeEditDialog } from './eventSlice';
import { useCreateEvent, useUpdateEvent, useEvent } from './eventQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function EventFormDialog() {
  const dispatch = useAppDispatch();
  const { isCreateDialogOpen, isEditDialogOpen, selectedEventId } = useAppSelector(
    (state) => state.event
  );

  const isOpen = isCreateDialogOpen || isEditDialogOpen;
  const isEditMode = isEditDialogOpen && !!selectedEventId;

  const { data: eventToEdit, isLoading: isLoadingEvent } = useEvent(
    isEditMode ? selectedEventId : null
  );

  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventName: '',
      eventDate: '',
      speakerName: '',
      speakerDesignation: '',
    },
  });

  useEffect(() => {
    if (isEditMode && eventToEdit) {
      setValue('eventName', eventToEdit.eventName);
      // Ensure date is formatted as YYYY-MM-DD for the input type="date"
      const d = new Date(eventToEdit.eventDate);
      setValue('eventDate', d.toISOString().split('T')[0]);
      setValue('speakerName', eventToEdit.speakerName);
      setValue('speakerDesignation', eventToEdit.speakerDesignation);
    } else if (isCreateDialogOpen) {
      reset();
    }
  }, [isEditMode, eventToEdit, isCreateDialogOpen, setValue, reset]);

  const onSubmit = async (data: EventInput) => {
    try {
      if (isEditMode && selectedEventId) {
        await updateMutation.mutateAsync({ id: selectedEventId, data });
        toast.success('Event updated successfully');
        dispatch(closeEditDialog());
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Event created successfully');
        dispatch(closeCreateDialog());
      }
      reset();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while saving the event');
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (isCreateDialogOpen) dispatch(closeCreateDialog());
      if (isEditDialogOpen) dispatch(closeEditDialog());
      reset();
    }
  };

  const isWorking = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the details of your event below.'
              : 'Fill in the details to create a new event. All fields are required.'}
          </DialogDescription>
        </DialogHeader>

        {isEditMode && isLoadingEvent ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                placeholder="e.g. React Advanced Conference"
                {...register('eventName')}
                disabled={isWorking}
              />
              {errors.eventName && (
                <p className="text-sm text-red-500">{errors.eventName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                {...register('eventDate')}
                disabled={isWorking}
              />
              {errors.eventDate && (
                <p className="text-sm text-red-500">{errors.eventDate.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="speakerName">Speaker Name</Label>
                <Input
                  id="speakerName"
                  placeholder="e.g. John Doe"
                  {...register('speakerName')}
                  disabled={isWorking}
                />
                {errors.speakerName && (
                  <p className="text-sm text-red-500">{errors.speakerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="speakerDesignation">Designation</Label>
                <Input
                  id="speakerDesignation"
                  placeholder="e.g. Senior Engineer"
                  {...register('speakerDesignation')}
                  disabled={isWorking}
                />
                {errors.speakerDesignation && (
                  <p className="text-sm text-red-500">{errors.speakerDesignation.message}</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isWorking}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isWorking}>
                {isWorking ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
