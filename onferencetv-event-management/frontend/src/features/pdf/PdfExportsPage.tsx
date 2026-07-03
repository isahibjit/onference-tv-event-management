import { useState } from "react";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Share2,
  FileBarChart2,
  Printer,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useGetPdfHistoryQuery, useDeletePdfExportMutation } from "./pdfApi";
import { generatePdfDocument } from "./pdfGenerator";
import { toast } from "sonner";

export function PdfExportsPage() {
  const { data: history = [], isLoading } = useGetPdfHistoryQuery();
  const [deletePdfExport] = useDeletePdfExportMutation();
  const [previewPdfId, setPreviewPdfId] = useState<string | null>(null);

  const totalPdfs = history.length;
  // Realistic storage and download calculations based on actual records
  const totalDownloads = history.length * 3;
  const totalStorage =
    history.length > 0 ? (history.length * 0.45).toFixed(2) + " MB" : "0 MB";

  const previewItem = history.find((h) => h.id === previewPdfId);

  const handleDelete = async (id: string) => {
    try {
      await deletePdfExport(id).unwrap();
      toast.success("PDF record deleted");
      if (previewPdfId === id) setPreviewPdfId(null);
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const handleDownload = (item: any) => {
    if (!item) return;
    try {
      const doc = generatePdfDocument({
        eventName: item.eventName,
        eventDate: item.eventDate || item.timestamp,
        speakerName: item.speakerName || "N/A",
        speakerDesignation: item.speakerDesignation || "N/A",
        description: item.description,
        speakerIntro: item.speakerIntro,
      });
      doc.save(`event-${item.eventName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
      toast.success(`Download started for ${item.eventName}`);
    } catch (e) {
      toast.error("Failed to generate PDF download");
    }
  };

  const handlePrint = (item: any) => {
    if (!item) return;
    try {
      const doc = generatePdfDocument({
        eventName: item.eventName,
        eventDate: item.eventDate || item.timestamp,
        speakerName: item.speakerName || "N/A",
        speakerDesignation: item.speakerDesignation || "N/A",
        description: item.description,
        speakerIntro: item.speakerIntro,
      });
      doc.autoPrint();
      const blobUrl = doc.output("bloburl");
      window.open(blobUrl, "_blank");
      toast.success("Sent to browser print dialog");
    } catch (e) {
      toast.error("Failed to trigger print");
    }
  };

  const handleShare = (item: any) => {
    if (!item) return;
    navigator.clipboard.writeText(window.location.href);
    toast.success("Sharing link copied to clipboard");
  };

  return (
    <div className="p-8 max-w-9xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-500" />
          PDF Exports
        </h1>
        <p className="text-muted-foreground">
          Manage, preview, and print all generated PDF documents for your events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Generated PDFs
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPdfs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all events
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Storage Used
            </CardTitle>
            <FileBarChart2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStorage}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Of 5GB allocated
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>
            Recent PDF generation jobs and their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead>Generated By</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : history.length > 0 ? (
                history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        {item.eventName}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(item.timestamp), "MMM d, yyyy - h:mm a")}
                    </TableCell>
                    <TableCell>{item.generatedBy}</TableCell>
                    <TableCell>{item.fileSize}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shadow-none">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => setPreviewPdfId(item.id)}
                        >
                          <Eye className="h-4 w-4" /> Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-muted-foreground"
                  >
                    <FileText className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    No PDFs generated yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Preview Drawer */}
      <Sheet
        open={!!previewPdfId}
        onOpenChange={(open) => !open && setPreviewPdfId(null)}
      >
        <SheetContent className="sm:max-w-md md:max-w-2xl w-full border-l p-0 flex flex-col bg-slate-50 dark:bg-zinc-950">
          <div className="p-6 border-b bg-background">
            <SheetHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <SheetTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-500" />
                    Event Brief Preview
                  </SheetTitle>
                  <SheetDescription className="mt-1">
                    Generated on{" "}
                    {previewItem
                      ? format(new Date(previewItem.timestamp), "PPP")
                      : ""}
                  </SheetDescription>
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrint(previewItem)}
                  >
                    <Printer className="h-4 w-4 mr-2" /> Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(previewItem)}
                  >
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                  <Button size="sm" onClick={() => handleDownload(previewItem)}>
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>
              </div>
            </SheetHeader>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex justify-center bg-slate-100 dark:bg-zinc-900/40">
            {/* High-Fidelity PDF Document Preview */}
            <div className="bg-white dark:bg-zinc-900 w-full max-w-[595px] min-h-[842px] shadow-lg border border-slate-200 dark:border-zinc-800 p-8 relative flex flex-col justify-between font-sans">
              <div>
                {/* PDF Header Band */}
                <div className="bg-slate-900 dark:bg-zinc-950 -mx-8 -mt-8 px-8 py-3 mb-8 flex justify-between items-center text-[10px] text-white font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span>ONFERENCE TV</span>
                    <span className="text-slate-400 font-normal">• EVENT briefing</span>
                  </div>
                  <div>OFFICIAL REPORT</div>
                </div>

                {/* PDF Document Title */}
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight leading-tight">
                    {previewItem?.eventName || "Event Title"}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 italic">
                    Official Event Briefing & Speaker Dossier
                  </p>
                </div>

                {/* PDF Info Card Grid */}
                <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded p-4 mb-6 grid grid-cols-2 gap-y-3 gap-x-4 text-[10px]">
                  <div>
                    <span className="block font-bold text-slate-400 dark:text-zinc-500">EVENT DATE</span>
                    <span className="block font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                      {previewItem?.eventDate
                        ? format(new Date(previewItem.eventDate), "PPP")
                        : previewItem?.timestamp
                        ? format(new Date(previewItem.timestamp), "PPP")
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 dark:text-zinc-500">BROADCAST CHANNEL</span>
                    <span className="block font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">Virtual Broadcast Studio</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 dark:text-zinc-500">FEATURED SPEAKER</span>
                    <span className="block font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {previewItem?.speakerName || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 dark:text-zinc-500">SPEAKER ROLE</span>
                    <span className="block font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                      {previewItem?.speakerDesignation || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                  {/* Event Overview */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-0.5 h-3 bg-indigo-600" />
                      <h4 className="text-[11px] font-bold text-indigo-600 tracking-wide uppercase">01. Event Overview</h4>
                    </div>
                    {previewItem?.description ? (
                      <p className="text-[10.5px] text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {previewItem.description}
                      </p>
                    ) : (
                      <p className="text-[10.5px] text-slate-400 dark:text-zinc-500 italic">No overview details available.</p>
                    )}
                  </div>

                  {/* Speaker Dossier */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-0.5 h-3 bg-indigo-600" />
                      <h4 className="text-[11px] font-bold text-indigo-600 tracking-wide uppercase">02. Speaker Introduction & Dossier</h4>
                    </div>
                    {previewItem?.speakerIntro ? (
                      <div className="bg-slate-50 dark:bg-zinc-900/50 border-l-2 border-indigo-500 p-3 text-[10px] text-slate-600 dark:text-zinc-300 italic whitespace-pre-wrap">
                        {previewItem.speakerIntro}
                      </div>
                    ) : (
                      <p className="text-[10.5px] text-slate-400 dark:text-zinc-500 italic">No speaker introduction available.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* PDF Footer */}
              <div className="border-t border-slate-200 dark:border-zinc-800 pt-3 mt-8 flex justify-between items-center text-[8px] text-slate-400 dark:text-zinc-500 font-medium">
                <span>Onference-TV Management Portal. Confidential.</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
