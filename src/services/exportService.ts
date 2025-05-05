
import { RssItem } from "./rssService";
import { toast } from "sonner";

export const exportToPDF = async (items: RssItem[], searchTerm?: string): Promise<void> => {
  try {
    // Dynamically import jsPDF to reduce initial bundle size
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default;
    const doc = new jsPDF();
    
    const title = searchTerm 
      ? `TUNEI: Search Results for "${searchTerm}"`
      : "TUNEI: News Summary";
      
    const date = new Date().toLocaleDateString();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(0, 63, 192); // TUNEI blue
    doc.text(title, 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${date}`, 20, 30);
    
    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);
    
    let yPosition = 45;
    
    // Add each article
    items.forEach((item, index) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Article title
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      
      // Handle title wrapping
      const splitTitle = doc.splitTextToSize(item.title, 170);
      doc.text(splitTitle, 20, yPosition);
      yPosition += (splitTitle.length * 7);
      
      // Source and date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "italic");
      
      const formattedDate = new Date(item.publishDate).toLocaleDateString();
      doc.text(`Source: ${item.source} | ${formattedDate}`, 20, yPosition);
      yPosition += 7;
      
      // Sentiment indicator
      doc.setFontSize(10);
      let sentimentColor;
      switch(item.sentiment) {
        case "positive":
          sentimentColor = [0, 170, 0]; // Green
          break;
        case "negative":
          sentimentColor = [170, 0, 0]; // Red
          break;
        default:
          sentimentColor = [100, 100, 100]; // Gray
      }
      doc.setTextColor(sentimentColor[0], sentimentColor[1], sentimentColor[2]);
      doc.text(`Sentiment: ${item.sentiment}`, 20, yPosition);
      yPosition += 10;
      
      // Description
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      
      const cleanDescription = item.description
        .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
        .substring(0, 300) + (item.description.length > 300 ? "..." : "");
      
      const splitDesc = doc.splitTextToSize(cleanDescription, 170);
      doc.text(splitDesc, 20, yPosition);
      yPosition += (splitDesc.length * 6) + 5;
      
      // Source URL in small text
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 255);
      doc.text(`Original URL: ${item.link}`, 20, yPosition);
      
      // Add space between articles
      yPosition += 15;
      
      // Add a separator line except for the last item
      if (index < items.length - 1) {
        doc.setDrawColor(230, 230, 230);
        doc.line(20, yPosition - 5, 190, yPosition - 5);
      }
    });
    
    // Add footer with TUNEI branding
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('TUNEI - Tune into real-time truth', 20, 290);
      doc.text(`Page ${i} of ${pageCount}`, 170, 290);
    }
    
    // Save the PDF
    const filename = searchTerm 
      ? `tunei-${searchTerm.replace(/\s+/g, '-').toLowerCase()}.pdf`
      : 'tunei-news-summary.pdf';
      
    doc.save(filename);
    
    toast.success(`Your PDF has been exported as ${filename}`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast.error("There was an error creating your PDF. Please try again.");
  }
};
