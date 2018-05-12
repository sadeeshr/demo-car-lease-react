import React, { Component } from 'react'
import Home from '../containers/Home';
import Members from '../containers/Members';
import AddMember from '../containers/AddMember';
import Invest from '../containers/Invest';
import Invoices from '../containers/Invoices';
import AddNewLifeConfigurator from '../containers/AddNewLifeConfigurator';
import { Link } from 'react-router-dom'
import NotificationSystem from 'react-notification-system';
import cc from '../lib/utils';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.redirectURL = "http://www.1112.net/lastpage.html"
    }

    componentWillMount() {
        // cc.log("MAIN: ", this.props, window.location.hostname);
        if (!this.props.socketConnection) this.props._connectSocket(this.props, window.location.hostname)

        const { web3 } = window
        // Check if Web3 has been injected by the browser:
        if (typeof web3 !== 'undefined') {
            // You have a web3 browser! Initiate Contract Object!
            if (!this.props.LeaseContract) this.props._initContract(this.props, web3)

        } else {
            // Warn the user that they need to get a web3 browser
            // Or install MetaMask, maybe with a nice graphic.
            cc.log("NO WEB3");

        }

        window.onbeforeunload = (e) => this.props.history.replace("/", null)  // Page Refresh, route to HOME
    }

    componentDidMount() {
        // this.fetchUserData()
    }

 
    checkRegistered = (account) => {
        if (this.props.usernames) {
            const accounts = this.props.usernames ? this.props.usernames.map(user => user.account) : []
            // cc.log(accounts, account, accounts.indexOf(account));
            this.setState({
                registered: (accounts.indexOf(account) !== -1) ? true : false
            })

        }
    }

    componentWillReceiveProps(nextProps) {
        // cc.log("Main Update Props: ", nextProps, nextProps.socket, !nextProps.usernames);
        // if (nextProps.account && nextProps.socket && !nextProps.usernames) this.fetchUserData()

        if (nextProps.event && this.props.event !== nextProps.event) {
            switch (nextProps.event.event) {
                case "Transfer":
                    {
                        const txFrom = this.props.members.find(member => member.account && (member.account.toLowerCase() === nextProps.event.returnValues.to.toLowerCase()))
                        const txTo = this.props.members.find(member => member.carID && (member.carID.toString() === nextProps.event.returnValues.objectId))
                        const value = nextProps.event.returnValues.value
                        // cc.log(txFrom, txTo, value);
                        const message = (txFrom && txTo) ? `Awesome, ${txFrom.username} ${txFrom.town} has just invested ${value} euros on ${txTo.username} ${txTo.town}'s Car` : `Awesome, an investment made just now !`
                        let event = {
                            title: "Investment Update",
                            message: message,
                            level: "info",
                            position: "tr",
                            autoDismiss: 5
                        }
                        this.props._setEventAlert(event)
                        break;
                    }
                case "AddNewObject":
                    {
                        const event = nextProps.event
                        const newObject = this.props.newObject || ""
                        if (newObject && event.transactionHash === newObject.txID) {
                            let objectID = event.returnValues.objectID
                            let newObjData = newObject.data
                            newObjData["carID"] = objectID
                            let data = {
                                module: "membersdev",
                                result: "members",
                                query: { "_id": newObject.id },
                                data: newObjData
                            }
                            cc.log(data)
                            this.props._updateContractData(data)
                            setTimeout(() => this.props._fetchMembers("westland", this.props.account), 1000)
                            // this.props._setEventStatus({ eventAddNewObject: true, objectID: objectID }); setTimeout(() => { this.lcEventAddNewObjectUnsubscribe(); this.props._reloadTokens() }, 1000);
                        }

                        let alert = {
                            title: "Great, A New Car has been added !!",
                            message: ``,
                            level: "info",
                            position: "tr",
                            autoDismiss: 5
                        }
                        this.props._setEventAlert(alert)
                        break;

                    }
                case "Claim":
                    {
                        let alert = {
                            title: "A New Claim has been made !!",
                            message: ``,
                            level: "info",
                            position: "tr",
                            autoDismiss: 5
                        }
                        this.props._setEventAlert(alert)
                        break;
                    }
                default:
                    break;
            }
        }
        if (nextProps.eventAlert && (this.props.eventAlert !== nextProps.eventAlert)) {
            // cc.log(this.refs)
            this.refs.notificationSystem.addNotification(nextProps.eventAlert);
        }

        if (nextProps.account) this.checkRegistered(nextProps.account)
        if (nextProps.location.state) this.renderComponent()
        this.props = nextProps
    }

    renderMain = () => {
        cc.log("REGISTRATION STATUS: ", this.state.registered)
        const img = { "maxHeight": "95px", "maxWidth": "180px", "display": "block", "width": "auto", "height": "auto" }

        return <div className="content-border">
            <div className="mainContentCon">
                <div className="contentCon overflow bg-none">

                    <p className="text-center"><strong>GA</strong> Duurzaam</p>
                    <p className="text-center">en bespaaar tot 50%</p>
                    <p className="text-center">op je energie rekening</p>

                    <table>
                        <tbody>
                            <tr>
                                <td><img src={require('../assets/car-solar.png')} alt="logo" /></td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="text-center">...en een Alternatief voor je</p>
                    <p className="text-center">Spaarrekening en Pensioen</p>
                </div>
                <div className="footCon">
                    <div>
                        <span>Verder</span>
                        <button className="arrowBtn" onClick={() => this.props.history.push("/", { path: "home" })}>
                            <img src={require('../assets/arrow.jpg')} alt="addM" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }

    renderComponent = () => {
        if (this.props.location && this.props.location.state) {
            const historyState = this.props.location.state
            switch (historyState.path) {
                case "home":
                    return <Home />
                case "members":
                    return <Members />
                case "addmember":
                    return <AddMember />
                case "addnewlife":
                    return <AddNewLifeConfigurator />
                case "invest":
                    return <Invest />
                case "invoices":
                    return <Invoices />
                default:
                    return this.renderMain()
            }
        } else
            return this.renderMain()
    }

    render() {
        // cc.log("Main State: ", this.state);
        const style = {
            nav: {
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                textAlign: "center"
            }
        }
        return (
            <div>
                <nav style={style.nav}>
                    <span><strong>HOME</strong></span> {" "}
                    <span>GA DUURZAAM</span>{" "}
                    <span>LEDEN</span>{" "}
                </nav>

                <NotificationSystem ref="notificationSystem" />
                {this.renderComponent()}
            </div>
        )
    }
}

export default Main