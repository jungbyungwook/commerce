import Image from "next/image";
import { getProducts } from "@/apis/commerce";
import ProductList from "@/components/ProductList";

export default async function Home() {
    const data = await getProducts(1, 10);

    if (!data) {
        return null;
    }

    const renderProducts = () => {
        return <ProductList items={data} />;
    };

    return <main className="flex justify-center">{renderProducts()}</main>;
}
