import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import Main from '../components/Main';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    // console.log("State: ", state)
    return {
        account: state.account,
        usernames: state.usernames,
        members: state.members,
        socket: state.socket,
        event: state.event,
        eventAlert: state.eventAlert,
        initRoute: state.initRoute,
        newObject: state.newObject
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Main))