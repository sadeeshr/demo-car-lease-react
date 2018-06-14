import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import NewObject from '../components/NewObject';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    // console.log("State: ", state)
    return {
        socket: state.socket,
        towns: state.towns,
        town: state.town,
        usernames: state.usernames,
        members: state.members,
        member: state.member,
        newObject: state.newObject,
        account: state.account,
        event: state.event,
        progress: state.progress,
        registered: state.registered
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(NewObject))