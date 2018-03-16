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
                progress: true,
                invoices_new: false
            }

        case 'FETCH_CONTRACT_DATA':
            return {
                ...state,
                progress: true,
                module: action.payload,
                addNewCarTxID: null,
                raiseFundsForCarTxID: null,
                invoices_new: false
            }

        case 'RELOAD_TOKENS':
            return {
                ...state,
                reloadTokens: true
            }

        case 'CONTRACT_DATA_RESPONSE':
            return {
                ...state,
                ...action.payload,
                evTokens: null,
                lcCars: null,
                euroTokenBalance: null,
                evTokenBalance: null,
                totalAmountRaised: null,
                progress: false,
                reloadTokens: false
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
        case 'TOTAL_AMOUNT_RAISED_RESULT':
        case 'RAISE_FUNDS_FOR_CAR_RESULT':
        case 'PAY_INTEREST_AND_REDEMPTION_RESULT':
        case 'CLAIM_INTEREST_AND_REDEMPTION_RESULT':
            return {
                ...state,
                ...action.payload
            }

        case 'READ_INVESTOR_TO_CLAIM_RESULT':
            return {
                ...state,
                ...action.payload,
                payInterestAndRedemptionTxID: null
            }

        case 'EV_MYTOKENS':
            {
                let members = state.members.map(member => {
                    if (member.carID === action.payload.id)
                        member["evTokens"] = action.payload.result
                    return member
                })
                return {
                    ...state,
                    members: members
                }
            }

        case 'CAR_RESULT':
            {
                let members = state.members.map(member => {
                    if (member.carID === action.payload.id)
                        member["car"] = action.payload.result
                    return member
                })

                return {
                    ...state,
                    members: members
                }
            }

        default:
            return { ...state }
    }

}

export default rootReducer