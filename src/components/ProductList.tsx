import { FC } from "react";
import { Product } from "@/data/interface/Product";
import Image from "next/image";
import { calculateDiscountedPrice } from "@/util/commerce";

interface ProductListProps {
    items: Product[];
}

const ProductList: FC<ProductListProps> = ({ items }) => {
    const discount = 10;
    return (
        <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 pl-4 pr-4">
            {items.map((item: Product) => {
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
    );
};

export default ProductList;
