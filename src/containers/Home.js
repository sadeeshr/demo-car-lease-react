import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../actions'
import Home from '../components/Home';
/**
 * map state, actions to props
 */
const mapStateToProps = (state) => {
    // console.log("State: ", state)
    return {
        socket: state.socket,
        towns: state.towns
    }
}
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Home))