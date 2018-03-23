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
        module: state.module,
        member: state.member,
        cars: state.cars,
        car: state.car,
        members: state.members,
        sumBalanceOf: state.sumBalanceOf,
        unClaimedRedemption: state.unClaimedRedemption,
        crowdsaleClosed: state.crowdsaleClosed,
        paySubscriptionTxID: state.paySubscriptionTxID,
        progress: state.progress ? state.progress : false,
        [state.module]: state[state.module],
        [state.account]: state[state.account]
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Invest))