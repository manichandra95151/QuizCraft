import  { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, Spacing, AlignmentType, HeadingLevel } from 'docx';
import { Download, FileText, File, ChevronDown } from 'lucide-react';

const DownloadButton = ({ text, results }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Check if there are any results to download
  const hasResults = results.summary || results.mcqs.length > 0 || results.fillblanks;

  // Function to generate and download PDF
  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;

      // Helper function to add text with word wrapping
      const addTextWithWrap = (text, x, y, fontSize = 12, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont(undefined, isBold ? 'bold' : 'normal');
        
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      };

      // Title
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('Generated Doc', margin, yPosition);
      yPosition += 20;

      // Original Article
      yPosition = addTextWithWrap('Original Article:', margin, yPosition, 16, true);
      yPosition += 5;
      yPosition = addTextWithWrap(text, margin, yPosition, 11);
      yPosition += 15;

      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.height - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // Summary
      if (results.summary) {
        yPosition = addTextWithWrap('Summary:', margin, yPosition, 16, true);
        yPosition += 5;
        yPosition = addTextWithWrap(results.summary, margin, yPosition, 11);
        yPosition += 15;
      }

      // MCQs
      if (results.mcqs && results.mcqs.length > 0) {
        if (yPosition > doc.internal.pageSize.height - 100) {
          doc.addPage();
          yPosition = 20;
        }

        yPosition = addTextWithWrap('Multiple Choice Questions:', margin, yPosition, 16, true);
        yPosition += 10;

        results.mcqs.forEach((mcq, index) => {
          if (yPosition > doc.internal.pageSize.height - 80) {
            doc.addPage();
            yPosition = 20;
          }

          // Question
          yPosition = addTextWithWrap(`${index + 1}. ${mcq.question}`, margin, yPosition, 12, true);
          yPosition += 5;

          // Options
          mcq.options.forEach((option, optIndex) => {
            const isCorrect = optIndex === mcq.correct;
            const optionText = `${String.fromCharCode(65 + optIndex)}. ${option}${isCorrect ? ' ✓' : ''}`;
            yPosition = addTextWithWrap(optionText, margin + 10, yPosition, 10, isCorrect);
            yPosition += 2;
          });
          yPosition += 10;
        });
      }

      // Fill in the Blanks
      if (results.fillblanks) {
        if (yPosition > doc.internal.pageSize.height - 60) {
          doc.addPage();
          yPosition = 20;
        }

        yPosition = addTextWithWrap('Fill in the Blanks:', margin, yPosition, 16, true);
        yPosition += 5;
        yPosition = addTextWithWrap(results.fillblanks, margin, yPosition, 11);
      }

      doc.save("GeneratedDoc.pdf");
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
      setIsDropdownOpen(false);
    }
  };

  // Function to generate and download Word document
  const downloadWord = async () => {
    setIsDownloading(true);
    try {
      const children = [
        // Title
        new Paragraph({
          children: [new TextRun({
            text: "Generated Doc",
            bold: true,
            size: 32
          })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        // Original Article
        new Paragraph({
          children: [new TextRun({
            text: "Original Article",
            bold: true,
            size: 24
          })],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({
            text: text,
            size: 22
          })],
          spacing: { after: 400 }
        }),
      ];

      // Summary
      if (results.summary) {
        children.push(
          new Paragraph({
            children: [new TextRun({
              text: "Summary",
              bold: true,
              size: 24
            })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({
              text: results.summary,
              size: 22
            })],
            spacing: { after: 400 }
          })
        );
      }

      // MCQs
      if (results.mcqs && results.mcqs.length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({
              text: "Multiple Choice Questions",
              bold: true,
              size: 24
            })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 }
          })
        );

        results.mcqs.forEach((mcq, index) => {
          // Question
          children.push(
            new Paragraph({
              children: [new TextRun({
                text: `${index + 1}. ${mcq.question}`,
                bold: true,
                size: 22
              })],
              spacing: { before: 200, after: 100 }
            })
          );

          // Options
          mcq.options.forEach((option, optIndex) => {
            const isCorrect = optIndex === mcq.correct;
            children.push(
              new Paragraph({
                children: [new TextRun({
                  text: `${String.fromCharCode(65 + optIndex)}. ${option}${isCorrect ? ' ✓' : ''}`,
                  bold: isCorrect,
                  size: 20
                })],
                spacing: { after: 50 }
              })
            );
          });
        });
      }

      // Fill in the Blanks
      if (results.fillblanks) {
        children.push(
          new Paragraph({
            children: [new TextRun({
              text: "Fill in the Blanks",
              bold: true,
              size: 24
            })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({
              text: results.fillblanks,
              size: 22
            })],
            spacing: { after: 200 }
          })
        );
      }

      const doc = new Document({
        sections: [{
          children
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "GeneratedDoc.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Word document generation failed:', error);
      alert('Failed to generate Word document. Please try again.');
    } finally {
      setIsDownloading(false);
      setIsDropdownOpen(false);
    }
  };

  // Function to handle download option selection
  const handleDownloadOption = (option) => {
    if (!hasResults) return;
    
    if (option === 'word') {
      downloadWord();
    } else if (option === 'pdf') {
      downloadPDF();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => hasResults && setIsDropdownOpen(!isDropdownOpen)}
        disabled={!hasResults || isDownloading}
        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
          hasResults && !isDownloading
            ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white cursor-pointer shadow-lg hover:shadow-xl' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Download className="w-4 h-4" />
        <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
        {hasResults && !isDownloading && (
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isDropdownOpen && hasResults && !isDownloading && (
        <div className="absolute top-full mt-2 right-0 bg-white shadow-xl rounded-lg border border-gray-200 z-50 min-w-[200px] overflow-hidden">
          <button 
            onClick={() => handleDownloadOption('word')} 
            className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-800 hover:bg-blue-50 transition-colors"
          >
            <File className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Download Word</span>
          </button>
          <div className="border-t border-gray-100"></div>
          <button 
            onClick={() => handleDownloadOption('pdf')} 
            className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <span className="font-medium">Download PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;