const initialState = { count: 0 };
export const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "addToCart":
      return { count: state.count + 1 };
    case "clearCart":
      return { count: state.count - 1 };
    default:
      return state;
  }
};
