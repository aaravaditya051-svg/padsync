// responsibility: Handles exporting the tldraw canvas to PNG and PDF
import { Editor, exportToBlob } from 'tldraw';
import { jsPDF } from 'jspdf';
import { Download, FileImage, FileText } from 'lucide-react';
import { useState } from 'react';

interface ExportPanelProps {
  editor: Editor | null;
}

export function ExportPanel({ editor }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);

  const getShapeIds = () => {
    if (!editor) return [];
    return Array.from(editor.getCurrentPageShapeIds());
  };

  const handleExportPNG = async () => {
    if (!editor) return;
    const shapeIds = getShapeIds();
    if (shapeIds.length === 0) return alert('Canvas is empty!');

    setIsExporting(true);
    try {
      const blob = await exportToBlob({
        editor,
        ids: shapeIds,
        format: 'png',
        opts: { padding: 32, background: true },
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `padsync-export-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!editor) return;
    const shapeIds = getShapeIds();
    if (shapeIds.length === 0) return alert('Canvas is empty!');

    setIsExporting(true);
    try {
      // Tldraw exports as PNG/SVG. We'll export as high-res PNG and embed it into a PDF
      const blob = await exportToBlob({
        editor,
        ids: shapeIds,
        format: 'png',
        opts: { padding: 32, background: true, scale: 2 },
      });

      const buffer = await blob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const imgData = `data:image/png;base64,${base64}`;

      // Create PDF matching A4 aspect ratio roughly
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [842, 595], // A4 Landscape roughly
      });

      // Get image dimensions
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => { img.onload = resolve; });

      // Calculate aspect ratio to fit within PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = img.width / img.height;
      const pdfRatio = pdfWidth / pdfHeight;

      let drawWidth = pdfWidth;
      let drawHeight = pdfHeight;

      if (imgRatio > pdfRatio) {
        drawHeight = pdfWidth / imgRatio;
      } else {
        drawWidth = pdfHeight * imgRatio;
      }

      // Center the image
      const x = (pdfWidth - drawWidth) / 2;
      const y = (pdfHeight - drawHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, drawWidth, drawHeight);
      pdf.save(`padsync-export-${Date.now()}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-panel">
      <div className="sidebar-label">
        <Download size={14} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
        Export Local
      </div>
      <div className="export-actions">
        <button
          className="export-btn"
          onClick={handleExportPNG}
          disabled={!editor || isExporting}
          title="Save canvas as PNG image"
        >
          <FileImage size={16} /> PNG
        </button>
        <button
          className="export-btn"
          onClick={handleExportPDF}
          disabled={!editor || isExporting}
          title="Save canvas as PDF document"
        >
          <FileText size={16} /> PDF
        </button>
      </div>
    </div>
  );
}
