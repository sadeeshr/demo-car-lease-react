/**
|--------------------------------------------------
| Redux Actions
|--------------------------------------------------
*/
import socApi from './lib/Socket';
import contract from './lib/Contract';

export const _connectSocket = (props) => {
    return (dispatch) => {
        dispatch({
            type: "CONNECT_SOCKET",
            payload: socApi.connectSocket(props)
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

export const _fetchContractData = (module) => {
    return (dispatch) => {
        dispatch({
            type: "FETCH_CONTRACT_DATA",
            payload: socApi.fetchData(module)
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

export const _contractDataResponse = (response) => {
    return (dispatch) => {
        dispatch({
            type: "CONTRACT_DATA_RESPONSE",
            payload: response
        })
    }
}
