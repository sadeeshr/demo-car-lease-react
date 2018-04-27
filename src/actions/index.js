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

export const _fetchMembers = (module, account) => {
    let data = {
        module: "membersdev",
        result: "members",
        query: {
            module: module
        },
        filter: {
            _id: 1,
            username: 1,
            town: 1,
            message: 1,
            carID: 1,
            carPic: 1,
            carPrice: 1,
            module: 1,
            account: 1
        }
    }
    return (_fetchContractData(account, data))
}

export const _socketStatus = (status) => {
    return (dispatch) => {
        dispatch({
            type: "SOCKET_STATUS",
            payload: status
        })
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

export const _fetchContractData = (account, data) => {
    return (dispatch) => {
        dispatch({
            type: "FETCH_CONTRACT_DATA",
            payload: socApi.fetchData(account, data)
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

export const _writeNewContractData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "WRITE_NEW_CONTRACT_DATA",
            payload: socApi.newData(data)
        })
    }
}

export const _updateContractData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "UPDATE_CONTRACT_DATA",
            payload: socApi.updateData(data)
        })
    }
}

export const _contractDataResponse = (account, response) => {
    return (dispatch) => {
        if (response.members)
            response.members.map(member => {
                // console.log("MEMBERS: ", member);
                if (member.account) dispatch(_lcAuthorization(member.account))
                // dispatch(_lcLeaseObjectCycle(0))
                // dispatch(_lcLeaseObjectRedemption(0))
                if (member.carID) {
                    dispatch(_lcLeaseObject(member.carID))
                    dispatch(_lcLeaseObjectCycle(member.carID))
                    dispatch(_lcLeaseObjectRedemption(member.carID))
                    dispatch(_evMyTokens(account, member.carID))
                }
                // return 1
            })

        return dispatch({
            type: "CONTRACT_DATA_RESPONSE",
            payload: response
        })
    }
}

export const _memberSelected = (member, account, module) => {
    return (dispatch) => {
        if (!member.carID && member.account === account) {
            dispatch(push("/", { module: module, path: "addnewlife" }))
        }
        return dispatch({
            type: "SELECT_MEMBER",
            payload: member
        })
    }
}

export const _carSelected = (car) => {
    return (dispatch) => {
        dispatch({
            type: "SELECT_CAR",
            payload: car
        })
    }
}

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

export const _lcLeaseObject = (objectID) => {
    return (dispatch) => {
        return contract.lcLeaseObject(objectID)
            .then(result => {
                return dispatch(
                    {
                        type: "LEASE_OBJECT_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcLeaseObjectCycle = (objectID) => {
    return (dispatch) => {
        return contract.lcLeaseObjectCycle(objectID)
            .then(result => {
                return dispatch(
                    {
                        type: "LEASE_OBJECT_CYCLE_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcLeaseObjectRedemption = (objectID) => {
    return (dispatch) => {
        return contract.lcLeaseObjectRedemption(objectID)
            .then(result => {
                return dispatch(
                    {
                        type: "LEASE_OBJECT_REDEMPTION_RESULT",
                        payload: result
                    }
                )
            })
    }
}

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

export const _lcCreateObject = (id, objectImage, objectPrice, objectHash, objectType, objectDealer, objectFee, objectTerm, mileagesAvg, account, module) => {
    return (dispatch) => {
        return contract.lcCreateObject(id, objectImage, objectPrice, objectHash, objectType, objectDealer, objectFee, objectTerm, mileagesAvg, account)
            .then(result => {
                dispatch(push("/", { module: module, path: "members" }))
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

export const _lcPaySubscription = (objectID, month, milege, account) => {
    return (dispatch) => {
        return contract.lcPaySubscription(objectID, month, milege, account)
            .then(result => {
                // dispatch(goBack())
                return dispatch(
                    {
                        type: "PAY_SUBSCRIPTION_RESULT",
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

export const _lcToClaimTotal = (account) => {
    return (dispatch) => {
        return contract.lcToClaimTotal(account)
            .then(result => {
                return dispatch(
                    {
                        type: "TO_CLAIM_TOTAL_RESULT",
                        payload: result
                    }
                )
            })
    }
}

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

export const _resetTxIds = () => ({
    type: "RESET_TX_IDS"
})

export const _resetEvent = () => ({
    type: "RESET_EVENT"
})