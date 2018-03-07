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
                ...state
            }

        case 'SOCKET_STATUS':
            return {
                ...state,
                socket: action.payload
            }

        case 'INIT_CONTRACT':
            return {
                ...state,
                ...action.payload
            }

        case 'NEW_CONTRACT_DATA':
            return {
                ...state,
                progress: true
            }

        case 'FETCH_CONTRACT_DATA':
            return {
                ...state,
                progress: true,
                module: action.payload
            }

        case 'CONTRACT_DATA_RESPONSE':
            return {
                ...state,
                ...action.payload,
                progress: false
            }

        case 'SELECT_MEMBER':
            return {
                ...state,
                member: state.member !== action.payload ? action.payload : null
            }

        case 'SELECT_CAR':
            return {
                ...state,
                car: action.payload
            }

        case 'RESET_MEMBER':
            return {
                ...state,
                member: null
            }

        case 'SET_BASE_ACCOUNT':
        case 'SET_ACCOUNT_BALANCE':
        case 'EV_BALANCE':
        case 'EURO_BALANCE':
        case 'ADD_NEW_CAR_RESULT':
            return {
                ...state,
                ...action.payload
            }

        case 'EV_MYTOKENS':
            return {
                ...state,
                evTokens: {
                    ...state.evTokens,
                    ...action.payload
                }

            }

        default:
            return { ...state }
    }

}

export default rootReducer