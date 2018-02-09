/**
|--------------------------------------------------
| Redux Actions
|--------------------------------------------------
*/
import socApi from './lib/Socket';

export const _connectSocket = (props) => {
    return (dispatch) => {
        dispatch({
            type: "CONNECT_SOCKET",
            payload: socApi.connectSocket(props)
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
