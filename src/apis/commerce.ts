import { api } from "./createApi";
import { Product } from "@/data/interface/Product";

export const getProducts = async (page: number, perPage: number = 12) => {
    try {
        const res = await api.get(
            `/products?_page=${page}&_per_page=${perPage}`
        );

        return res.data.data;
    } catch (err) {
        return err;
    }
};
