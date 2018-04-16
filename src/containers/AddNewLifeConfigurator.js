import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import AddNewLifeConfigurator from '../components/AddNewLifeConfigurator';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    console.log("ADD NEW LIFE State: ", state)
    return {
        socket: state.socket,
        LeaseContract: state.LeaseContract,
        account: state.account,
        module: state.module,
        cars: state.cars,
        member: state.member,
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

export default withRouter(connect(mapStateToProps, mapActionsToProps)(AddNewLifeConfigurator))