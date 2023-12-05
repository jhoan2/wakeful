import React, { useState } from 'react'
import ResourceCardEditor from './ResourceCardEditor'
import { gql, useMutation } from '@apollo/client';

export default function ResourceCard({ card }) {
    const [editorStateChanged, setEditorStateChanged] = useState(false)
    const { annotation, quote, id } = card.node

    const UPDATE_NOTE = gql`
    mutation UPDATE_NOTE($input: UpdateCardInput!) {
        updateCard(input: $input) {
          document {
            id
            annotation
          }
        }
      }`

    const GET_CARDS_FOR_RESOURCE = gql`
      query MyQuery ($resourceId: ID!, $account: ID!) {
        node(id: $resourceId) {
          ... on IcarusResource {
            author
            createdAt
            description
            doi
            id
            mediaType
            isbn
            title
            updatedAt
            url
            cards(account: $account, last: 10, filters: {where: {deleted: {equalTo: false}}}) {
              edges {
                node {
                  id
                  annotation
                  quote
                }
              }
            }
          }
        }
      }
        `

    const [sendDeleteNote, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(UPDATE_NOTE, {
        refetchQueries: [
            { query: GET_CARDS_FOR_RESOURCE }
        ]
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

    const showTextArea = () => {
        console.log('show text area')
    }

    // console.log(deleteData, deleteError)

    return (
        <div className="m-3 flex flex-col bg-white border shadow-sm max-w-sm rounded-xl group hover:shadow-lg transition p-6 dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <div className='flex justify-end mb-3'>
                <button className='hover:bg-gray-300 rounded-xl' onClick={() => deleteNote()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-4 h-4'><path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path></svg>
                </button>
            </div>
            <ResourceCardEditor setEditorStateChanged={setEditorStateChanged} annotation={annotation} />
            <div className="mt-3 p-4 inline-flex items-center gap-x-1 text-sm rounded-lg border border-transparent text-gray-400 disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 cursor-default">
                {quote}
            </div>
            <div className='flex mt-3 justify-between'>
                <p className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-500">
                    Updated November 7, 2022
                </p>
                <div className='space-x-3'>
                    <button className='py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600' title='Add an image'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
                    </button>
                    {editorStateChanged ?
                        <button title='Submit Changes' className='py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'>
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
