import React, { useState } from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import EditorBubbleMenu from './EditorBubbleMenu'

export default function ResourceCardEditor({ setEditorStateChanged, annotation }) {
    const [editorContent, setEditorContent] = useState('')
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-md lg:prose-lg dark:prose-invert focus:outline outline-amber-400 outline-offset-2 outline-2 rounded-md',
            },
        },
        content: annotation,
        onUpdate({ editor }) {
            const html = editor.getHTML()
            setEditorContent(html)
            setEditorStateChanged(true)
        },
        onBlur({ editor }) {
            if (editorContent === editor.options.content) {
                setEditorStateChanged(false)
            }
        }
    })

    return (
        <>
            {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} >
                <EditorBubbleMenu editor={editor} />
            </BubbleMenu>}
            <EditorContent editor={editor} />
        </>
    )
}
