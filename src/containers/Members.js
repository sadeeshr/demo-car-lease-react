import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import Members from '../components/Members';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    // console.log("State: ", state)

    return {
        lcCars: state.lcCars,
        evTokens: state.evTokens,
        reloadTokens: state.reloadTokens,
        account: state.account,
        member: state.member,
        members: state.members,
        addNewCarTxID: state.addNewCarTxID,
        raiseFundsForCarTxID: state.raiseFundsForCarTxID,
        progress: state.progress ? state.progress : false,
        [state.module]: state[state.module]
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Members))