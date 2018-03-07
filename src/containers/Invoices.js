import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import Invoices from '../components/Invoices';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    console.log("State: ", state)
    return {
        LeaseContract: state.LeaseContract,
        account: state.account,
        car : state.car,
        member: state.member
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Invoices))