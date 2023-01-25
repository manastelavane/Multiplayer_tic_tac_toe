import {
  AUTH,
  AUTH_LOADING,
  SIGNUP_FAIL,
  SIGNIN_FAIL,
  CLEAR_ERRORS,
} from "../constants/actionTypes";
import * as api from "../api/index.js";
import jwt_decode from "jwt-decode";

//To signin a user
export const signin = (formData) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOADING });
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
  } catch (error) {
    console.log(error.response.data.message);
    dispatch({ type: SIGNIN_FAIL, payload: error.response.data.message });
  }
};

//To signup a user
export const signup = (formData) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOADING });
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
  } catch (error) {
    console.log(error.response.data.message);
    dispatch({ type: SIGNUP_FAIL, payload: error.response.data.message });
  }
};
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
