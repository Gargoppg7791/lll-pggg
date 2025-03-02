import axios from "axios";
import {
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  // ...existing imports...
} from "./ActionType";
import api, { API_BASE_URL } from "../../../config/api";

export const getProducts = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: GET_PRODUCTS_REQUEST });
    
    // Add query parameters for pagination and filtering
    const { pageSize = 10, pageNumber = 1, sort = "price_low" } = params;
    const { data } = await api.get(`${API_BASE_URL}/api/admin/products`, {
      params: {
        pageSize,
        pageNumber,
        sort,
        // Add any other filter parameters
      }
    });

    dispatch({
      type: GET_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    dispatch({
      type: GET_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST });

    const { data } = await api.post(
      `${API_BASE_URL}/api/admin/products`,
      product.data
    );

    dispatch({
      type: CREATE_PRODUCT_SUCCESS,
      payload: data,
    });
    
    // Refresh products list after creation
    dispatch(getProducts());
    
    return data; // Return created product for further handling
  } catch (error) {
    console.error("Error creating product:", error);
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error; // Re-throw for component error handling
  }
};

export const updateProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const { data } = await api.put(
      `${API_BASE_URL}/api/admin/products/${product.productId}`,
      product
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data,
    });

    // Refresh products list after update
    dispatch(getProducts());
    
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    await api.delete(`${API_BASE_URL}/api/admin/products/${productId}`);

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: productId,
    });

    // Refresh products list after deletion
    dispatch(getProducts());
  } catch (error) {
    console.error("Error deleting product:", error);
    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};