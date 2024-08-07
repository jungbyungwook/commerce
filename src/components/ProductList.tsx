"use client";
import { FC } from "react";
import { Product } from "@/data/interface/Product";
import Image from "next/image";
import { calculateDiscountedPrice } from "@/util/commerce";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getProducts } from "@/apis/commerce";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProductListProps {
    initialData: Product[];
}

const ProductList: FC<ProductListProps> = ({ initialData }) => {
    const { ref, inView } = useInView();

    const [data, setData] = useState<Product[]>(initialData);
    const [page, setPage] = useState<number>(2);

    const discount = 10;

    const loadMoreData = async () => {
        const res = await getProducts(page);
        if (!res || !data) {
            return null;
        }

        setData([...data, ...res]);

        setPage(page + 1);
    };

    useEffect(() => {
        if (inView) {
            loadMoreData();
        }
    }, [inView]);

    const renderLoadingSpinner = () => {
        if (page >= 5) {
            return null;
        }

        return (
            <div ref={ref}>
                <LoadingSpinner />
            </div>
        );
    };

    return (
        <div className="pt-6 pb-6">
            <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 pl-4 pr-4">
                {data.map((item: Product) => {
                    return (
                        <div key={item.idx}>
                            <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 relative mb-4">
                                <Image
                                    src={item.imageUrl}
                                    fill={true}
                                    alt={item.itemName}
                                />
                            </div>
                            <p className="line-clamp-1">{item.itemName}</p>

                            <p>{`${discount}%`}</p>
                            <p>{`${calculateDiscountedPrice(
                                item.price,
                                discount
                            ).toFixed(2)}$`}</p>
                        </div>
                    );
                })}
            </div>
            {renderLoadingSpinner()}
        </div>
    );
};

export default ProductList;
