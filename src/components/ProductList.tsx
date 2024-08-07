"use client";
import { FC } from "react";
import { Product } from "@/data/interface/Product";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getProducts, getAllProducts } from "@/apis/commerce";
import { LoadingSpinner, FilterToggle, SearchBar } from "@/components";
import { useRouter } from "next/navigation";
import { getPrice, getDiscount } from "@/util/commerce";

interface ProductListProps {
    initialData: Product[];
}

const ProductList: FC<ProductListProps> = ({ initialData }) => {
    const router = useRouter();
    const { ref, inView } = useInView();
    const [data, setData] = useState<Product[]>(initialData);
    const [allData, setAllData] = useState<Product[] | null>(null);
    const [page, setPage] = useState<number>(2);
    const [isSoldOutButtonClick, setIsSoldOutButtonClick] = useState(false);
    const [query, setQuery] = useState<string>("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(
        []
    );
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

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
        if (page >= 18 || isSoldOutButtonClick) {
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

    const createProductNames = () => {
        if (!allData) {
            return null;
        }
        const productNames = allData.map((item) => item.itemName);
        return productNames;
    };

    const pressEnter = (e) => {
        if (!allData) {
            return null;
        }
        if (e.key === "Enter") {
            if (query === "") {
                router.push("/");
            } else {
                const encodedQuery = encodeURIComponent(query.trim());
                router.push(`/search/${encodedQuery}`);
            }
        }
    };

    const renderFilterToggle = () => {
        return (
            <FilterToggle
                isSoldOutButtonClick={isSoldOutButtonClick}
                onClickSoldOut={onClickSoldOut}
            />
        );
    };

    return (
        <div className="pt-6 pb-6 ">
            <div className="flex items-center justify-center">
                <SearchBar
                    productNames={createProductNames()}
                    query={query}
                    setQuery={setQuery}
                    filteredSuggestions={filteredSuggestions}
                    setFilteredSuggestions={setFilteredSuggestions}
                    showSuggestions={showSuggestions}
                    setShowSuggestions={setShowSuggestions}
                    pressEnter={pressEnter}
                />
            </div>

            {renderFilterToggle()}
            <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 pl-4 pr-4">
                {getVisibleData().map((item: Product) => {
                    return (
                        <div key={item.idx}>
                            <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 relative mb-4">
                                <Image
                                    src={item.imageUrl}
                                    // src={item.imageUrlList[1]}
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    fill={true}
                                    alt={item.itemName}
                                    priority
                                />
                            </div>
                            <p className="font-semibold">{item.brandName}</p>
                            <p className="line-clamp-1">{item.itemName}</p>
                            <p className="font-semibold text-orange-500	">{`${getDiscount(
                                item.originPrice,
                                item.price
                            )}%`}</p>

                            <div className="flex">
                                <p className="mr-2 font-semibold">{`${getPrice(
                                    item.price
                                )}`}</p>
                                <p className="line-through text-slate-400">{`${getPrice(
                                    item.originPrice
                                )}`}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {renderLoadingSpinner()}
        </div>
    );
};

export default ProductList;
