// responsibility: renders the pen/eraser/clear toolbar for the phone drawing canvas
import { Pencil, Eraser, Trash2 } from 'lucide-react';
import { useEditor } from 'tldraw';
import { useEffect } from 'react';

export function PhoneToolbar() {
  const editor = useEditor();

  // Sets the active drawing tool
  const setTool = (toolId: string) => {
    editor.setCurrentTool(toolId);
  };

  // Auto-select draw tool on mount
  useEffect(() => {
    editor.setCurrentTool('draw');
  }, [editor]);

  // Clears all shapes from the canvas
  const handleClear = () => {
    const shapeIds = Array.from(editor.getCurrentPageShapeIds());
    if (shapeIds.length > 0) {
      editor.deleteShapes(shapeIds);
    }
  };

  const activeTool = editor.getCurrentToolId();

  return (
    <div className="phone-toolbar">
      <button
        id="tool-pen"
        className={`tool-btn ${activeTool === 'draw' ? 'active' : ''}`}
        onClick={() => setTool('draw')}
        title="Pen"
      >
        <Pencil size={20} />
      </button>
      <button
        id="tool-eraser"
        className={`tool-btn ${activeTool === 'eraser' ? 'active' : ''}`}
        onClick={() => setTool('eraser')}
        title="Eraser"
      >
        <Eraser size={20} />
      </button>
      <div className="toolbar-divider" />
      <button
        id="tool-clear"
        className="tool-btn destructive"
        onClick={handleClear}
        title="Clear canvas"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
