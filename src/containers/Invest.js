import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import Invest from '../components/Invest';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    console.log("State: ", state)
    return {
        LeaseContract: state.LeaseContract,
        euroToken: state.euroToken,
        evTokenBalance: state.evTokenBalance,
        euroTokenBalance: state.euroTokenBalance,
        evToken: state.evToken,
        evTokens: state.evTokens,
        account: state.account,
        module: state.module,
        member: state.member,
        cars: state.cars,
        members: state.members,
        [state.module]: state[state.module],
        [state.account]: state[state.account]
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Invest))