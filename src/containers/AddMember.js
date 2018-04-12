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
        LeaseContract: state.LeaseContract,
        account: state.account,
        module: state.module,
        cars: state.cars,
        membersdev: state.membersdev,
        membersdev_new: state.membersdev_new,
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