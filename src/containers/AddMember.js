import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import AddMember from '../components/AddMember';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    console.log("State: ", state)
    return {
        contract: state.contract,
        account: state.account,
        module: state.module,
        [state.module]: state[state.module]
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(AddMember))