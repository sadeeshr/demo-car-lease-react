import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import Members from '../components/Members';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    console.log("State: ", state)

    return {
        evToken: state.evToken,
        evTokens: state.evTokens,
        progress: state.progress,
        account: state.account,
        member: state.member,
        members: state.members,
        [state.module]: state[state.module]
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Members))