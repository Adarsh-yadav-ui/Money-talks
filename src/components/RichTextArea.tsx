"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

type RichTextAreaProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function RichTextArea({ value, onChange, placeholder }: RichTextAreaProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: placeholder ?? "Write here..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] w-full px-3 py-2 text-sm outline-none",
      },
    },
  });

  if (!editor) return null;

  const tools = [
    { label: "Bold", action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive("bold") },
    { label: "Italic", action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive("italic") },
    { label: "Underline", action: () => editor.chain().focus().toggleUnderline().run(), isActive: editor.isActive("underline") },
    { label: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive("heading", { level: 1 }) },
    { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive("heading", { level: 2 }) },
    { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive("heading", { level: 3 }) },
    { label: "Bullet", action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive("bulletList") },
    { label: "Ordered", action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive("orderedList") },
  ];

  return (
    <div className="border-2 border-border bg-background">
      <div className="flex flex-wrap gap-1 border-b-2 border-border p-1">
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={t.action}
            className={cn(
              "px-2 py-1 text-xs font-base border-2 border-border hover:bg-main hover:text-main-foreground transition-colors",
              t.isActive && "bg-main text-main-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
