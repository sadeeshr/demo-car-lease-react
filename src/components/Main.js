import React, { Component } from 'react'
import Home from '../containers/Home';
import ObjectList from '../containers/ObjectList';
import Members from '../containers/Members';
import AddMember from '../containers/AddMember';
import Invest from '../containers/Invest';
import Invoices from '../containers/Invoices';
import NewObject from '../containers/NewObject';
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
        // if (!this.props.towns) this.fetchMunicipalityData()
    }


    fetchMunicipalityData = () => {
        let data = {
            module: "municipality",
            result: "towns",
        }
        if (this.props.socket) this.props._fetchContractData(this.props, data, this.props.account)
    }


    componentWillReceiveProps(nextProps) {
        cc.log("Main Update Props: ", nextProps, nextProps.socket, !nextProps.usernames);
        // if (nextProps.account && nextProps.socket && !nextProps.usernames) this.fetchUserData()
        // this.props.event && (this.props.event.transactionHash !== nextProps.event.transactionHash)

        if (nextProps.socket && !nextProps.towns) this.fetchMunicipalityData()
        if (nextProps.towns) this.props._setObject({ town: 0 })
        if ((nextProps.event && !this.props.event) || (nextProps.event && this.props.event && (this.props.event.transactionHash !== nextProps.event.transactionHash))) {
            switch (nextProps.event.event) {
                case "Transfer":
                    {
                        const txFrom = this.props.members.find(member => member.account && (member.account.toLowerCase() === nextProps.event.returnValues.to.toLowerCase()))
                        const txTo = this.props.members.find(member => member.objectID && (member.objectID.toString() === nextProps.event.returnValues.objectId))
                        const value = nextProps.event.returnValues.value
                        // cc.log(txFrom, txTo, value);
                        const message = (txFrom && txTo) ? `Awesome, ${txFrom.username} ${txFrom.town} has just invested ${value} euros on ${txTo.username} ${txTo.town}` : `Awesome, an investment made just now !`
                        let event = {
                            title: "Investment Update",
                            message: message,
                            level: "info",
                            position: "tr",
                            autoDismiss: 0
                        }
                        this.props._setEventAlert(event)
                        break;
                    }

                case "BoughtNewObject":
                    {
                        let alert = {
                            title: "New Object bought !",
                            message: "",
                            level: "info",
                            position: "tr",
                            autoDismiss: 0
                        }
                        this.props._setEventAlert(alert)
                        break;
                    }

                case "CreateNewUser":
                    {
                        let alert = {
                            title: "New Member is Authorized !",
                            message: "",
                            level: "info",
                            position: "tr",
                            autoDismiss: 0
                        }
                        this.props._setEventAlert(alert)
                        break;
                    }
                case "AddNewObject":
                    {
                        const event = nextProps.event
                        const newObject = this.props.newObject || ""
                        if (newObject && event.transactionHash === newObject.txID) {
                            let objectID = event.returnValues.objectID
                            // let newObjData = newObject.data
                            // newObjData["objectID"] = objectID
                            let data = {
                                module: "membersobj",
                                result: "members",
                                query: {
                                    "_id": newObject["id"]
                                },
                                data: { objectID: objectID }
                            }
                            cc.log(data)
                            const member = this.props.member
                            member["objectID"] = objectID
                            this.props._setObject(member)
                            this.props._updateContractData(this.props, data)
                            // this.props._writeNewContractData(this.props, data)

                            const townSelected = this.props.towns[this.props.town]
                            setTimeout(() => this.props._fetchMembers(this.props, townSelected["municipalityID"], this.props.account), 1000)
                            // this.props._setEventStatus({ eventAddNewObject: true, objectID: objectID }); setTimeout(() => { this.lcEventAddNewObjectUnsubscribe(); this.props._reloadTokens() }, 1000);
                        }

                        let alert = {
                            title: "New Object added !",
                            message: ``,
                            level: "info",
                            position: "tr",
                            autoDismiss: 0
                        }
                        this.props._setEventAlert(alert)
                        break;

                    }
                case "Claim":
                    {
                        let alert = {
                            title: "New Claim made !",
                            message: ``,
                            level: "info",
                            position: "tr",
                            autoDismiss: 0
                        }
                        this.props._setEventAlert(alert)
                        break;
                    }

                case "NewMember":
                    {
                        let alert = {
                            title: "New Member added !",
                            message: "",
                            level: "info",
                            position: "tr",
                            autoDismiss: 0
                        }
                        this.props._setEventAlert(alert)
                        break;
                    }

                case "NewObject":
                    {
                        let alert = {
                            title: "New Object created !",
                            message: "",
                            level: "info",
                            position: "tr",
                            autoDismiss: 0
                        }
                        this.props._setEventAlert(alert)
                        break;
                    }

                case "NewLeaseTokenObject":
                    {
                        let alert = {
                            title: "New Crowdfunding contract created !",
                            message: "",
                            level: "info",
                            position: "tr",
                            autoDismiss: 0
                        }
                        this.props._setEventAlert(alert)
                        break;
                    }

                default:
                    break;
            }

            // setTimeout(() => {
            //     const townSelected = this.props.towns[this.props.town]
            //     this.props._fetchMembers(this.props, (townSelected ? townSelected["municipalityID"] : "1"), this.props.account)
            // }, 1500); // commented for testing 30 june


        }
        if (nextProps.eventAlert && (this.props.eventAlert !== nextProps.eventAlert)) {
            // cc.log(this.refs)
            this.refs.notificationSystem.addNotification(nextProps.eventAlert);
        }

        if (nextProps.location.state) this.renderComponent()
        this.props = nextProps
    }

    renderMain = () => {
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
                                <td><img style={{ maxHeight: "200px" }} src={require('../assets/main.png')} alt="logo" /></td>
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
                case "objectlist":
                    return <ObjectList />
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
                case "newobject":
                    return <NewObject />
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
        const path = (this.props.location && this.props.location.state) ? this.props.location.state.path : "main"
        return (
            <div>
                <nav style={style.nav}>
                    <span onClick={() => this.props.history.push("/", { path: "home" })} style={{ cursor: "pointer", fontWeight: (["main", "home"].indexOf(path) !== -1) ? "800" : "100" }}>HOME</span> {" "}
                    <span onClick={() => this.props.history.push("/", { path: "addnewlife" })} style={{ cursor: "pointer", fontWeight: (path === "addnewlife") ? "800" : "100" }}>GA DUURZAAM</span>{" "}
                    <span onClick={() => this.props.towns && this.props.history.push("/", { path: "members" })} style={{ cursor: "pointer", fontWeight: (path === "members") ? "800" : "100" }}>LEDEN</span>{" "}
                </nav>

                <NotificationSystem ref="notificationSystem" />
                {this.renderComponent()}
            </div>
        )
    }
}

export default Main