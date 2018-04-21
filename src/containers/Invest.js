import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import Invest from '../components/Invest';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    // console.log("State: ", state)
    return {
        lcCars: state.lcCars,
        evTokenBalance: state.evTokenBalance,
        euroTokenBalance: state.euroTokenBalance,
        evTokens: state.evTokens,
        account: state.account,
        event: state.event,
        module: state.module,
        member: state.member,
        cars: state.cars,
        car: state.car,
        members: state.members,
        totalSupply: state.totalSupply,
        unClaimedRedemption: state.unClaimedRedemption,
        crowdsaleClosed: state.crowdsaleClosed,
        paySubscriptionTxID: state.paySubscriptionTxID,
        progress: state.progress ? state.progress : false,
        investInObjectTxID: state.investInObjectTxID,
        eventTransfer: state.eventTransfer,
        claimDividendTxID: state.claimDividendTxID,
        approveTxID: state.approveTxID,
        eventApprove: state.eventApprove,
        eventClaim: state.eventClaim,
        allowance: state.allowance,
        hashConfirmations: state.hashConfirmations,
        [state.module]: state[state.module],
        [state.account]: state[state.account]
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Invest))