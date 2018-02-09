/**
|--------------------------------------------------
| Redux Reducers
|--------------------------------------------------
*/
const initialState = {}
const rootReducer = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case 'CONNECT_SOCKET':
            return {
                ...state,
                socket: true
            }

        case 'FETCH_CONTRACT_DATA':
            return {
                ...state,
                module: action.payload
            }

        case 'CONTRACT_DATA_RESPONSE':
            return {
                ...state,
                ...action.payload
            }

        default:
            return { ...state }
    }

}

export default rootReducer