"use client";
import { ProductList } from "@/components";

import { useParams } from "next/navigation";

export default function Search() {
    const params = useParams();

    const renderProductList = () => {
        return <ProductList initialData={null} searchedQuery={params.query} />;
    };

    return <main className="flex justify-center">{renderProductList()}</main>;
}
