import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import Objects from '../components/Objects';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    // console.log("Members Container State: ", state)
    return {
        filter: state.filter,
        textStyle: state.textStyle,
        towns: state.towns,
        town: state.town,
        registered: state.registered,
        usernames: state.usernames,
        newLeaseTokenAddress: state.newLeaseTokenAddress,
        euroTokenBalance: state.euroTokenBalance,
        unClaimedRedemption: state.unClaimedRedemption,
        // lcCars: state.lcCars,
        AddNewUser: state.AddNewUser,
        evTokens: state.evTokens,
        reloadTokens: state.reloadTokens,
        account: state.account,
        event: state.event,
        member: state.member,
        members: state.members,
        members_new: state.members_new,
        addNewObjectTxID: state.addNewObjectTxID,
        addNewObjectID: state.addNewObjectID,
        addNewObjectHash: state.addNewObjectHash,
        eventAddNewObject: state.eventAddNewObject,
        objectID: state.objectID,
        newObject: state.newObject,
        newCrowdFundToken: state.newCrowdFundToken,
        investInObjectTxID: state.investInObjectTxID,
        activateDeactivateObjectTxID: state.activateDeactivateObjectTxID,
        hashConfirmations: state.hashConfirmations,
        progress: state.progress ? state.progress : false,
        [state.module]: state[state.module]
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Objects))