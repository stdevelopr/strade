const initialState = { contextSymbol: "ETHBTC" };

export default function symbolReducer(state = initialState, action) {
  if (action.type === "setContextSymbol") {
    return {
      contextSymbol: action.value
    };
  }
  return state;
}
