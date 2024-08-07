"use client";
import { FC } from "react";

interface FilterToggleProps {
    onClickSoldOut: () => void;
    isSoldOutButtonClick: boolean;
}

const FilterToggle: FC<FilterToggleProps> = ({
    onClickSoldOut,
    isSoldOutButtonClick,
}) => {
    return (
        <div className="max-w-5xl pl-2 pr-2 mb-3">
            <button
                className={`px-4 py-2 font-semibold rounded-2xl shadow-md border border-gray-300 ml-2 mr-2 transform transition-transform duration-300 ease-in-out ${
                    isSoldOutButtonClick && "bg-slate-200"
                } hover:scale-105`}
                onClick={onClickSoldOut}
            >
                품절 상품
            </button>
        </div>
    );
};

export default FilterToggle;
