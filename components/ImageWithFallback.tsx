
'use client';

import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

export default function ImageWithFallback({
    src,
    alt,
    fallbackSrc = '/placeholder-news.jpg', // You might need to create this or use a data URI or just a div
    className,
    ...props
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false);
    const imgRef = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete) {
            if (img.naturalWidth === 0) {
                setError(true);
            }
        }
    }, [src]);

    if (error || !src) {
        return (
            <div className={`flex items-center justify-center bg-slate-800 text-slate-500 ${className}`}>
                <span className="text-sm p-4 text-center">No Image Available</span>
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
}
