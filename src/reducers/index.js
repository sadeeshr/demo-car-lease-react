/**
|--------------------------------------------------
| Redux Reducers
|--------------------------------------------------
*/
import cc from '../lib/utils';

const initialState = {}
const rootReducer = (state = initialState, action) => {
    cc.log(action)
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

        // case 'SET_NEW_CONTRACT_DATA':
        //     return {
        //         ...state,
        //         newObject: action.payload,
        //         progress: true
        //     }

        case 'WRITE_NEW_CONTRACT_DATA':
            return {
                ...state,
                progress: true,
                invoices_new: false,
                invoices_edit: false,
                eventAddNewObject: false,
                objectID: false,
                // newObject: false
            }

        case 'FETCH_CONTRACT_DATA':
            return {
                ...state,
                progress: true,
                module: action.payload,
                // addNewObjectTxID: null,
                approveTxID: null,
                // investInObjectTxID: null,
                invoices_new: false,
                invoices_edit: false,
                usernames_new: false,
                usernames_edit: false,
                // usernames: null
            }

        case 'UPDATE_CONTRACT_DATA':
            return {
                ...state,
                members_new: null
            }

        case 'SET_EVENT':
            return {
                ...state,
                event: (state.event && state.event.event === action.payload.event && state.event.transactionHash === action.payload.transactionHash) ? state.event : action.payload
            }

        case 'SET_EVENT_ALERT':
            return {
                ...state,
                eventAlert: action.payload
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
                // lcCars: null,
                // euroTokenBalance: null,
                // evTokenBalance: null,
                totalSupply: null,
                progress: false,
                reloadTokens: false
            }

        case 'SELECT_MEMBER':
            return {
                ...state,
                member: state.member !== action.payload ? action.payload : null
            }

        case 'SELECT_OBJECT':
            return {
                ...state,
                member: action.payload
            }

        case 'RESET_MEMBER':
            return {
                ...state,
                member: null
            }

        case 'SET_OBJECT':
        case 'SET_BASE_ACCOUNT':
        case 'EV_BALANCE':
        case 'EURO_BALANCE':
        case 'ADD_NEW_OBJECT_RESULT':
        case 'SUM_BALANCE_OF_RESULT':
        case 'PAY_FEE_RESULT':
        case 'ACTIVATE_DEACTIVATE_OBJECT_RESULT':
        case 'CLAIM_DIVIDEND_RESULT':
        case 'TO_CLAIM_TOTAL_RESULT':
        case 'ALLOWANCE':
        case 'INVEST_IN_OBJECT_RESULT':
        case 'APPROVE':
        case 'ADD_NEW_USER':
        case 'BUY_AND_ACTIVATE':
        case 'PAY_CAPITAL_OPERATION':
        case 'HASH_CONFIRMATIONS':
        case 'UPDATE_SOCKET_PROPS':
        case 'NEW_LEASETOKEN_ADDR':
            return {
                ...state,
                ...action.payload
            }
        case 'TOTAL_SUPPLY_RESULT':
            return {
                ...state,
                ...action.payload
            }

        case 'SET_EVENT_STATUS':
            return {
                ...state,
                ...action.payload,
                // unClaimedRedemption: null,
                // totalSupply: null,
                // euroTokenBalance: null,
                // evTokenBalance: null,
                // crowdsaleClosed: null,
                // allowance: null
            }

        case 'AMOUNT_OBJECTS':
            return {
                ...state,
                ...action.payload,
                claimDividendTxID: null
            }
        case 'TO_CLAIM_DIVIDEND_RESULT':
            return {
                ...state,
                ...action.payload,
                // payFeeTxID: null
            }

        case 'EV_MYTOKENS':
            {
                let members = state.members && state.members.map(member => {
                    if (member.objectID === action.payload.id)
                        member["evTokens"] = action.payload.result
                    return member
                })

                let coins = state.coinNames && state.coinNames.map(coin => {
                    if (coin.objectID === action.payload.id)
                        coin["tokens"] = action.payload.result
                    return coin
                })

                if (state.member && (state.member.objectID === action.payload.id))
                    state.member["evTokens"] = action.payload.result

                return {
                    ...state,
                    members: members,
                    coinNames: coins
                }
            }

        // case 'LEASE_OBJECT_RESULT':
        //     {
        //         let members = state.members.map(member => {
        //             if (member.objectID === action.payload.id)
        //                 member["obj"] = action.payload.result
        //             return member
        //         })

        //         if (state.member && (state.member.objectID === action.payload.id))
        //             state.member["obj"] = action.payload.result

        //         return {
        //             ...state,
        //             members: members
        //         }
        //     }

        // case 'LEASE_OBJECT_CYCLE_RESULT':
        // case 'LEASE_OBJECT_REDEMPTION_RESULT':
        // case 'TOTAL_RAISED_RESULT':
        case 'CROWD_FUND_DATA':
            {
                let members = state.members.map(member => {
                    if (member.objectID === action.payload.id)
                        member = { ...member, ...action.payload.result }
                    return member
                })

                if (state.member && (state.member.objectID === action.payload.id))
                    state.member = { ...state.member, ...action.payload.result }

                return {
                    ...state,
                    members: members
                }
            }

        // case 'AUTHORIZATION':
        case 'SET_ACCOUNT_BALANCE':
            {
                let members = state.usernames.map(member => {
                    if (member.account === action.payload.account)
                        member["balance"] = action.payload.result
                    return member
                })

                // if (state.member && (state.member.account === action.payload.account))
                //     state.member["authorized"] = action.payload.result

                return {
                    ...state,
                    usernames: members
                }
            }

        case 'RESET_TX_IDS':
            return {
                ...state,
                addNewObjectTxID: null,
                addNewObjectID: null,
                approveTxID: null,
                investInObjectTxID: null,
                payFeeTxID: null,
                claimDividendTxID: null,
                // newObject: {
                //     ...state.newObject,
                //     txID: null
                // },
                // newCrowdFundToken: {
                //     ...state.newCrowdFundToken,
                //     txID: null
                // },
                newObject: null,
                invoices: null,
                newCrowdFundToken: null,
                AddNewUser: null,
                BuyAndActivate: null
            }

        case 'RESET_EVENT':
            return {
                ...state,
                eventTransfer: null,
                eventApprove: null,
                eventClaim: null,
                eventSubscription: null
            }

        default:
            return { ...state }
    }

}

export default rootReducer