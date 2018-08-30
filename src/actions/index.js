/**
|--------------------------------------------------
| Redux Actions
|--------------------------------------------------
*/
import socApi from '../lib/Socket';
import contract from '../lib/Contract';
import { push } from 'react-router-redux'

export const _connectSocket = (props, domain) => {
    return (dispatch) => {
        dispatch({
            type: "CONNECT_SOCKET",
            payload: socApi.connectSocket(props, domain)
        })
    }
}

export const _sendUserEvent = (event) => {
    return (dispatch) => {
        dispatch({
            type: "USER_EVENT",
            payload: socApi.sendUserEvent(event)
        })
    }
}

export const _fetchMembers = (props, municipalityID, account) => {

    let data = {
        module: "crowdfundobj",
        result: "members",
        query: {
            municipalityID: municipalityID
        }
    }
    return (_fetchContractData(props, data, account))
}

export const _fetchUsers = (props, account) => {

    let data = {
        module: "membersdev3",
        result: "usernames",
        query: {
        },
        filter: {
            // _id: 1,
            // username: 1,
            // account: 1,
            // town: 1,
            // message: 1,
            // profilePic: 0 // for testing performance
        }
    }

    return (_fetchContractData(props, data, account))
}

export const _socketStatus = (status) => {
    return (dispatch) => {
        dispatch({
            type: "SOCKET_STATUS",
            payload: status
        })
    }
}

export const _setObject = (obj) => {
    return {
        type: "SET_OBJECT",
        payload: obj
    }
}

export const _setEvent = (event) => {
    return {
        type: "SET_EVENT",
        payload: event
    }
}

export const _setEventAlert = (alert) => {
    return {
        type: "SET_EVENT_ALERT",
        payload: alert
    }
}

export const _initContract = (props, web3) => {
    return (dispatch) => {
        dispatch({
            type: "INIT_CONTRACT",
            payload: contract.initContract(props, web3)
        })
    }
}

export const _registered = () => {
    return {
        type: "REGISTERED"
    }
}

export const _fetchContractData = (props, data, account) => {
    return (dispatch) => {
        dispatch({
            type: "FETCH_CONTRACT_DATA",
            payload: socApi.fetchData(props, data, account)
        })
    }
}

export const _reloadTokens = () => {
    return (dispatch) => {
        dispatch({
            type: "RELOAD_TOKENS"
        })
    }
}

export const _setNewContractData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_NEW_CONTRACT_DATA",
            payload: data
        })
    }
}

export const _writeNewContractData = (props, data) => {
    return (dispatch) => {
        dispatch({
            type: "WRITE_NEW_CONTRACT_DATA",
            payload: socApi.newData(props, data)
        })
    }
}

export const _updateContractData = (props, data) => {
    return (dispatch) => {
        // dispatch(_resetTxIds())
        dispatch({
            type: "UPDATE_CONTRACT_DATA",
            payload: socApi.updateData(props, data)
        })
    }
}

export const _updateSocketProps = (props) => {
    return (dispatch) => {
        dispatch({
            type: "UPDATE_SOCKET_PROPS",
            payload: socApi.updateProps(props)
        })
    }
}

export const _contractDataResponse = (account, response) => {
    return (dispatch) => {
        if (response.members)
            response.members.map(member => {
                // console.log("MEMBERS: ", member);
                if (member.account) dispatch(_lcAuthorization(member.account))
                if (member.objectID) {
                    // dispatch(_lcLeaseObject(account, member.objectID)) //change
                    // dispatch(_lcLeaseObjectCycle(member.objectID)) //change
                    // dispatch(_ldGetRaised(member.objectID)) //change

                    dispatch(_crowdFundData(member.objectID, "address", "fundtoken"))
                    dispatch(_crowdFundData(member.objectID, "string", "fundtokenname"))
                    dispatch(_crowdFundData(member.objectID, "address", "objectowner"))
                    dispatch(_crowdFundData(member.objectID, "integer", "objectprice"))
                    dispatch(_crowdFundData(member.objectID, "bytes", "objecthash"))
                    dispatch(_crowdFundData(member.objectID, "address", "fundreceiver"))
                    dispatch(_crowdFundData(member.objectID, "address", "currency"))
                    dispatch(_crowdFundData(member.objectID, "integer", "monthlycapitalcost"))
                    dispatch(_crowdFundData(member.objectID, "integer", "monthlyoperatingcost"))
                    dispatch(_crowdFundData(member.objectID, "integer", "raised"))
                    dispatch(_crowdFundData(member.objectID, "bool", "crowdsaleclosed"))
                    dispatch(_crowdFundData(member.objectID, "bool", "objectActive"))
                    dispatch(_crowdFundData(member.objectID, "integer", "objectActiveTime"))
                    dispatch(_crowdFundData(member.objectID, "bool", "claimedcrowdsale"))
                    dispatch(_crowdFundData(member.objectID, "address", "serviceProvider"))
                    dispatch(_crowdFundData(member.objectID, "integer", "biddingtime"))
                }
                // return 1
            })
        if (response.usernames)
            response.usernames.map(user => {
                if (user.account) dispatch(_lcAuthorization(user.account))
            })

        if (response.member) {
            dispatch(_crowdFundData(response.member.objectID, "integer", "objectprice"))
            dispatch(_crowdFundData(response.member.objectID, "integer", "raised"))
        }

        return dispatch({
            type: "CONTRACT_DATA_RESPONSE",
            payload: response
        })
    }
}

export const _objectSelected = (obj, account) => {
    return (dispatch) => {
        if (!obj.objectID && obj.account === account) {
            // dispatch(push("/", { module: module, path: "addnewlife" }))
        }
        return dispatch({
            type: "SELECT_OBJECT",
            payload: obj
        })
    }
}

// export const _objectSelected = (obj) => {
//     return (dispatch) => {
//         dispatch({
//             type: "SELECT_OBJECT",
//             payload: obj
//         })
//     }
// }

export const _resetMemberSelection = () => {
    return (dispatch) => {
        dispatch({
            type: "RESET_MEMBER"
        })
    }
}

export const _getConfirmationsHash = (hash) => {
    return (dispatch) => {
        dispatch({
            type: "HASH_CONFIRMATIONS",
            payload: contract.getConfirmationsHash(hash)
        })
    }
}

export const _newLeaseTokenAddress = (address) => {
    return {
        type: "NEW_LEASETOKEN_ADDR",
        payload: address
    }
}

export const _hashConfirmations = (number) => {
    return {
        type: "HASH_CONFIRMATIONS",
        payload: number
    }
}

export const _setAccount = (account) => {
    return (dispatch) => {
        dispatch({
            type: "SET_BASE_ACCOUNT",
            payload: account
        })
    }
}

export const _logOff = () => {
    return (dispatch) => dispatch(push("/"))
}

export const _getBalance = (address) => {
    return (dispatch) => {
        dispatch({
            type: "GET_ACCOUNT_BALANCE",
            payload: contract.getBalance(address)
        })
    }
}

export const _setBalance = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_ACCOUNT_BALANCE",
            payload: data
        })
    }
}

export const _setEventStatus = (data) => {
    return (dispatch) => {
        dispatch({
            type: "SET_EVENT_STATUS",
            payload: data
        })
    }
}

/**
 * EV Token Actions
 */

export const _evMyTokens = (account, objectID) => {
    return (dispatch) => {
        return contract.evMyTokens(account, objectID)
            .then(result =>
                dispatch(
                    {
                        type: "EV_MYTOKENS",
                        payload: result
                    }
                )
            )
    }
}

export const _evBalanceOf = (account) => {
    return (dispatch) => {
        return contract.evBalanceOf(account)
            .then(result =>
                dispatch(
                    {
                        type: "EV_BALANCE",
                        payload: result
                    }
                )
            )
    }
}

/**
 * Euro Token methods
 */
export const _euroBalanceOf = (account) => {
    return (dispatch) => {
        return contract.euroBalanceOf(account)
            .then(result =>
                dispatch(
                    {
                        type: "EURO_BALANCE",
                        payload: result
                    }
                )
            )
    }
}

export const _euroApprove = (value, account) => {
    return (dispatch) => {
        return contract.euroApprove(value, account)
            .then(result =>
                dispatch(
                    {
                        type: "APPROVE",
                        payload: result
                    }
                )
            )
    }
}

export const _euroAllowance = (account) => {
    return (dispatch) => {
        return contract.euroAllowance(account)
            .then(result =>
                dispatch(
                    {
                        type: "ALLOWANCE",
                        payload: result
                    }
                )
            )
    }
}


export const _crowdFundData = (objectID, type, name) => {
    return (dispatch) => {
        return contract.crowdFundData(objectID, type, name)
            .then(result => {
                return dispatch(
                    {
                        type: "CROWD_FUND_DATA",
                        payload: result
                    }
                )
            })
    }
}

// export const _lcLeaseObject = (account, objectID) => {
//     return (dispatch) => {
//         return contract.lcLeaseObject(objectID)
//             .then(result => {
//                 // console.log("LBO", result);
//                 account && dispatch(_ltBalanceOf(objectID, account, result.result.leaseTokenAddress))
//                 return dispatch(
//                     {
//                         type: "LEASE_OBJECT_RESULT",
//                         payload: result
//                     }
//                 )
//             })
//     }
// }

// export const _lcLeaseObjectCycle = (objectID) => {
//     return (dispatch) => {
//         return contract.lcLeaseObjectCycle(objectID)
//             .then(result => {
//                 return dispatch(
//                     {
//                         type: "LEASE_OBJECT_CYCLE_RESULT",
//                         payload: result
//                     }
//                 )
//             })
//     }
// }

// export const _lcLeaseObjectRedemption = (objectID) => {
//     return (dispatch) => {
//         return contract.lcLeaseObjectRedemption(objectID)
//             .then(result => {
//                 return dispatch(
//                     {
//                         type: "LEASE_OBJECT_REDEMPTION_RESULT",
//                         payload: result
//                     }
//                 )
//             })
//     }
// }

export const _lcAmountObjects = () => {
    return (dispatch) => {
        return contract.lcAmountObjects()
            .then(result => {
                return dispatch(
                    {
                        type: "AMOUNT_OBJECTS",
                        payload: result
                    }
                )
            })
    }
}

export const _lcCreateObject = (props, name, months, municipalityID, objectPrice, objectHash, objectCurrencyID, objectDealer, objectMCCost, objectMOCost, account) => {
    return (dispatch) => {
        return contract.lcCreateObject(props, name, months, municipalityID, objectPrice, objectHash, objectCurrencyID, objectDealer, objectMCCost, objectMOCost, account)
            .then(result => {
                // dispatch(push("/", { path: "members" }))
                return dispatch(
                    {
                        type: "ADD_NEW_OBJECT_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcSumBalanceOf = (account) => {
    return (dispatch) => {
        return contract.lcSumBalanceOf(account)
            .then(result => {
                return dispatch(
                    {
                        type: "SUM_BALANCE_OF_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcAuthorization = (account) => {
    return (dispatch) => {
        return contract.lcAuthorization(account)
            .then(result => {
                return dispatch(
                    {
                        type: "AUTHORIZATION",
                        payload: result
                    }
                )
            })
    }
}

export const _lcAddUser = (user, account) => {
    return (dispatch) => {
        return contract.lcAddUser(user, account)
            .then(result => {
                return dispatch(
                    {
                        type: "ADD_NEW_USER",
                        payload: result
                    }
                )
            })
    }
}


export const _lcBuyAndActivate = (objectID, activeDate, account) => {
    return (dispatch) => {
        dispatch(_resetTxIds())
        return contract.lcBuyAndActivate(objectID, activeDate, account)
            .then(result => {
                return dispatch(
                    {
                        type: "BUY_AND_ACTIVATE",
                        payload: result
                    }
                )
            })
    }
}

export const _lcPayCapitalAndOperation = (props, objectID, capital, operation, account) => {
    return (dispatch) => {
        return contract.lcPayCapitalAndOperation(props, objectID, capital, operation, account)
            .then(result => {
                return dispatch(
                    {
                        type: "PAY_CAPITAL_OPERATION",
                        payload: result
                    }
                )
            })
    }
}

export const _lcTotalSupply = () => {
    return (dispatch) => {
        return contract.lcTotalSupply()
            .then(result => {
                return dispatch(
                    {
                        type: "TOTAL_SUPPLY_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcInvestInObject = (objectID, amount, account) => {
    return (dispatch) => {
        return contract.lcInvestInObject(objectID, amount, account)
            .then(result => {
                // dispatch(goBack())
                return dispatch(
                    {
                        type: "INVEST_IN_OBJECT_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcPayFee = (objectID, account) => {
    return (dispatch) => {
        return contract.lcPayFee(objectID, account)
            .then(result => {
                // dispatch(goBack())
                return dispatch(
                    {
                        type: "PAY_FEE_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcActivateDeactivateObject = (objectID, account) => {
    return (dispatch) => {
        return contract.lcActivateDeactivateObject(objectID, account)
            .then(result => {
                return dispatch(
                    {
                        type: "ACTIVATE_DEACTIVATE_OBJECT_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcToClaimDividend = (objectID, account) => {
    return (dispatch) => {
        return contract.lcToClaimDividend(objectID, account)
            .then(result => {
                return dispatch(
                    {
                        type: "TO_CLAIM_DIVIDEND_RESULT",
                        payload: result
                    }
                )
            })
    }
}

// export const _lcToClaimTotal = (account) => {
//     return (dispatch) => {
//         return contract.lcToClaimTotal(account)
//             .then(result => {
//                 return dispatch(
//                     {
//                         type: "TO_CLAIM_TOTAL_RESULT",
//                         payload: result
//                     }
//                 )
//             })
//     }
// }

export const _lcClaimDividend = (objectID, account) => {
    return (dispatch) => {
        return contract.lcClaimDividend(objectID, account)
            .then(result => {
                return dispatch(
                    {
                        type: "CLAIM_DIVIDEND_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcCreateNewCrowdFundToken = (props, data, account) => {
    return (dispatch) => {
        dispatch({
            type: "NEW_LEASETOKEN_ADDRESS_RESULT",
            payload: contract.lcCreateNewCrowdFundToken(props, data, account)
        })
    }
}


export const _resetTxIds = () => ({
    type: "RESET_TX_IDS"
})

export const _resetEvent = () => ({
    type: "RESET_EVENT"
})

// Lease Data Methods


// export const _ldGetRaised = (objectID) => {
//     return (dispatch) => {
//         return contract.ldGetRaised(objectID)
//             .then(result => {
//                 return dispatch(
//                     {
//                         type: "TOTAL_RAISED_RESULT",
//                         payload: result
//                     }
//                 )
//             })
//     }
// }

// Lease token Object methods
export const _ltBalanceOf = (objectID, account, address) => {
    return (dispatch) => {
        return contract.ltBalanceOf(objectID, account, address)
            .then(result =>
                dispatch(
                    {
                        type: "EV_MYTOKENS",
                        payload: result
                    }
                )
            )
    }
}

export const _ltTotalSupply = (objectID, address) => {
    return (dispatch) => {
        return contract.ltTotalSupply(objectID, address)
            .then(result =>
                dispatch(
                    {
                        type: "TOTAL_SUPPLY_RESULT",
                        payload: result
                    }
                )
            )
    }
}

