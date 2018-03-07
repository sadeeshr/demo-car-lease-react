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
        LeaseContract: state.LeaseContract,
        account: state.account,
        module: state.module,
        cars: state.cars,
        members: state.members,
        members_new: state.members_new,
        [state.module]: state[state.module]
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(AddMember))