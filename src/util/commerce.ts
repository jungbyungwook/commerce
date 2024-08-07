export const getPrice = (price: number) => {
    return Number(Math.round(price / 10) * 10).toLocaleString() + "원";
};

export const getDiscount = (originPrice: number, price: number) => {
    const discountAmount = originPrice - price;

    const discountPercentage = ((discountAmount / originPrice) * 100).toFixed(
        0
    );

    return discountPercentage;
};
