import api from "../../../config/api";
import {
  GET_CUSTOMERS_REQUEST,
  GET_CUSTOMERS_SUCCESS,
  GET_CUSTOMERS_FAILURE,
} from "./ActionType";

export const getCustomersRequest = () => ({
  type: GET_CUSTOMERS_REQUEST,
});

export const getCustomersSuccess = (customers) => ({
  type: GET_CUSTOMERS_SUCCESS,
  payload: customers,
});

export const getCustomersFailure = (error) => ({
  type: GET_CUSTOMERS_FAILURE,
  payload: error,
});

export const getCustomers = () => {
  return async (dispatch) => {
    dispatch(getCustomersRequest());
    try {
      const response = await api.get(`/api/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      dispatch(getCustomersSuccess(response.data));
    } catch (error) {
      dispatch(getCustomersFailure(error.message));
    }
  };
};