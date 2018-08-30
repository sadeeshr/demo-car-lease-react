import React, { Component } from 'react'
import Home from '../containers/Home';
import ObjectList from '../containers/ObjectList';
import Members from '../containers/Members';
import AddMember from '../containers/AddMember';
import Invest from '../containers/Invest';
import Invoices from '../containers/Invoices';
import NewObject from '../containers/NewObject';
import AddNewLifeConfigurator from '../containers/AddNewLifeConfigurator';
import formatNumber from 'accounting-js/lib/formatNumber.js'
import { Link } from 'react-router-dom'
import NotificationSystem from 'react-notification-system';
import cc from '../lib/utils';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchbarCondition: false,
        }
        this.redirectURL = "http://www.1112.net/lastpage.html"
    }

    componentWillMount() {
        // cc.log("MAIN: ", this.props, window.location.hostname);
        if (!this.props.socketConnection) this.props._connectSocket(this.props, window.location.hostname)

        const { web3 } = window
        // Check if Web3 has been injected by the browser:
        if (typeof web3 !== 'undefined') {
            // You have a web3 browser! Initiate Contract Object!
            this.setState({ metamask: true }, () => {
                if (!this.props.LeaseContract) this.props._initContract(this.props, web3)
            })
        } else {
            // Warn the user that they need to get a web3 browser
            // Or install MetaMask, maybe with a nice graphic.
            cc.log("NO WEB3");
            this.setState({ metamask: false })

        }

        window.onbeforeunload = (e) => this.props.history.replace("/", null)  // Page Refresh, route to HOME
    }

    componentDidMount() {
        // this.fetchUserData()
        // if (!this.props.towns) this.fetchMunicipalityData()
    }

    handleClick() {
        this.setState({
            searchbarCondition: !this.state.searchbarCondition
        });
    }


    fetchMunicipalityData = () => {
        let data = {
            module: "municipality",
            result: "towns",
        }
        if (this.props.socket) this.props._fetchContractData(this.props, data, this.props.account)
    }


    componentWillReceiveProps(nextProps) {
        // cc.log("Main Update Props: ", nextProps, nextProps.socket, !nextProps.usernames);
        // if (nextProps.account && nextProps.socket && !nextProps.usernames) this.fetchUserData()
        // this.props.event && (this.props.event.transactionHash !== nextProps.event.transactionHash)

        // if (nextProps.socket && !nextProps.towns) this.fetchMunicipalityData()
        if (nextProps.socket && nextProps.account && !nextProps.usernames) this.props._fetchUsers(nextProps, nextProps.account)
        if (nextProps.account && nextProps.usernames) {
            if (nextProps.usernames) {

                const member = nextProps.usernames ? nextProps.usernames.find(user => user.account === nextProps.account) : null

                if (member) {
                    this.props._setObject({ registered: member["_id"] })
                } else
                    cc.log("USER NOT REGISTERED YET")
            }
        }

        if (nextProps.towns) this.props._setObject({ town: 0 })
        if ((nextProps.event && !this.props.event) || (nextProps.event && this.props.event && (this.props.event.transactionHash !== nextProps.event.transactionHash))) {
            switch (nextProps.event.event) {
                case "InvestInObject":
                    {
                        const objectID = nextProps.event.returnValues.objectID
                        const amount = nextProps.event.returnValues.amount
                        const member = nextProps.members && nextProps.members.find(member => member.objectID && (member.objectID === objectID))
                        // let message = "Awesome, an investment made just now !"
                        // let message = (member.objectName || "Coin") + " heeft " + ((member.raised || 0) + parseInt(amount, 10)) + " euro ontvangen, nog " + amount + " te gaan"

                        if (member) {
                            const raised = formatNumber(((member.raised || 0) + parseInt(amount, 10)), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })
                            const remaining = formatNumber(((member.objectprice || 0) - ((member.raised || 0) + parseInt(amount, 10))), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })
                            let message = "Er is " + raised + " euro in " + (member.objectName || "Coin") + " geïnvesteerd, nog " + remaining + " euro te gaan."
                            // if (this.props.members) {
                            //     const txFrom = this.props.members.find(member => member.account && (member.account.toLowerCase() === nextProps.event.returnValues.to.toLowerCase()))
                            //     const txTo = this.props.members.find(member => member.objectID && (member.objectID.toString() === nextProps.event.returnValues.objectId))
                            //     const value = nextProps.event.returnValues.value
                            //     // cc.log(txFrom, txTo, value);
                            //     message = (txFrom && txTo) ? `Awesome, ${txFrom.username} ${txFrom.town} has just invested ${value} euros on ${txTo.username} ${txTo.town}` : `Awesome, an investment made just now !`
                            // }

                            let event = {
                                title: message,
                                message: "",
                                level: "info",
                                position: "tr",
                                autoDismiss: 0
                            }
                            this.props._setEventAlert(event)
                        } else {

                            let data = {
                                module: "crowdfundobj",
                                result: "member",
                                findone: true,
                                query: {
                                    objectID: objectID
                                }
                            }
                            this.props._fetchContractData(this.props, data, this.props.account)
                        }
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

                case "UpdateMember":
                    this.props._fetchUsers(this.props, this.props.account)
                    break;

                case "CreateNewUser":
                case "Approval":
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
                        const newLifeObj = this.props.newLifeObj || ""

                        if (newObject && newLifeObj && event.transactionHash === newObject.txID) {
                            let objectID = event.returnValues.objectID
                            // let newObjData = newObject.data
                            newLifeObj["objectID"] = objectID

                            // let data = {
                            //     module: "crowdfundobj",
                            //     result: "members",
                            //     query: {
                            //         "_id": newObject["id"]
                            //     },
                            //     data: { objectID: objectID }
                            // }
                            // cc.log(data)

                            // const member = this.props.member
                            // if (!member["objectID"]) {
                            //     member["objectID"] = objectID
                            //     this.props._setObject(member)
                            // }

                            // this.props._updateContractData(this.props, data)


                            let data = {
                                module: "crowdfundobj",
                                result: "members",
                                data: newLifeObj
                            }

                            cc.log(data)
                            this.props._writeNewContractData(this.props, data)

                            this.props._setObject({ addNewObjectTxID: event.transactionHash, addNewObjectID: objectID })
                            // const townSelected = this.props.towns[this.props.town]
                            // setTimeout(() => this.props._fetchMembers(this.props, townSelected["municipalityID"], this.props.account), 1000)
                            // setTimeout(() => this.props._fetchMembers(this.props, "1", this.props.account), 1000)
                            // this.props._setEventStatus({ eventAddNewObject: true, objectID: objectID }); setTimeout(() => { this.lcEventAddNewObjectUnsubscribe(); this.props._reloadTokens() }, 1000);
                        }

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

                case "PayCapitalAndOperation":
                    {
                        let alert = {
                            title: "New Invoice Paid !",
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
                            title: nextProps.event.data + " aangemaakt, investeer nu!",
                            message: ``,
                            level: "info",
                            position: "tr",
                            autoDismiss: 0
                        }
                        this.props._setEventAlert(alert)
                        break;
                    }

                case "NewInvoice":
                    {
                        let alert = {
                            title: "New Invoice created !",
                            message: "",
                            level: "info",
                            position: "tr",
                            autoDismiss: 0
                        }
                        this.props._setEventAlert(alert)
                        break;
                    }

                case "NewCrowdFundToken":
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

        if (this.props.event && !this.props.eventAlert && this.props.event.event === "InvestInObject" && this.props.member && this.props.member.raised && this.props.member.objectprice) {
            const amount = ((this.props.member.raised || 0) + parseInt(this.props.event.returnValues.amount, 10))
            const raised = formatNumber(amount, { precision: 2, thousand: ".", decimal: ",", stripZeros: true })
            const remaining = formatNumber(((this.props.member.objectprice || 0) - amount), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })
            let message = "Er is " + raised + " euro in " + (this.props.member.objectName || "Coin") + " geïnvesteerd, nog " + remaining + " euro te gaan."

            let event = {
                title: message,
                message: "",
                level: "info",
                position: "tr",
                autoDismiss: 0,
                uid: this.props.member.objectID
            }
            this.props._setEventAlert(event)
        }
    }

    renderMain = () => {
        // console.log(this.props.usernames, this.props.registered, this.props.account);
        const nextScreen = ((this.props.usernames && this.props.registered) || !this.props.account) ? "members" : "addmember"
        const isReady = this.state.metamask && (this.props.networkVersion === "4") && this.props.account

        cc.log("MEMBER ID: ", this.props.registered)

        const img = { "maxHeight": "95px", "maxWidth": "180px", "display": "block", "width": "auto", "height": "auto" }

        return <div className="content-border">
            <div className="mainContentCon">
                <div className="contentCon overflow bg-none">

                    <p className="text-center fs-30 mb-15">Duurzame Zaken</p>
                    <p className="text-center fs-20">Start je eigen Crowdfund</p>
                    <p className="text-center fs-20">en verkoop je Coin</p>

                    {/* <div className="demoApp" >
                        <p><strong>DEMO APP</strong></p>
                        <p>WIN EEN TESLA</p>
                        <p>MET</p>
                        <p>DE STRAAT</p>
                    </div> */}


                    <table>
                        <tbody>
                            <tr>
                                <td><img style={{ maxHeight: "200px" }} src={isReady ? require('../assets/main.png') : require('../assets/metamask.png')} alt="logo" /></td>
                            </tr>
                        </tbody>
                    </table>

                    {isReady && <div>
                        <p className="text-center fs-20">Investeer in andere Coins</p>
                        <p className="text-center fs-20 mb-15">en bepaal je rendement</p>
                        <p className="text-center fs-20">Elk moment Uitstapbaar</p>
                    </div>}
                    {!this.state.metamask ?
                        <p className="text-center fs-20">Start hier : <Link target="_self" to="https://metamask.io"><span style={{ color: "red" }}>Installeer Metamask</span>
                        </Link></p>
                        :
                        (this.props.networkVersion !== "4") ?
                            <p className="text-center fs-20">Wijzig network naar Rinkeby</p>
                            :
                            !this.props.account && <p className="text-center fs-20">Login je Metamask account</p>
                    }

                </div>
            </div>
            <div className="footBtn">
                <div className="container text-center">
                    <div className="beforeFooter">
                        <div className="col-4">
                            &nbsp;
                            </div>
                        {<div className="col-4 arrowHover-s2">
                            <button disabled={!(this.props.usernames || !this.props.account) || !isReady} className="arrowBtn" onClick={() => this.props.history.push("/", { path: nextScreen })}>
                                <span className="flaticon-right-arrow"></span>
                            </button>
                        </div>}
                        <div className="col-4 pt-30 text-left">
                            <span><strong>ZAKEN</strong></span>
                        </div>

                    </div>
                </div>
            </div>
            <div className="footCon-bottom">
                <div className="social bg-lightgrey">
                    <div className="container">
                        <span className="smallText">VOLG ONS</span>

                        <span className="flaticon-twitter-logo-on-black-background"></span>
                        <span className="flaticon-facebook-logo"></span>
                        <span className="flaticon-social-media"></span>
                    </div>
                </div>
                <div className="contact bg-grey textWhite">
                    <div className="container">
                        <Link target="_self" to="mailto:info@duurzamezaken.io"><span className="smallText">CONTACT</span>
                        </Link>
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
                case "profile":
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
                borderTop: "1px solid #333333",
                borderBottom: "1px solid #333333",
                textAlign: "center"
            }
        }
        const path = (this.props.location && this.props.location.state) ? this.props.location.state.path : "main"
        const registered = (this.props.account && this.props.usernames && (this.props.usernames.find(user => user.account === this.props.account)))
        const isReady = this.state.metamask && (this.props.networkVersion === "4") && this.props.account

        return (
            <div>
                <div className="beforeNav container smallText">
                    <div className={this.state.searchbarCondition ? "mainBody search-is-open" : "mainBody search-is-close"}>
                        <div className="body1">
                            {/*
                                registered && <button className="profileicon flatcon pull-left" onClick={() => this.props.history.push("/", { path: "profile" })}>
                                    <span className="flaticon-man-user flatcon "></span>
                                </button>
                            */}
                            Duurzame Zaken . IO
                    {
                                (path === "members") && <span className="flaticon-search flatcon pull-right" onClick={() => this.handleClick()}></span>
                            }
                        </div>
                        <div className="body2">
                            {
                                (path === "members") && <div>
                                    <input className="searchInput" type="text" name="filterMembers" value={this.props.filter || ""} placeholder="Search"
                                        onChange={(e) => {
                                            // let filterVal = this.props.filter ? (this.props.filter + e.target.value) : e.target.value
                                            // cc.log("SEARCH: ", this.props.filter, e.target.value, filterVal);
                                            this.props._setObject({ filter: e.target.value })
                                        }} /><span className="flaticon-cancel" onClick={() => this.handleClick()}></span></div>
                            }
                        </div>
                    </div>
                </div>
                {/* <div className="beforeNav container smallText"><span className="flaticon-man-user flatcon pull-left"></span>WESTLAND ENERGIE NEUTRAL , NL<span className="flaticon-search flatcon pull-right"></span></div> */}
                <nav className="navCon" style={style.nav}>
                    <span onClick={() => this.props.history.push("/", { path: "main" })} style={{ cursor: "pointer", fontWeight: (["main", "home"].indexOf(path) !== -1) ? "800" : "100" }}>THUIS</span> {" "}
                    {isReady && <span onClick={() => this.props.history.push("/", { path: "addnewlife" })} style={{ cursor: "pointer", fontWeight: (path === "addnewlife") ? "800" : "100" }}>DUURZAAM</span>}{" "}
                    {isReady && <span onClick={() => this.props.history.push("/", { path: "members" })} style={{ cursor: "pointer", fontWeight: (path === "members") ? "800" : "100" }}>ZAKEN</span>}{" "}
                    {registered && <span onClick={() => this.props.history.push("/", { path: "profile" })} style={{ cursor: "pointer", fontWeight: (path === "profile") ? "800" : "100" }}>IK</span>}{" "}
                    {/*<span onClick={() => this.props.towns && this.props.history.push("/", { path: "members" })} style={{ cursor: this.props.towns ? "pointer" : "not-allowed", fontWeight: (path === "members") ? "800" : "100" }}>LEDEN</span>{" "}*/}
                </nav>

                <NotificationSystem ref="notificationSystem" />
                {this.renderComponent()}
            </div >
        )
    }
}

export default Main