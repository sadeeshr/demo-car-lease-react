import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import AddNewLifeConfigurator from '../components/AddNewLifeConfigurator';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    // console.log("ADD NEW LIFE State: ", state)
    return {
        socket: state.socket,
        towns: state.towns,
        town: state.town,
        LeaseContract: state.LeaseContract,
        account: state.account,
        registered: state.registered,
        module: state.module,
        coinNames: state.coinNames,
        duurzamobjects: state.duurzamobjects,
        // cars: state.cars,
        member: state.member,
        members: state.members,
        members_new: state.members_new,
        eventAddNewObject: state.eventAddNewObject,
        objectID: state.objectID,
        event: state.event,
        newObject: state.newObject,
        progress: state.progress ? state.progress : false,
        usernames: state.usernames,
        newLifeObj: state.newLifeObj,
        newLeaseTokenAddress: state.newLeaseTokenAddress,
        [state.module]: state[state.module]
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(AddNewLifeConfigurator))