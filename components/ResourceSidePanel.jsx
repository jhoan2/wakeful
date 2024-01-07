import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { useCeramicContext } from '../context';
import { toast } from 'sonner';

export default function ResourceSidePanel({ data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false)
    const clients = useCeramicContext();
    const { composeClient } = clients
    const {
        author,
        createdAt,
        description,
        doi,
        isbn,
        id,
        title,
        updatedAt,
        url } = data.node
    const localeCreatedAt = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    const localeUpdatedAt = new Date(updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    const {
        register,
        handleSubmit,
    } = useForm()

    const filterEmptyFields = (obj) => {
        const filteredObj = {};
        Object.keys(obj).forEach(key => {
            if (obj[key] !== '') {
                filteredObj[key] = obj[key];
            }
        });
        return filteredObj;
    }

    const onSubmit = async (data) => {
        const filterdObj = filterEmptyFields(data)
        filterdObj.clientMutationId = composeClient.id
        filterdObj.id = id
        try {
            setSubmitLoading(true)
            const res = await fetch('http://localhost:3000/api/updateResource', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: filterdObj
                }),
            })

            if (!res.ok) {
                setSubmitLoading(false)
                toast.error('Something went wrong')
                throw new Error('Server responded with an error: ' + res.status);
            }

            setSubmitLoading(false)
            toast.success('Successfully updated resource!');
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-gray-200 hover:bg-gray-300 text-gray-700 rounded fixed top-1/2  ease-in-out duration-300 transform -translate-y-1/2 z-50 ${isOpen ? 'right-3/4 md:right-1/2' : 'right-0'}`}
                title={'Edit Resource'}
            >
                {isOpen ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M10.0859 12.0001L5.29297 16.793L6.70718 18.2072L12.9143 12.0001L6.70718 5.79297L5.29297 7.20718L10.0859 12.0001ZM17.0001 6.00008L17.0001 18.0001H15.0001L15.0001 6.00008L17.0001 6.00008Z"></path></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg>
                }
            </button>
            <div
                className={`fixed top-0 right-0 w-3/4 md:w-1/2 h-full bg-white shadow-xl overflow-auto duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Panel content */}
                <div className="p-4">
                    {isEditOpen ?
                        <div className='space-y-4'>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <h2 className="font-bold text-lg">{title}</h2>
                                <div>
                                    <label htmlFor="url" className="block text-sm font-medium leading-6 text-gray-900">Url</label>
                                    <p className='bg-slate-100'>{url}</p>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                                    <div className="mt-2">
                                        <textarea id="description" {...register("description")} rows="3" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder={`${description}`}></textarea>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="isbn" className="block text-sm font-medium leading-6 text-gray-900">ISBN</label>
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input type="text" {...register("isbn")} id="isbn" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder={`${isbn}`} />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="doi" className="block text-sm font-medium leading-6 text-gray-900">DOI</label>
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input type="text" {...register("doi")} id="doi" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder={`${doi}`} />
                                    </div>
                                </div>
                                <div className='flex justify-between mt-2'>
                                    <button type="button" onClick={() => setIsEditOpen(!isEditOpen)} className="px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:bg-blue-100 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                        {submitLoading ?
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3 animate-spin'><path d="M11.9995 2C12.5518 2 12.9995 2.44772 12.9995 3V6C12.9995 6.55228 12.5518 7 11.9995 7C11.4472 7 10.9995 6.55228 10.9995 6V3C10.9995 2.44772 11.4472 2 11.9995 2ZM11.9995 17C12.5518 17 12.9995 17.4477 12.9995 18V21C12.9995 21.5523 12.5518 22 11.9995 22C11.4472 22 10.9995 21.5523 10.9995 21V18C10.9995 17.4477 11.4472 17 11.9995 17ZM20.6597 7C20.9359 7.47829 20.772 8.08988 20.2937 8.36602L17.6956 9.86602C17.2173 10.1422 16.6057 9.97829 16.3296 9.5C16.0535 9.02171 16.2173 8.41012 16.6956 8.13398L19.2937 6.63397C19.772 6.35783 20.3836 6.52171 20.6597 7ZM7.66935 14.5C7.94549 14.9783 7.78161 15.5899 7.30332 15.866L4.70525 17.366C4.22695 17.6422 3.61536 17.4783 3.33922 17C3.06308 16.5217 3.22695 15.9101 3.70525 15.634L6.30332 14.134C6.78161 13.8578 7.3932 14.0217 7.66935 14.5ZM20.6597 17C20.3836 17.4783 19.772 17.6422 19.2937 17.366L16.6956 15.866C16.2173 15.5899 16.0535 14.9783 16.3296 14.5C16.6057 14.0217 17.2173 13.8578 17.6956 14.134L20.2937 15.634C20.772 15.9101 20.9359 16.5217 20.6597 17ZM7.66935 9.5C7.3932 9.97829 6.78161 10.1422 6.30332 9.86602L3.70525 8.36602C3.22695 8.08988 3.06308 7.47829 3.33922 7C3.61536 6.52171 4.22695 6.35783 4.70525 6.63397L7.30332 8.13398C7.78161 8.41012 7.94549 9.02171 7.66935 9.5Z"></path></svg>
                                            : null
                                        }
                                        Submit
                                    </button>
                                </div>
                                <div className='flex justify-between text-sm fixed bottom-0 left-0 right-0'>
                                    <p>Created At: {localeCreatedAt}</p>
                                    <p>Last Updated: {localeUpdatedAt}</p>
                                </div>
                            </form>
                        </div>
                        :
                        <div className='space-y-4'>
                            <h2 className="font-bold text-lg">{title}</h2>
                            <div>
                                <label htmlFor="url" className="block text-sm font-medium leading-6 text-gray-900">Url</label>
                                <p className='bg-slate-100'>{url}</p>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                                {description ? <p className='bg-slate-100'>{description}</p> : <p className='bg-slate-100 h-12'></p>}
                            </div>
                            <div>
                                <label htmlFor="ibsn" className="block text-sm font-medium leading-6 text-gray-900">ISBN</label>
                                {isbn ? <p className='bg-slate-100'>{isbn}</p> : <p className='bg-slate-100 h-6'></p>}
                            </div>
                            <div>
                                <label htmlFor="doi" className="block text-sm font-medium leading-6 text-gray-900">DOI</label>
                                {isbn ? <p className='bg-slate-100'>{doi}</p> : <p className='bg-slate-100 h-6'></p>}
                            </div>
                            <button type="button" onClick={() => setIsEditOpen(!isEditOpen)} className="px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:bg-blue-100 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                Edit
                            </button>
                            <div className='flex justify-between text-sm fixed bottom-0 left-0 right-0'>
                                <p>Created At: {localeCreatedAt}</p>
                                <p>Last Updated: {localeUpdatedAt}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}
