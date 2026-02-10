const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-full flex flex-col border border-urban-light">
            <div className="aspect-square bg-urban-light animate-pulse"></div>
            <div className="p-4 flex flex-col flex-grow space-y-3">
                <div className="h-6 bg-urban-light rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-urban-light rounded animate-pulse w-1/2"></div>
                <div className="mt-auto pt-4 border-t border-urban-light flex justify-between items-center">
                    <div className="h-8 bg-urban-light rounded animate-pulse w-1/3"></div>
                    <div className="h-8 w-8 bg-urban-light rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
