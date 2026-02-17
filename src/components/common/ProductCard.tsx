import Link from 'next/link';
import Image from 'next/image';
import { Sneaker } from '@/types/sneaker';
import { formatTHB } from '@/lib/price';

interface ProductCardProps {
    product: Sneaker;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const price = product.lowestResellPrice.stockX || product.retailPrice;

    return (
        <Link href={`/product/${product.styleID}`} className="group block h-full select-none touch-manipulation">
            <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform active:scale-95 sm:hover:-translate-y-1 h-full flex flex-col relative border border-urban-light/50">
                {/* Image Container */}
                <div className="aspect-square relative bg-urban-light/30 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
                    {product.thumbnail ? (
                        <Image
                            src={product.thumbnail}
                            alt={product.shoeName}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            loading="lazy"
                        />
                    ) : (
                        <div className="text-urban-gray text-xs sm:text-sm">No Image</div>
                    )}
                    {/* Badge */}
                    {product.brand && (
                        <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-urban-black/90 text-white text-[0.6rem] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 uppercase tracking-wider rounded-sm backdrop-blur-sm">
                            {product.brand}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-urban-black font-inter font-bold text-sm sm:text-lg leading-tight mb-1 line-clamp-2 group-hover:text-urban-gray transition-colors h-9 sm:h-12">
                        {product.shoeName}
                    </h3>
                    <p className="text-urban-gray text-[0.65rem] sm:text-sm mb-2 sm:mb-4 font-kanit truncate">
                        {product.styleID}
                    </p>

                    <div className="mt-auto pt-2 border-t border-urban-light">
                        <p className="text-[0.6rem] sm:text-xs text-urban-gray font-bold uppercase tracking-wide font-kanit mb-0.5">ราคาเริ่มต้น</p>
                        <div className="flex items-center justify-between">
                            <p className="text-urban-black font-inter font-black text-lg sm:text-xl text-brand-blue">
                                {formatTHB(price)}
                            </p>

                            {/* Mobile visual cue */}
                            <div className="sm:hidden text-brand-yellow font-bold text-xs">
                                ดูราคา &gt;
                            </div>

                            {/* Desktop hover arrow */}
                            <div className="hidden sm:block bg-urban-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
