

export default function TokensReducer(initialState = {}, action) {
    switch(action.type) {
        case "ADD_TOKEN":
            return {
                ...initialState,
                [action.payload.network]: {
                    ... initialState[action.payload.network],
                    [action.payload.symbol]: action.payload.metadata
                }
            }
        case "UPDATE_BALANCE":
            return {
                ...initialState,
                [action.payload.network]: {
                    ... initialState[action.payload.network],
                    [action.payload.symbol]: {
                        ... initialState[action.payload.network][action.payload.symbol],
                        balance: action.payload.balance
                    }
                }
            }
        default:
            return initialState;
    }
}