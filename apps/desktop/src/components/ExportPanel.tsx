// responsibility: Handles exporting the tldraw canvas to PNG and PDF
import { Editor, exportAs, type TLShapeId } from 'tldraw';
import { jsPDF } from 'jspdf';
import { Download, FileImage, FileText } from 'lucide-react';
import { useState } from 'react';

interface ExportPanelProps {
  editor: Editor | null;
}

export function ExportPanel({ editor }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);

  const getShapeIds = (): TLShapeId[] => {
    if (!editor) return [];
    return Array.from(editor.getCurrentPageShapeIds()) as TLShapeId[];
  };

  const handleExportPNG = async () => {
    if (!editor) return;
    const shapeIds = getShapeIds();
    if (shapeIds.length === 0) return alert('Canvas is empty!');

    setIsExporting(true);
    try {
      await exportAs(editor, shapeIds, {
        format: 'png',
        name: `padsync-export-${Date.now()}`,
        background: true,
      });
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
      // Bypass missing type definition for getSvg
      const svg = await (editor as any).getSvg(shapeIds, { padding: 32, background: true });
      if (!svg) throw new Error('Failed to get SVG');
      
      const svgString = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      await new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width * 2; // High res
          canvas.height = img.height * 2;
          ctx?.scale(2, 2);
          ctx?.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [842, 595],
          });

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

          const x = (pdfWidth - drawWidth) / 2;
          const y = (pdfHeight - drawHeight) / 2;

          pdf.addImage(imgData, 'PNG', x, y, drawWidth, drawHeight);
          pdf.save(`padsync-export-${Date.now()}.pdf`);
          URL.revokeObjectURL(url);
          resolve(true);
        };
        img.onerror = reject;
        img.src = url;
      });
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
