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
        filter: state.filter,
        towns: state.towns,
        town: state.town,
        account: state.account,
        registered: state.registered,
        usernames: state.usernames,
        members: state.members,
        member: state.member,
        socket: state.socket,
        event: state.event,
        eventAlert: state.eventAlert,
        initRoute: state.initRoute,
        newObject: state.newObject
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Main))