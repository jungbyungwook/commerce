"use client";
import { FC } from "react";
import { Product } from "@/data/interface/Product";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getAllProducts } from "@/apis/commerce";
import { SearchBar } from "@/components";
import { useRouter } from "next/navigation";

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
            const encodedQuery = encodeURIComponent(query.trim());
            router.push(`/search/${encodedQuery}`);
        }
    };

    const visibleData = getVisibleData();

    if (!visibleData) {
        return null;
    }

    return (
        <div className="pt-6 pb-6">
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

            <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 pl-4 pr-4">
                {visibleData.map((item: Product) => {
                    return (
                        <div key={item.idx}>
                            <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 relative mb-4">
                                <Image
                                    src={item.imageUrl}
                                    // src={item.imageUrlList[1]}
                                    fill={true}
                                    alt={item.itemName}
                                />
                            </div>
                            <p>{item.brandName}</p>
                            <p className="line-clamp-1">{item.itemName}</p>
                            <p>{`${discount}%`}</p>
                            <p>{`${item.price}`}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchProductList;
