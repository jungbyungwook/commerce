"use client";
import { SearchProductList } from "@/components";

import { useParams } from "next/navigation";

export default function Search() {
    const params = useParams();

    const renderProductList = () => {
        return (
            <SearchProductList
                searchedQuery={decodeURIComponent(params.query as string)}
            />
        );
    };

    return <main className="flex justify-center">{renderProductList()}</main>;
}
