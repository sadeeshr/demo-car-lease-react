import React, { Component } from 'react'
import Home from '../containers/Home';
import Members from '../containers/Members';
import AddMember from '../containers/AddMember';
import Invest from '../containers/Invest';
import Invoices from '../containers/Invoices';
import ModelViewer from 'metamask-logo'
import AddNewLifeConfigurator from '../containers/AddNewLifeConfigurator';
import { Link } from 'react-router-dom'
import NotificationSystem from 'react-notification-system';
import cc from '../lib/utils';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: "Please Unlock Your Metamask"
        }
        this.redirectURL = "http://www.1112.net/lastpage.html"
        this.viewer = ModelViewer({

            // Dictates whether width & height are px or multiplied
            pxNotRatio: true,
            width: 100,
            height: 100,
            // pxNotRatio: false,
            // width: 0.9,
            // height: 0.9,

            // To make the face follow the mouse.
            followMouse: true,

            // head should slowly drift (overrides lookAt)
            slowDrift: false,

        })
    }

    componentWillMount() {
        // cc.log("MAIN: ", this.props, window.location.hostname);
        if (!this.props.socketConnection) this.props._connectSocket(this.props, window.location.hostname)

        const { web3 } = window
        // Check if Web3 has been injected by the browser:
        if (typeof web3 !== 'undefined') {
            // You have a web3 browser! Initiate Contract Object!
            if (!this.props.LeaseContract) this.props._initContract(this.props, web3)

            // this.setState({ alert: "Please Install Metamask plugin", url: "https://metamask.io/" })

            // if (!this.props.account) this.props._getAccount();
        } else {
            // Warn the user that they need to get a web3 browser
            // Or install MetaMask, maybe with a nice graphic.
            cc.log("NO WEB3");
            this.setState({ alert: "Please Install Metamask plugin", url: "https://metamask.io/" })
        }

        window.onbeforeunload = (e) => this.props.history.replace("/", null)  // Page Refresh, route to HOME
    }

    componentDidMount() {

        // window.addEventListener("beforeunload", this.onUnload.bind(this))
        setTimeout(() => {
            this.fetchUserData()
        }, 1000);

        // add viewer to DOM
        let container = document.getElementById('metamask-logo')
        if (container) container.appendChild(this.viewer.container)
    }

    fetchUserData = () => {
        let data = {
            module: "membersdev",
            result: "usernames",
            query: {
                module: "westland"
            },
            filter: {
                _id: 0,
                username: 1,
                account: 1
            }
        }
        if (!this.props.members && this.props.socket) this.props._fetchContractData(this.props.account, data)
        if (this.props.account) this.checkRegistered(this.props.account)
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
        if (nextProps.account && nextProps.socket && !nextProps.usernames) this.fetchUserData()

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
        // const thumbImg = { "maxHeight": "40px", "maxWidth": "40px", "display": "block", "width": "auto", "height": "auto" }
        // const disabled = (this.props.account && (typeof this.state.registered !== "undefined")) ? false : true
        // const cursor = this.props.account ? "pointer" : "not-allowed"

        return <div className="content-border">
            <div className="mainContentCon">
                {/* <div className="navCon">
                    <h1 id="header">ENERGY NEUTRAL 2030</h1>
    </div>*/}
                <div className="contentCon overflow bg-none">


                    <table>
                        <tbody>
                            <tr>
                                <td><img src={require('../assets/car-solar.png')} alt="logo" /></td>
                                {/* <td>
                                <img className="flagMargin" style={thumbImg} src={require('../assets/india_flag.jpg')} alt="logo" />
                                <img style={thumbImg} src={require('../assets/netherlands_flag.png')} alt="logo" />
                            </td> */}
                            </tr>
                        </tbody>
                    </table>
                    <p className="text-center"><strong>This is your last chance.<br />Afer this, there is no turning back</strong></p>
                    <p className="text-center">You press the blue pull--the story ends, you wake up in your bed and believe whatever you want to believe.</p>
                    <p className="text-center">You press the red pill--you stay in Wonderland, and I show you how deep the rabbit hole goes.</p>


                    {/*<div className="contentBtn ">
                        <div hidden={!disabled} id="metamask-logo" style={{ textAlign: "center" }}><span hidden={!disabled} style={{ cursor: this.state.url ? "pointer" : "default" }} onClick={() => this.state.url ? window.open(this.state.url, "_blank") : ""}>{this.state.alert}</span></div>
                        <button style={{ cursor: cursor }} disabled={disabled} onClick={() => this.props.history.push("/", { module: "westland", path: "home" })} >Westland</button>
                        <button style={{ cursor: cursor }} disabled={disabled} onClick={() => this.props.history.push("/", { module: "middendelftland", path: "home" })}>Midden Delftland</button>

                        </div>*/}
                </div>
                <div className="footCon">
                    <div className="contentBtn">
                        <div hidden={this.props.account} id="metamask-logo" style={{ textAlign: "center" }}><span hidden={this.props.account} style={{ cursor: this.state.url ? "pointer" : "default" }} onClick={() => this.state.url ? window.open(this.state.url, "_blank") : ""}>{this.state.alert}</span></div></div>
                    {
                        (this.props.usernames && this.props.account) &&
                        <div>
                            <button className="lrBtn"><Link style={{ border: "none" }} target="_blank" to={this.redirectURL}><img alt="blue" src={require('../assets/blue-light.png')} /></Link></button>
                            <button className="lrBtn" onClick={() => this.props.history.push("/", { module: "westland", path: this.state.registered ? "members" : "addmember" })}><img alt="red" src={require('../assets/red-light.png')} /></button>
                        </div>
                    }
                    {/*<button onClick={() => this.props.history.push("/", { module: "westland", path: "members" })}>Members</button>*/}
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
        return (
            <div>
                <NotificationSystem ref="notificationSystem" />
                {this.renderComponent()}
            </div>
        )
    }
}

export default Main