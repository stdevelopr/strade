const initialState = { contextSymbol: "ETCBTC" };

export default function symbolReducer(state = initialState, action) {
  if (action.type === "setContextSymbol") {
    return {
      contextSymbol: action.value
    };
  }
  return state;
}
