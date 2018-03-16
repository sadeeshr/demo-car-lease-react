/**
|--------------------------------------------------
| Redux Actions
|--------------------------------------------------
*/
import socApi from '../lib/Socket';
import contract from '../lib/Contract';
import { goBack, push } from 'react-router-redux'

export const _connectSocket = (props) => {
    return (dispatch) => {
        dispatch({
            type: "CONNECT_SOCKET",
            payload: socApi.connectSocket(props)
        })
    }
}

export const _socketStatus = (status) => {
    return (dispatch) => {
        dispatch({
            type: "SOCKET_STATUS",
            payload: status
        })
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

export const _newContractData = (data) => {
    return (dispatch) => {
        dispatch({
            type: "NEW_CONTRACT_DATA",
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
                dispatch(_lcCars(member.carID))
                dispatch(_evMyTokens(account, member.carID))
                return 1
            })

        return dispatch({
            type: "CONTRACT_DATA_RESPONSE",
            payload: response
        })
    }
}

export const _memberSelected = (member) => {
    return (dispatch) => {
        dispatch({
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

// export const _getAccount = () => {
//     return (dispatch) => {
//         dispatch({
//             type: "BASE_ACCOUNT",
//             payload: contract.getAccount()
//         })
//     }
// }

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

/**
 * EV Token Actions
 */

export const _evMyTokens = (account, carID) => {
    return (dispatch) => {
        return contract.evMyTokens(account, carID)
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

export const _lcCars = (carID) => {
    return (dispatch) => {
        return contract.lcCars(carID)
            .then(result => {
                return dispatch(
                    {
                        type: "CAR_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcAddNewCar = (carID, carHash, carDealer, carDriver, monRed, account) => {
    return (dispatch) => {
        return contract.lcAddNewCar(carID, carHash, carDealer, carDriver, monRed, account)
            .then(result => {
                dispatch(goBack())
                return dispatch(
                    {
                        type: "ADD_NEW_CAR_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcTotalAmountRaised = () => {
    return (dispatch) => {
        return contract.lcTotalAmountRaised()
            .then(result => {
                return dispatch(
                    {
                        type: "TOTAL_AMOUNT_RAISED_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcRaiseFundsForCar = (carID, amount, account) => {
    return (dispatch) => {
        return contract.lcRaiseFundsForCar(carID, amount, account)
            .then(result => {
                dispatch(goBack())
                return dispatch(
                    {
                        type: "RAISE_FUNDS_FOR_CAR_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcPayInterestAndRedemption = (carID, month, milege, account) => {
    return (dispatch) => {
        return contract.lcPayInterestAndRedemption(carID, month, milege, account)
            .then(result => {
                dispatch(goBack())
                return dispatch(
                    {
                        type: "PAY_INTEREST_AND_REDEMPTION_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcReadInvestorToClaim = (carID, account) => {
    return (dispatch) => {
        return contract.lcReadInvestorToClaim(carID, account)
            .then(result => {
                return dispatch(
                    {
                        type: "READ_INVESTOR_TO_CLAIM_RESULT",
                        payload: result
                    }
                )
            })
    }
}

export const _lcClaimInterestAndRedemption = (carID, account) => {
    return (dispatch) => {
        return contract.lcClaimInterestAndRedemption(carID, account)
            .then(result => {
                return dispatch(
                    {
                        type: "CLAIM_INTEREST_AND_REDEMPTION_RESULT",
                        payload: result
                    }
                )
            })
    }
}