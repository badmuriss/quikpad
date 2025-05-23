import * as React from "react"
import { isNodeSelection, type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { FontSizeIcon } from "../../custom-icons/font-size-icon"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/tiptap-ui-primitive/dropdown-menu"

const FONT_SIZES = [
  { label: "12pt", value: "12pt" },
  { label: "18pt", value: "18pt" },
  { label: "24pt", value: "24pt" },
  { label: "32pt", value: "32pt" },
] as const

export interface FontSizeDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export function FontSizeDropdownMenu({
  editor: providedEditor,
  hideWhenUnavailable = false,
  onOpenChange,
  ...props
}: FontSizeDropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const editor = useTiptapEditor(providedEditor)

  const handleOnOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open)
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  function canToggleFontSize(editor: Editor | null): boolean {
    if (!editor) return false
    if (editor.isActive('codeBlock')) return false
  
    try {
      return editor.can().setFontSize('18pt')
    } catch {
      return false
    }
  }

  const currentSize = editor?.getAttributes('textStyle').fontSize || "18pt"

  const show = React.useMemo(() => {
    if (!editor) return false
    if (hideWhenUnavailable && isNodeSelection(editor.state.selection)) {
      return false
    }
    return true
  }, [editor, hideWhenUnavailable])

  if (!show || !editor || !editor.isEditable) {
    return null
  }

  const isDisabled = !canToggleFontSize(editor)

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          role="button"
          tabIndex={-1}
          aria-label="Change font size"
          tooltip="Font Size"
          disabled={isDisabled}
          {...props}
        >
          <FontSizeIcon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          {FONT_SIZES.map((size) => (
            <DropdownMenuItem
              key={`font-size-${size.value}`}
              onSelect={() => editor.chain().focus().setFontSize(size.value).run()}
            >
              <Button
                type="button"
                data-style="ghost"
                data-active-state={currentSize === size.value ? "on" : "off"}
              >
                {size.label}
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}