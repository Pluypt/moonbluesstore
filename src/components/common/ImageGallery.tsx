"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-urban-light rounded-2xl flex items-center justify-center text-urban-gray">
                No Images Available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative bg-white rounded-2xl border border-urban-light overflow-hidden p-6 flex items-center justify-center">
                <Image
                    src={selectedImage}
                    alt={productName}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all ${selectedImage === img ? 'border-urban-black' : 'border-transparent hover:border-urban-gray/30'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`${productName} view ${index + 1}`}
                            fill
                            className="object-contain bg-white p-1"
                            sizes="80px"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
