"use client";
import { FC } from "react";
import { Product } from "@/data/interface/Product";
import Image from "next/image";
import { calculateDiscountedPrice } from "@/util/commerce";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getProducts, getAllProducts } from "@/apis/commerce";
import { LoadingSpinner, FilterToggle } from "@/components";

interface ProductListProps {
    initialData: Product[];
}

const ProductList: FC<ProductListProps> = ({ initialData }) => {
    const { ref, inView } = useInView();

    const [data, setData] = useState<Product[]>(initialData);
    const [allData, setAllData] = useState<Product[] | null>(null);
    const [page, setPage] = useState<number>(2);
    const [isSoldOutButtonClick, setIsSoldOutButtonClick] = useState(false);

    const discount = 10;

    const getAllData = async () => {
        const res = await getAllProducts();

        setAllData(res);
    };

    const loadMoreData = async () => {
        const res = await getProducts(page);
        if (!res) {
            return null;
        }

        setData([...data, ...res]);
        setPage(page + 1);
    };

    useEffect(() => {
        getAllData();
    }, []);

    useEffect(() => {
        if (inView) {
            loadMoreData();
        }
    }, [inView]);

    const renderLoadingSpinner = () => {
        if (page >= 5 || isSoldOutButtonClick) {
            return null;
        }

        return (
            <div ref={ref}>
                <LoadingSpinner />
            </div>
        );
    };

    const onClickSoldOut = () => {
        setIsSoldOutButtonClick(!isSoldOutButtonClick);
    };

    const getVisibleData = () => {
        if (isSoldOutButtonClick && allData) {
            const newData = allData.filter((item) => item.isSoldOut === true);
            return newData;
        } else {
            const newData = data.filter((item) => item.isSoldOut === false);
            return newData;
        }
    };

    return (
        <div className="pt-6 pb-6">
            <FilterToggle
                isSoldOutButtonClick={isSoldOutButtonClick}
                onClickSoldOut={onClickSoldOut}
            />
            <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 pl-4 pr-4">
                {getVisibleData().map((item: Product) => {
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
