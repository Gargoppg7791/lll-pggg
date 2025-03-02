import React from "react";
import { useNavigate } from "react-router-dom";

const HomeProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Discount Percentage Calculate karne ka logic (agar API se na aaye)
  const discountPercent = product?.discountPercent
    ? product?.discountPercent
    : product?.price && product?.discountedPrice
    ? Math.round(((product?.price - product?.discountedPrice) / product?.price) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/men/clothing/mens_kurta`)}
      className="cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-[15rem] mx-3"
    >
      {/* Product Image */}
      <div className="h-[13rem] w-[10rem]">
        <img
          className="object-cover object-top w-full h-full"
          src={product?.image || product?.imageUrl}
          alt={product?.title}
        />
      </div>

      {/* Product Details */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium text-gray-900">{product?.brand}</h3>
        <p className="mt-1 text-sm text-gray-500">{product?.title}</p>

        {/* Ratings Section */}
        {product?.rating && (
          <div className="flex items-center justify-center mt-2">
            <span className="text-sm font-semibold text-gray-800">{product?.rating} ⭐</span>
            <span className="ml-2 text-xs text-gray-500">({product?.ratingCount} reviews)</span>
          </div>
        )}

        {/* Price Section */}
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-lg font-bold text-red-600">₹{product?.discountedPrice}</span>
          <span className="text-sm line-through text-gray-500">₹{product?.price}</span>
          <span className="text-sm text-green-600">({discountPercent}% off)</span>
        </div>

        {/* EMI Details */}
        {product?.emi && (
          <p className="text-xs text-gray-600 mt-1">
            EMI starting from ₹{product?.emi}/month
          </p>
        )}
      </div>
    </div>
  );
};

export default HomeProductCard;
