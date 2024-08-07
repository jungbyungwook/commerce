"use client";
import { FC } from "react";
import { Product } from "@/data/interface/Product";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getAllProducts } from "@/apis/commerce";
import { SearchBar } from "@/components";
import { useRouter } from "next/navigation";
import { getPrice, getDiscount } from "@/util/commerce";

interface SearchProductListProps {
    searchedQuery: string;
}

const SearchProductList: FC<SearchProductListProps> = ({ searchedQuery }) => {
    const router = useRouter();
    const [allData, setAllData] = useState<Product[] | null>(null);
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

    useEffect(() => {
        getAllData();
    }, []);

    const createProductNames = () => {
        if (!allData) {
            return null;
        }
        const productNames = allData.map((item) => item.itemName);
        return productNames;
    };

    const getVisibleData = () => {
        const productNames = createProductNames();

        if (!productNames || !allData) {
            return null;
        }

        const filtered = productNames.filter((suggestion) =>
            suggestion.toLowerCase().includes(searchedQuery.toLowerCase())
        );

        console.log("filtered", filtered);

        const newData = allData.filter((item) =>
            filtered.includes(item.itemName)
        );

        return newData;
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

    const visibleData = getVisibleData();

    if (!visibleData) {
        return null;
    }

    return (
        <div className="pt-6 pb-6 ">
            <div className="flex items-center justify-center mb-14">
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

            <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 pl-4 pr-4">
                {visibleData.map((item: Product) => {
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
                            <p
                                className={`line-clamp-1 ${
                                    item.isSoldOut && "line-through"
                                }`}
                            >
                                {item.itemName}
                            </p>
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
        </div>
    );
};

export default SearchProductList;
