import * as React from "react"
import { isNodeSelection, type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { FontFamilyIcon } from "../../custom-icons/font-family-icon"

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

const FONT_FAMILIES = [
  { label: "Inter", value: "Inter" },
  { label: "Comic Sans", value: '"Comic Sans MS", "Comic Sans"' },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Cursive", value: "cursive" },
  { label: "Exo 2", value: '"Exo 2"' }
] as const

export interface FontFamilyDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export function FontFamilyDropdownMenu({
  editor: providedEditor,
  hideWhenUnavailable = false,
  onOpenChange,
  ...props
}: FontFamilyDropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const editor = useTiptapEditor(providedEditor)

  const handleOnOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open)
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

    function canToggleFontFamily(editor: Editor | null): boolean {
      if (!editor) return false
      if (editor.isActive('codeBlock')) return false
      
      try {
        return editor.can().setFontFamily('Inter')
      } catch {
        return false
      }
    }

  const currentFamily = editor?.getAttributes('textStyle').fontFamily || "Inter"

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

  const isDisabled = !canToggleFontFamily(editor)

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          role="button"
          tabIndex={-1}
          aria-label="Change font family"
          tooltip="Font Family"
          disabled={isDisabled}
          {...props}
        >
          <FontFamilyIcon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          {FONT_FAMILIES.map((font) => (
            <DropdownMenuItem
              key={`font-family-${font.value}`}
              onSelect={() => editor.chain().focus().setFontFamily(font.value).run()}
            >
              <Button
                type="button"
                data-style="ghost"
                data-active-state={currentFamily === font.value ? "on" : "off"}
              >
                <span style={{ fontFamily: font.value }}>{font.label}</span>
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}