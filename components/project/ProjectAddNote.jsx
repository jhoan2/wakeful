import React, { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorBubbleMenu from '../EditorBubbleMenu';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectAddNote({ projectId, setShowProjectModal }) {
    const [inputImage, setInputImage] = useState(false)
    const [loadingCreateCollection, setLoadingCreateCollection] = useState(false)
    const [image, setImage] = useState(null);
    const projectCardResourceId = "kjzl6kcym7w8y6onb4pnwt9mjehz06ftqmygolw4wrttmbjrbr1ugssx5hrk278"


    const ADD_NOTE = gql`
    mutation ADD_NOTE($input: CreateIdealiteCardv1Input!) {
        createIdealiteCardv1(input: $input) {
          document {
            id
          }
        }
      }`

    const [addNote, { data: dataAddNote, error: errorAddNote }] = useMutation(ADD_NOTE);

    const CREATE_COLLECTION = gql`
    mutation createCollection($input: CreateIdealiteProjectCardCollectionInput!) {
        createIdealiteProjectCardCollection(input: $input) {
          document {
            id
          }
        }
      }`

    const [createCollection, { data: dataCreateCollection, error: errorCreateCollection }] = useMutation(CREATE_COLLECTION, {
        onCompleted: () => setShowProjectModal(false),
        refetchQueries: ['getUsersProjectCardCollection'],
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        editorProps: {
            attributes: {
                class: 'prose leading-3 p-2 prose-md lg:leading-3 lg:prose-lg  dark:prose-invert outline outline-amber-400 max-w-full outline-offset-2 outline-2 rounded-md',
            },
        },
        content: '',
    })

    const handleClickOutside = (event) => {
        if (event.target !== document.getElementById('modal-content') && event.target.contains(document.getElementById('modal-content'))) {
            setShowProjectModal(false)
        }
    };

    const pinFileToIPFS = async (file) => {
        const formData = new FormData();
        formData.set('file', file)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/cardImage`, {
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
        setImage(file);
        const inputElement = document.getElementById('input-image');
        inputElement.disabled = true;
    }

    const handleSubmit = async () => {
        setLoadingCreateCollection(true)
        const content = editor.getHTML()
        let IpfsHash, PinSize;

        if (image) {
            const data = await pinFileToIPFS(image);
            IpfsHash = data?.IpfsHash;
            PinSize = data?.PinSize;
        }

        let noteContent = {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            annotation: content,
            cid: IpfsHash,
            resourceId: projectCardResourceId,
            mimeType: image?.type,
            pinSize: PinSize,
            deleted: false,
        }

        for (const key in noteContent) {
            if (noteContent[key] === undefined || noteContent[key] === null) {
                delete noteContent[key];
            }
        }

        addNote({
            variables: {
                input: {
                    content: noteContent
                }
            }
        }).then((data) => {
            if (data.data.createIdealiteCardv1.document.id) {
                createCollection({
                    variables: {
                        input: {
                            content: {
                                projectId: projectId,
                                idealiteCardId: data.data.createIdealiteCardv1.document.id,
                                deleted: false
                            }
                        }
                    }
                })
                setLoadingCreateCollection(false)

            } else {
                throw new Error('Error creating project and card collection')
            }
        })

    }

    if (errorAddNote) {
        toast.error("Oops, something went wrong creating a card!")
        console.log(errorAddNote.message)
    }

    if (errorCreateCollection) {
        toast.error("Oops, something went wrong creating a collection!")
        console.log(errorCreateCollection.message)
    }


    return (
        <div className='fixed z-10 top-0 left-0 w-full h-full overflow-auto bg-gray-700 bg-opacity-75' onClick={(e) => handleClickOutside(e)}>
            <div className='flex place-content-center mt-60 '>
                <div id='modal-content' className="m-3 flex flex-col bg-white border w-full md:w-1/2 md:h-2/3 shadow-sm rounded-xl group hover:shadow-lg transition p-6 dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                    <div className='flex justify-end mb-3'>
                        <button className='hover:bg-gray-300 rounded-xl' title='Close Modal' onClick={() => setShowProjectModal(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-4 h-4'><path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path></svg>
                        </button>
                    </div>

                    {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} >
                        <EditorBubbleMenu editor={editor} />
                    </BubbleMenu>}
                    <EditorContent editor={editor} className={`${inputImage ? 'hidden' : ''}`} />
                    {image && (
                        <img src={URL.createObjectURL(image)} alt="Pasted Image" />
                    )}
                    {inputImage ?
                        <input onPaste={handlePaste} id='paste-image' className={`${image && 'hidden'} placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm`} placeholder="Paste image here" type="text" name="Paste Image" autoComplete='off' />
                        :
                        null
                    }
                    <div className='flex mt-3 justify-between items-center'>
                        <input
                            type='file'
                            id='input-image'
                            onChange={(event) => setImage(event.target.files[0])}
                            className={`${inputImage ? '' : 'invisible'} file:py-2 file:px-3 file:inline-flex file:items-center file:gap-x-2 file:text-sm file:font-semibold file:rounded-lg file:border file:border-transparent file:bg-blue-100 file:text-blue-800 file:hover:bg-blue-200 file:disabled:opacity-50 file:disabled:pointer-events-none file:dark:hover:bg-blue-900 file:dark:text-blue-400 file:dark:focus:outline-none file:dark:focus:ring-1 file:dark:focus:ring-gray-600`} />
                        <div className='flex space-x-3'>
                            <button onClick={() => setInputImage(!inputImage)} className='py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600' title='Add an image'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
                            </button>
                            {loadingCreateCollection ?
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button> :
                                <button title='Submit Note' onClick={() => handleSubmit()} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                    Submit
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
