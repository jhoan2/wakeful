import React, { useState } from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import EditorBubbleMenu from './EditorBubbleMenu';
import StarterKit from '@tiptap/starter-kit';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';

export default function ResourceCard({ card }) {
    const [editorStateChanged, setEditorStateChanged] = useState(false)
    const { annotation, quote, id, updatedAt, cid } = card.node
    const localeUpdatedAt = new Date(updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    const [inputImage, setInputImage] = useState(false)
    const [uploadImage, setUploadImage] = useState(null)
    const [editorContent, setEditorContent] = useState('')

    const UPDATE_NOTE = gql`
    mutation UPDATE_NOTE($input: UpdateCardInput!) {
        updateCard(input: $input) {
          document {
            id
            annotation
          }
        }
      }`

    const [sendUpdateNote, { data, loading, error }] = useMutation(UPDATE_NOTE, {
        refetchQueries: ['getCardsForResource'],
    });

    const [sendDeleteNote, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(UPDATE_NOTE, {
        refetchQueries: ['getCardsForResource'],
    });

    const deleteNote = async () => {
        await sendDeleteNote({
            variables: {
                input: {
                    id: id,
                    content: {
                        updatedAt: new Date().toISOString(),
                        deleted: true,
                    }
                }
            }
        })
    }

    const handlePaste = (event) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData || !clipboardData.items.length) return;

        const item = clipboardData.items[0];
        if (!item.type.startsWith('image/')) {
            const inputElement = document.getElementById('paste-image');
            inputElement.value = '';
            return;
        };

        const file = item.getAsFile();
        setUploadImage(file);
        const inputElement = document.getElementById('input-image');
        inputElement.disabled = true;
    }

    const pinFileToIPFS = async (file) => {
        const formData = new FormData();
        formData.set('file', file)

        try {
            const res = await fetch("http://localhost:3000/api/cardImage", {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const { pinataData } = data;
            return pinataData;
        } catch (error) {
            console.log(error);
        }
    }

    const handleUploadImage = (image) => {
        setUploadImage(image)
        setShowSubmit(true)
    }

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

    const updateNote = async () => {
        const content = editor.getHTML()
        let IpfsHash, PinSize;

        if (uploadImage) {
            const data = await pinFileToIPFS(uploadImage);
            IpfsHash = data?.IpfsHash;
            PinSize = data?.PinSize;
        }

        let noteContent = {
            updatedAt: new Date().toISOString(),
            annotation: content,
            cid: IpfsHash,
            mimeType: uploadImage?.type,
            pinSize: PinSize,
        }

        for (const key in noteContent) {
            if (noteContent[key] === undefined || noteContent[key] === null) {
                delete noteContent[key];
            }
        }

        await sendUpdateNote({
            variables: {
                input: {
                    id: id,
                    content: noteContent
                }
            }
        })
    }

    return (
        <div className="m-3 relative flex flex-col bg-white border shadow-sm max-w-lg md:max-w-md rounded-xl group hover:shadow-lg transition p-6 dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <button className='absolute top-2 right-2 text-red-300 hover:bg-red-600 rounded-md p-1' onClick={() => deleteNote()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-4 h-4'><path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path></svg>
            </button>
            {quote ?
                <p className='italic border rounded p-2 hover:bg-gray-100'>
                    {quote}
                </p> :
                null
            }
            {cid ?
                <div className='mb-4'>
                    <Image src={`https://purple-defensive-anglerfish-674.mypinata.cloud/ipfs/${cid}?img-width=240`} width={240} height={240} />
                </div>
                : null
            }
            {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} >
                <EditorBubbleMenu editor={editor} />
            </BubbleMenu>}
            <EditorContent editor={editor} />
            {uploadImage && (
                <img src={URL.createObjectURL(uploadImage)} alt="Pasted Image" />
            )}
            {inputImage ?
                <input onPaste={handlePaste} id='paste-image' className={`${uploadImage && 'hidden'} placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm`} placeholder="Paste image here" type="text" name="Paste Image" autoComplete='off' />
                :
                null
            }
            <div className='flex mt-3 justify-between items-center'>
                <p className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-500">
                    {localeUpdatedAt}
                </p>
                <input
                    type='file'
                    id='input-image'
                    onChange={(event) => handleUploadImage(event.target.files[0])}
                    className={`${inputImage ? '' : 'invisible'} file:py-2 file:px-3 file:inline-flex file:items-center file:gap-x-2 file:text-sm file:font-semibold file:rounded-lg file:border file:border-transparent file:bg-blue-100 file:text-blue-800 file:hover:bg-blue-200 file:disabled:opacity-50 file:disabled:pointer-events-none file:dark:hover:bg-blue-900 file:dark:text-blue-400 file:dark:focus:outline-none file:dark:focus:ring-1 file:dark:focus:ring-gray-600`} />
                <div className='flex space-x-3'>
                    {!cid ?
                        <button onClick={() => setInputImage(!inputImage)} className='py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600' title='Add an image'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
                        </button> :
                        null
                    }
                    {editorStateChanged ?
                        <button title='Submit Note' onClick={() => updateNote()} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                            Submit
                        </button> :
                        null
                    }
                    {/* <button className='hover:bg-gray-300 rounded-xl' title='Send to a Project'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M12 2.58594L18.2071 8.79304L16.7929 10.2073L13 6.41436V16.0002H11V6.41436L7.20711 10.2073L5.79289 8.79304L12 2.58594ZM3 18.0002V14.0002H5V18.0002C5 18.5524 5.44772 19.0002 6 19.0002H18C18.5523 19.0002 19 18.5524 19 18.0002V14.0002H21V18.0002C21 19.657 19.6569 21.0002 18 21.0002H6C4.34315 21.0002 3 19.657 3 18.0002Z"></path></svg>
                    </button> */}
                </div>
            </div>
        </div>
    )
}
