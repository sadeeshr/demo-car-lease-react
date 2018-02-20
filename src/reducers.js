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

        case 'INIT_CONTRACT':
            return {
                ...state,
                contract: action.payload
            }

        case 'FETCH_CONTRACT_DATA':
            return {
                ...state,
                module: action.payload,
                progress: true
            }

        case 'CONTRACT_DATA_RESPONSE':
            return {
                ...state,
                ...action.payload,
                progress: false
            }

        case 'BASE_ACCOUNT':
            return {
                ...state,
                account: action.payload
            }

        case 'SET_ACCOUNT_BALANCE':
            return {
                ...state,
                ...action.payload
            }

        default:
            return { ...state }
    }

}

export default rootReducer