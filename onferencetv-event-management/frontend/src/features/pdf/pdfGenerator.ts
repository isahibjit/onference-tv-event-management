import jsPDF from "jspdf";
import { format } from "date-fns";

export interface PdfEventData {
  eventName: string;
  eventDate: string | Date;
  speakerName: string;
  speakerDesignation: string;
  description?: string | null;
  speakerIntro?: string | null;
}

export function generatePdfDocument(event: PdfEventData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin; // 170mm
  const bottomLimit = pageHeight - margin - 15; // 262mm

  let pageNum = 1;

  // Helper to draw Header on a page
  const drawHeader = () => {
    // Top slate header block
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, pageWidth, 16, "F");

    // Header branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("ONFERENCE TV", margin, 10.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text("•  EVENT briefing", margin + 32, 10.5);

    // Right-aligned classification
    doc.setTextColor(255, 255, 255);
    doc.text("OFFICIAL REPORT", pageWidth - margin, 10.5, { align: "right" });
  };

  // Helper to draw Footer on a page
  const drawFooter = (pNum: number, totalPagesPlaceholder: string) => {
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - margin + 2, pageWidth - margin, pageHeight - margin + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text("Onference-TV Management Portal. Confidential.", margin, pageHeight - margin + 8);
    doc.text(`Page ${pNum} of ${totalPagesPlaceholder}`, pageWidth - margin, pageHeight - margin + 8, {
      align: "right",
    });
  };

  // Setup the first page header
  drawHeader();

  let y = 32;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Slate 900
  const splitTitle = doc.splitTextToSize(event.eventName, contentWidth);
  doc.text(splitTitle, margin, y);
  y += splitTitle.length * 8 + 4;

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text("Official Event Briefing & Speaker Dossier", margin, y);
  y += 10;

  // Meta Info Box (Grid Layout)
  const boxHeight = 28;
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, boxHeight, "FD");

  // Grid labels
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate 500

  const col1 = margin + 8;
  const col2 = margin + contentWidth / 2 + 8;

  doc.text("EVENT DATE", col1, y + 6);
  doc.text("BROADCAST CHANNEL", col2, y + 6);

  // Grid values row 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42); // Slate 900
  let formattedDate = "";
  try {
    formattedDate = format(new Date(event.eventDate), "PPP");
  } catch (e) {
    formattedDate = String(event.eventDate);
  }
  doc.text(formattedDate, col1, y + 12);
  doc.text("Virtual Broadcast Studio", col2, y + 12);

  // Grid labels row 2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text("FEATURED SPEAKER", col1, y + 20);
  doc.text("SPEAKER ROLE", col2, y + 20);

  // Grid values row 2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229); // Indigo 600
  doc.text(event.speakerName, col1, y + 26);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(event.speakerDesignation || "Speaker", col2, y + 26);

  y += boxHeight + 15;

  // Helper to safely write text with page breaks
  const writeSection = (title: string, content: string, isBlockquote = false) => {
    // Check if header fits, otherwise break page
    if (y > bottomLimit - 25) {
      doc.addPage();
      pageNum++;
      drawHeader();
      y = 32;
    }

    // Section title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text(title, margin, y);
    
    // Indigo left highlight indicator
    doc.setFillColor(79, 70, 229);
    doc.rect(margin - 4, y - 3, 1.5, 4, "F");

    y += 8;

    // Content text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85); // Slate 700

    const textWidth = isBlockquote ? contentWidth - 14 : contentWidth;
    const textStart = isBlockquote ? margin + 7 : margin;
    
    // Normalise linebreaks and split to fit page width
    const splitLines = doc.splitTextToSize(content.replace(/\r\n/g, "\n"), textWidth);
    const lineHeight = 6;

    if (isBlockquote) {
      const quoteHeight = splitLines.length * lineHeight + 8;
      
      // If blockquote fits entirely, draw single background block
      if (y + quoteHeight <= bottomLimit) {
        doc.setFillColor(248, 250, 252); // Slate 50
        doc.rect(margin, y - 2, contentWidth, quoteHeight, "F");
        
        doc.setFillColor(99, 102, 241); // Indigo 500
        doc.rect(margin, y - 2, 1.5, quoteHeight, "F");
        
        y += 4;
        
        for (let i = 0; i < splitLines.length; i++) {
          doc.text(splitLines[i], textStart, y);
          y += lineHeight;
        }
        y += 8; // spacing after blockquote
      } else {
        // Otherwise, render line by line with background segments
        for (let i = 0; i < splitLines.length; i++) {
          if (y > bottomLimit) {
            doc.addPage();
            pageNum++;
            drawHeader();
            y = 32;
          }
          
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 2, contentWidth, lineHeight + 2, "F");
          doc.setFillColor(99, 102, 241);
          doc.rect(margin, y - 2, 1.5, lineHeight + 2, "F");
          
          doc.text(splitLines[i], textStart, y + 2);
          y += lineHeight;
        }
        y += 10;
      }
    } else {
      // Normal section rendering line-by-line with page overflow checking
      for (let i = 0; i < splitLines.length; i++) {
        if (y > bottomLimit) {
          doc.addPage();
          pageNum++;
          drawHeader();
          y = 32;
        }
        doc.text(splitLines[i], textStart, y);
        y += lineHeight;
      }
      y += 12; // margin bottom for next section
    }
  };

  if (event.description) {
    writeSection("01. EVENT OVERVIEW", event.description);
  }

  if (event.speakerIntro) {
    writeSection("02. SPEAKER INTRODUCTION & DOSSIER", event.speakerIntro, true);
  }

  // Draw footers on all pages dynamically with correct total page count
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages.toString());
  }

  return doc;
}
