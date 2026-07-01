import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { Download, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { closeViewDialog } from './eventSlice';
import { useEvent, useGenerateContent } from './eventQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function EventDetailsDialog() {
  const dispatch = useAppDispatch();
  const { isViewDialogOpen, selectedEventId } = useAppSelector((state) => state.event);

  const { data: event, isLoading } = useEvent(
    isViewDialogOpen ? selectedEventId : null
  );

  const generateMutation = useGenerateContent();

  const handleGenerateContent = async () => {
    if (!selectedEventId) return;
    try {
      await generateMutation.mutateAsync(selectedEventId);
      toast.success('Content generated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate content');
    }
  };

  const exportToPDF = () => {
    if (!event) return;

    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    doc.setFontSize(22);
    doc.text('Event Details', margin, y);
    y += 10;

    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(event.eventName, margin, y);
    y += 15;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Date: ${format(new Date(event.eventDate), 'PPP')}`, margin, y);
    y += 10;
    doc.text(`Speaker: ${event.speakerName} - ${event.speakerDesignation}`, margin, y);
    y += 15;

    if (event.description) {
      doc.setFontSize(14);
      doc.text('Description', margin, y);
      y += 8;
      doc.setFontSize(11);
      const splitDesc = doc.splitTextToSize(event.description, 170);
      doc.text(splitDesc, margin, y);
      y += splitDesc.length * 6 + 10;
    }

    if (event.speakerIntro) {
      // Check page boundary
      if (y > 250) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(14);
      doc.text('Speaker Introduction', margin, y);
      y += 8;
      doc.setFontSize(11);
      const splitIntro = doc.splitTextToSize(event.speakerIntro, 170);
      doc.text(splitIntro, margin, y);
    }

    doc.save(`event-details-${event.eventName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    toast.success('PDF exported successfully');
  };

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={(open) => !open && dispatch(closeViewDialog())}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between mt-2">
          <DialogTitle className="text-2xl">Event Details</DialogTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              disabled={isLoading || !event}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !event ? (
          <div className="text-center py-8 text-muted-foreground">
            Event not found.
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">{event.eventName}</h3>
              <p className="text-muted-foreground flex items-center gap-2">
                {format(new Date(event.eventDate), 'PPPP')}
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Speaker</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{event.speakerName}</span>
                <Badge variant="secondary">{event.speakerDesignation}</Badge>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-medium">Event Content</h4>
                {(!event.description || !event.speakerIntro) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={handleGenerateContent}
                    disabled={generateMutation.isPending}
                  >
                    <Sparkles className="h-4 w-4" />
                    {generateMutation.isPending ? 'Generating...' : 'Generate AI Content'}
                  </Button>
                )}
              </div>

              {event.description ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm text-muted-foreground">Description</h5>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm text-muted-foreground">Speaker Introduction</h5>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed italic border-l-2 pl-4 text-muted-foreground">
                      "{event.speakerIntro}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-lg bg-muted/10">
                  <p className="text-muted-foreground text-sm mb-3">
                    No content generated for this event yet.
                  </p>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleGenerateContent}
                    disabled={generateMutation.isPending}
                  >
                    <Sparkles className="h-4 w-4" />
                    {generateMutation.isPending ? 'Generating...' : 'Generate AI Content'}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground pt-4">
              <span>Created: {format(new Date(event.createdAt), 'PP p')}</span>
              <span>Updated: {format(new Date(event.updatedAt), 'PP p')}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
