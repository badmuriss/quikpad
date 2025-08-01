import * as React from "react"
import { useRef, useState, useEffect } from 'react'
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import { FontFamily } from "@tiptap/extension-font-family"
import { FontSize } from "tiptap-extension-font-size"

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension"
import { Selection } from "@/components/tiptap-extension/selection-extension"
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { NodeButton } from "@/components/tiptap-ui/node-button"
import {
  HighlightPopover,
  HighlightContent,
  HighlighterButton,
} from "@/components/tiptap-ui/highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"
import { FontSizeDropdownMenu } from "../../../../src/components/custom-tiptap-ui/font-size-dropdown-menu"
import { FontFamilyDropdownMenu } from "../../../../src/components/custom-tiptap-ui/font-family-dropdown-menu"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"
import { Note } from "src/types"
import { ShareButton } from '../../../../src/components/share-button';
import { useDebounce } from 'use-debounce'
import { updateNote } from "../../../../src/utils/api"

// Modifique o MainToolbarContent para incluir os novos controles
const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <FontSizeDropdownMenu />
        <FontFamilyDropdownMenu />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
        <NodeButton type="codeBlock" />
        <NodeButton type="blockquote" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <HighlightPopover />
        ) : (
          <HighlighterButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? <HighlightContent /> : <LinkContent />}
  </>
)

export function SimpleEditor(note: Note) {
  const isMobile = useMobile()
  const windowSize = useWindowSize()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const [rect, setRect] = React.useState<
    Pick<DOMRect, "x" | "y" | "width" | "height">
  >({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Modificado para ignorar movimento vertical
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!toolbarRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - toolbarRef.current.offsetLeft);
    setScrollLeft(toolbarRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !toolbarRef.current) return;
    e.preventDefault();
    const x = e.pageX - toolbarRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    toolbarRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
  if (!toolbarRef.current) return;

  setIsDragging(true);
  setStartX(e.touches[0].pageX - toolbarRef.current.offsetLeft);
  setScrollLeft(toolbarRef.current.scrollLeft);

  const startY = e.touches[0].pageY;
  (e.currentTarget as HTMLElement).dataset.startY = startY.toString();
};

const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
  if (!isDragging || !toolbarRef.current) return;

  const currentX = e.touches[0].pageX - toolbarRef.current.offsetLeft;
  const currentY = e.touches[0].pageY;

  const startYAttr = (e.currentTarget as HTMLElement).dataset.startY;
  const startY = startYAttr ? parseFloat(startYAttr) : 0;

  const deltaY = Math.abs(currentY - startY);
  const deltaX = Math.abs(currentX - startX);

  if (deltaX > deltaY) {
    e.preventDefault();
    const walk = (currentX - startX) * 2;
    toolbarRef.current.scrollLeft = scrollLeft - walk;
  } else {
    setIsDragging(false);
  }
};


const handleTouchEnd = () => {
  setIsDragging(false);
};

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalTouchEnd = () => setIsDragging(false);

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, []);

  React.useEffect(() => {
    const updateRect = () => {
      setRect(document.body.getBoundingClientRect())
    }

    updateRect()

    const resizeObserver = new ResizeObserver(updateRect)
    resizeObserver.observe(document.body)

    window.addEventListener("scroll", updateRect)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("scroll", updateRect)
    }
  }, [])


  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
      TextStyle,
      FontFamily,
      FontSize,

      Selection,
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    content: note.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
    
      const MAX_SIZE = 100 * 1024; // 100kb
      if (html.length > MAX_SIZE) {
        alert('Content too large');
        return;
      }
      
      setCurrentContent(html);
    },
  })

  const [currentContent, setCurrentContent] = useState(note.content);
  const [debouncedContent] = useDebounce(currentContent, 2000);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  
  useEffect(() => {
    if (editor) {
      const html = editor.getHTML();
      if (html) {
        setCurrentContent(html);
      }
    }
  }, [editor]);

  useEffect(() => {
    if (debouncedContent && debouncedContent !== note.content) {
      setIsSaving(true);
      setSaveError(false);
      
      updateNote(note.id, debouncedContent)
        .then(() => {
          setTimeout(() => {
            setIsSaving(false);
          }, 200);
        })
        .catch((error) => {
          console.error(error.message)
          setIsSaving(false);
          setSaveError(true);
        });
    }
  }, [debouncedContent, note.id, note.content]);


  useEffect(() => {
    const checkCursorVisibility = () => {
      if (!editor || !toolbarRef.current) return;

      const {
        state,
        view
      } = editor;
      if (!view.hasFocus()) return;

      const {
        from
      } = state.selection;
      const cursorCoords = view.coordsAtPos(from);

      if (windowSize.height < rect.height) {
        if (cursorCoords && toolbarRef.current) {
          const toolbarHeight = toolbarRef.current.getBoundingClientRect().height;
          const isEnoughSpace = windowSize.height - cursorCoords.top - toolbarHeight > 0;

          if (!isEnoughSpace) {
            const scrollY = cursorCoords.top - windowSize.height / 2 + toolbarHeight;
            window.scrollTo({
              top: scrollY,
              behavior: "smooth",
            });
          }
        }
      }
    };

    checkCursorVisibility();
  }, [editor, rect.height, windowSize.height]);

  const handleContentClick = () => {
    if (isMobile && editor) {
      editor.commands.focus();
    }
  };  

  const handleToolbarClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
    }
  };

  return (
    <EditorContext.Provider value={{ editor }}>
     
      
      <div
        className="toolbar-container"
        ref={toolbarRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleToolbarClick}
      >
        <Toolbar
      
        ref={toolbarRef}
        style={
          isMobile
            ? {
                bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
              }
            : {}
        }
      >
        <div className="ms-2 save-status min-w-20 flex items-center">
          {isSaving && (
            <span className="flex items-center space-x-2 text-purple-500 text-sm">
              <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </span>
          )}
          {saveError && (
            <span className="flex items-center space-x-1 text-red-500 text-sm">
              <span>Error Saving</span>
            </span>
          )}
        </div>
        {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        <div className="flex justify-center m-4">
          <button 
            className="flex text-sm items-center gap-2 px-3 py-2 bg-[#7c3aed] text-white rounded-md font-medium hover:bg-[#6d28d9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-opacity-50"
            onClick={() => window.location.href = '/'}
            aria-label="Create new note"
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </Toolbar>
      </div>

      <div className="content-wrapper" onClick={handleContentClick}>
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </div>

      <ShareButton 
        editor={editor} 
        noteId={note.id} 
      />
    </EditorContext.Provider>
  )
}
