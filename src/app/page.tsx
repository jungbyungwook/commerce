import { getProducts } from "@/apis/commerce";
import ProductList from "@/components/ProductList";

export default async function Home() {
    const initialData = await getProducts(1);

    if (!initialData) {
        return null;
    }

    const renderProductList = () => {
        return <ProductList initialData={initialData} />;
    };

    return <main className="flex justify-center">{renderProductList()}</main>;
}
