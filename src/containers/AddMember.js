import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import AddMember from '../components/AddMember';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    // console.log("State: ", state)
    return {
        socket: state.socket,
        towns: state.towns,
        town: state.town,
        LeaseContract: state.LeaseContract,
        // newLeaseTokenAddress: state.newLeaseTokenAddress,
        account: state.account,
        module: state.module,
        cars: state.cars,
        members: state.members,
        members_new: state.members_new,
        eventAddNewObject: state.eventAddNewObject,
        objectID: state.objectID,
        newObject: state.newObject,
        progress: state.progress ? state.progress : false,
        usernames: state.usernames,
        [state.module]: state[state.module]
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(AddMember))