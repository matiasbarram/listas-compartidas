'use client'

import { useEffect } from 'react'

interface IError {
    error: Error
    reset: () => void
}


export default function Error({ error, reset }: IError) {

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className='flex flex-col items-center justify-center h-screen space-y-4'>
            <h2>Something went wrong!</h2>
            <svg className='w-16 h-16 text-red-500' fill='currentColor' viewBox='0 0 24 24'>
                <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM11.293 7.293L12 6.586L12.707 7.293L16.414 11L12.707 14.707L12 14L11.293 14.707L7.586 11L11.293 7.293ZM12 17C11.447 17 11 16.553 11 16C11 15.447 11.447 15 12 15C12.553 15 13 15.447 13 16C13 16.553 12.553 17 12 17Z'
                />
            </svg>
            <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                onClick={() => reset()}
            >
                Try again
            </button>
        </div>
    )
}