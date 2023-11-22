import React, { useState } from 'react'

export default function ResourceSidePanel() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-gray-200 hover:bg-gray-300 text-gray-700 rounded fixed top-1/2  ease-in-out duration-300 transform -translate-y-1/2 z-50 ${isOpen ? 'right-3/4 md:right-1/2' : 'right-0'}`}
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
                    <h2 className="font-bold text-lg">Slide Over Panel</h2>
                    <p>Content goes here...</p>
                </div>
            </div>
        </div>
    )
}
