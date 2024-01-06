import React from 'react';

export default function Skeleton({ number }: { number: number }) {
    return (
        <>
            {Array(number)
                .fill(0)
                .map((el, index) => (
                    <span key={index} className="flex flex-row items-center py-2 rounded bg-zinc-800 animate-pulse w-full">
                        <div className="flex-grow">
                            <span className="bg-zinc-800 h-2 w-1/2 rounded-full animate-pulse"></span>
                        </div>
                    </span>
                ))}
        </>
    );
}
