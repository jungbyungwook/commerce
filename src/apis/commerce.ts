import { api } from "./createApi";

export const getProducts = async (page: number, perPage: number) => {
    try {
        const res = await api.get(
            `/products?_page=${page}&_per_page=${perPage}`
        );

        return res.data.data;
    } catch (err) {
        return err;
    }
};
