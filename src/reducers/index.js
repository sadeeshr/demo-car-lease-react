/**
|--------------------------------------------------
| Redux Reducers
|--------------------------------------------------
*/
const initialState = {}
const rootReducer = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        // case '@@redux/INIT':
        //     return {
        //         initRoute: true
        //     }

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

        case 'SET_NEW_CONTRACT_DATA':
            return {
                ...state,
                newObject: action.payload,
                progress: true
            }

        case 'WRITE_NEW_CONTRACT_DATA':
            return {
                ...state,
                progress: true,
                invoices_new: false,
                invoices_edit: false,
                eventAddNewObject: false,
                objectID: false,
                newObject: false
            }

        case 'FETCH_CONTRACT_DATA':
            return {
                ...state,
                progress: true,
                module: action.payload,
                addNewObjectTxID: null,
                investInObjectTxID: null,
                invoices_new: false,
                invoices_edit: false
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
                sumBalanceOf: null,
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
        case 'ADD_NEW_OBJECT_RESULT':
        case 'SUM_BALANCE_OF_RESULT':
        case 'INVEST_IN_OBJECT_RESULT':
        case 'PAY_SUBSCRIPTION_RESULT':
        case 'CLAIM_DIVIDEND_RESULT':
        case 'APPROVE':
        case 'ALLOWANCE':
        case 'SET_EVENT_STATUS':
            return {
                ...state,
                ...action.payload
            }
        case 'AMOUNT_OBJECTS':
            return {
                ...state,
                ...action.payload,
                claimDividendTxID: null,
                investInObjectTxID: null
            }
        case 'TO_CLAIM_DIVIDEND_RESULT':
            return {
                ...state,
                ...action.payload,
                paySubscriptionTxID: null
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

        case 'LEASE_OBJECT_RESULT':
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