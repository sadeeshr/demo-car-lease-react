import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import Invoices from '../components/Invoices';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    console.log("Invoices Container Props: ", state)
    return {
        account: state.account,
        member: state.member,
        allowance: state.allowance,
        progress: state.progress ? state.progress : false,
        invoices: state.invoices,
        invoices_new: state.invoices_new,
        paySubscriptionTxID: state.paySubscriptionTxID,
        eventSubscription: state.eventSubscription
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Invoices))