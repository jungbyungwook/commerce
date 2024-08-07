export interface Product {
    idx: string;
    itemId: string;
    createdAt: string | null;
    price: number;
    originPrice: number;
    discountRate: number;
    imageUrl: string;
    itemIsVerify: boolean;
    itemName: string;
    itemColor: string;
    shopId: number;
    shopName: string;
    shopType: string;
    isFetchingPay: boolean;
    brandName: string;
    sizes: string[];
    isFreeDelivery: boolean;
    isDomesticDelivery: boolean;
    deliveryForm: string;
    deliveryPeriod: string;
    interested: boolean;
    imageUrlList: string[];
    isSoldOut: boolean;
}
