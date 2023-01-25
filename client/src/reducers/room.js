import * as actionType from "../constants/actionTypes";

const roomReducer = (
  state = { room: null, rooms: null, error: null, isLoading: false },
  action
) => {
  switch (action.type) {
    case actionType.GET_ROOM:
      return {
        ...state,
        room: action.payload.room,
        isLoading: false,
        error: null,
      };
    case actionType.GET_ALL_ROOMS:
      return {
        ...state,
        rooms: action.payload.rooms,
        isLoading: false,
        error: null,
      };
    case actionType.GET_ROOM_FAIL:
      return { ...state, isLoading: false, error: action.payload };
    case actionType.CREATE_ROOM_FAIL:
      return { ...state, error: action.payload };
    case actionType.CLEAR_ROOM:
      return { ...state, room: null, error: null };
    case actionType.LOADING:
      return { ...state, isLoading: true };
    case actionType.CREATE_ROOM:
      return {
        ...state,
        room: action.payload?.data,
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default roomReducer;
