export const initialState = {
  user: {},
};

export const UserReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "REMOVE_USER":
      return { user: {} };
    case "UPDATE_USER":
      if (action.payload.profile_pic === null) {
        return { user: { ...state.user, name: action.payload.name, no_hp: action.payload.no_hp, alamat: action.payload.alamat } };
      } else {
        return { user: { ...state.user, name: action.payload.name, no_hp: action.payload.no_hp, alamat: action.payload.alamat, profile_pic: action.payload.profile_pic } };
      }
    case "DELETE_PROFILE_PICTURE":
      return { user: { ...state.user, profile_pic: null } };
    default:
      return state;
  }
};
