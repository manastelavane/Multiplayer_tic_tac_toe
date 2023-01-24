import * as actionType from '../constants/actionTypes';

const authReducer = (state = { authData: null,isAuthenticated:false,error:null }, action) => {
  switch (action.type) {
    case actionType.AUTH_LOADING:
      return {...state,loading:true,isAuthenticated:false};
    case actionType.AUTH:
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action.data, loading: false ,isAuthenticated:true,error:null};
    
        case actionType.LOGOUT:
      localStorage.clear();
      return { ...state, authData: null, loading: false, isAuthenticated:false,error:null};
    
    case actionType.SIGNIN_FAIL:
    case actionType.SIGNUP_FAIL:
      return {...state,loading:false,isAuthenticated:false,error:action.payload}
    case actionType.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;
