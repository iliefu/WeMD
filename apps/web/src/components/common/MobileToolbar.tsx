import {
  Pencil,
  Eye,
  Copy,
  MoreHorizontal,
  Palette,
  Code,
  X,
  FolderOpen,
} from "lucide-react";
import { useState, useRef } from "react";
import type { MobileViewType } from "../../hooks/useMobileView";
import "./MobileToolbar.css";
import { useEditorStore } from "../../store/editorStore";

interface MobileToolbarProps {
  activeView: MobileViewType;
  onViewChange: (view: MobileViewType) => void;
  onCopyToWechat: () => void;
  onCopyAsHtml: () => void;
  onOpenTheme: () => void;
}

/**
 * 移动端底部工具栏
 */
export function MobileToolbar({
  activeView,
  onViewChange,
  onCopyToWechat,
  onCopyAsHtml,
  onOpenTheme,
}: MobileToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setMarkdown = useEditorStore((s) => s.setMarkdown);
  const setFilePath = useEditorStore((s) => s.setFilePath);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      setMarkdown(text);
      if (typeof setFilePath === "function") {
        setFilePath(file.name);
      }
      setShowMenu(false);
    } catch (err) {
      console.error("Failed to read file:", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,text/markdown,text/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {showMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMenu(false)}>
          <div
            className="mobile-menu-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <span>更多功能</span>
              <button
                className="mobile-menu-close"
                onClick={() => setShowMenu(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="mobile-menu-list">
              <button
                className="mobile-menu-item"
                onClick={() => {
                  openFilePicker();
                }}
              >
                <FolderOpen size={20} />
                <span>打开 Markdown</span>
              </button>

              <button
                className="mobile-menu-item"
                onClick={() => {
                  onCopyAsHtml();
                  setShowMenu(false);
                }}
              >
                <Code size={20} />
                <span>复制 HTML</span>
              </button>
              <button
                className="mobile-menu-item"
                onClick={() => {
                  onOpenTheme();
                  setShowMenu(false);
                }}
              >
                <Palette size={20} />
                <span>主题管理</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mobile-toolbar">
        <div className="mobile-toolbar-tabs">
          <button
            className={`mobile-tab ${activeView === "editor" ? "active" : ""}`}
            onClick={() => onViewChange("editor")}
            aria-label="编辑"
            title="编辑"
          >
            <Pencil size={18} />
            <span>编辑</span>
          </button>

          {/* New: Open Markdown button placed next to editor/preview */}
          <button
            className={`mobile-tab open-md-tab`}
            onClick={() => openFilePicker()}
            aria-label="打开 Markdown"
            title="打开 Markdown"
          >
            <FolderOpen size={18} />
            <span>打开</span>
          </button>

          <button
            className={`mobile-tab ${activeView === "preview" ? "active" : ""}`}
            onClick={() => onViewChange("preview")}
            aria-label="预览"
            title="预览"
          >
            <Eye size={18} />
            <span>预览</span>
          </button>
        </div>

        <div className="mobile-toolbar-actions">
          <button
            className="mobile-action-btn primary"
            onClick={onCopyToWechat}
            title="复制到微信"
          >
            <Copy size={18} />
          </button>
          <button
            className="mobile-action-btn"
            onClick={() => setShowMenu(true)}
            title="更多"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
