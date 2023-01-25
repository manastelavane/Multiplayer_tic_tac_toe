import {
  CHECK_MAIL_FAIL,
  CREATE_ROOM,
  CREATE_ROOM_FAIL,
  LOADING,
  GET_ROOM,
  GET_ROOM_FAIL,
  GET_ALL_ROOMS,
} from "../constants/actionTypes";
import * as api from "../api/index.js";
export const createroom = (formData) => async (dispatch) => {
  try {
    dispatch({ type: LOADING });
    const { data } = await api.createroom(formData);
    dispatch({ type: CREATE_ROOM, payload: { data } });
  } catch (error) {
    dispatch({ type: CREATE_ROOM_FAIL, payload: error.response.data.message });
  }
};
export const getroom = (id) => async (dispatch) => {
  try {
    dispatch({ type: LOADING });
    const { data } = await api.getroom(id);
    dispatch({ type: GET_ROOM, payload: { room: data } });
  } catch (error) {
    dispatch({ type: GET_ROOM_FAIL, payload: error.response.data.message });
  }
};
export const getallrooms = (username) => async (dispatch) => {
  try {
    dispatch({ type: LOADING });
    const { data } = await api.getallrooms(username);
    dispatch({ type: GET_ALL_ROOMS, payload: { rooms: data } });
  } catch (error) {
    dispatch({ type: GET_ROOM_FAIL, payload: error.response.data.message });
  }
};
