import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { Link } from 'react-router-dom'
import cc from '../lib/utils';

class Members extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: ''
        }
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
    }



    componentWillMount() {
        // cc.log("Members Props", this.props);
        // this.setState({ eventAddNewObject: this.props.eventAddNewObject === "pending" ? this.props.eventAddNewObject : null })
        // if (this.props.reloadTokens || this.props.members_new || this.props.AddNewUser) this.fetchMembers()
    }

    componentDidMount() {
        if (!this.props.members) {
            this.fetchMembers()
        }
    }

    fetchMembers = () => {
        let data = {
            module: "membersdev",
            result: "members",
            query: {
                module: this.props.location.state.module
            },
            filter: {
                _id: 1,
                username: 1,
                town: 1,
                message: 1,
                carID: 1,
                carPic: 1,
                carPrice: 1,
                module: 1,
                account: 1
            }
        }
        this.props._fetchContractData(this.props.account, data)
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps
        // cc.log("Members Update Props", nextProps);
        // if (this.props.members && ) this.props._reloadTokens()
        // if (this.props.reloadTokens) this.fetchMembers()
        // if (this.props.eventAddNewObject && this.props.objectID && this.props.newObject) {
        //     let objectID = this.props.objectID
        //     let newObject = this.props.newObject
        //     newObject.data["carID"] = objectID
        //     this.props._writeNewContractData(newObject)
        // }
        // if (this.props.eventAddNewObject && !this.state.eventAddNewObject) this.setState({ eventAddNewObject: this.props.eventAddNewObject })

        if (this.props.members) {
            let members = this.sortMembers()
            // cc.log("######## SORTED MEMBERS ###########", members);
            // if (members.length >= 3) {
            // members[0].car ? members[0].car.crowdsaleClosed = true : ""
            // members[1].car ? members[1].car.crowdsaleClosed = true : ""
            //     // members[2].car ? members[2].car.crowdsaleClosed = true : ""
            // }
            this.setState({ members })
            // if (!this.props.lcCars)
            // for (let i = 1; i <= this.props.members.length; i++) {
            //     // this.fetchCar(i)
            //     this.props._lcCars(i)
            //     this.props._evMyTokens(this.props.account, i)
            // }
            // this.props.members.map(member => {
            //     if (!member.car) this.props._lcCars(member.carID)
            //     if (!member.evTokens) this.props._evMyTokens(this.props.account, member.carID)

            // })
            // if (!this.props.evTokens) this.props._reloadTokens()
        }

        // if (this.props.addNewObjectTxID || this.props.raiseFundsForCarTxID) this.fetchMembers()
    }

    // evTokenMyTokens = (carID) => {
    //     this.props.evToken.myTokens(this.props.account, carID)
    //         .then(result => {
    //             this.setState({ ["evToken_" + carID]: result[0].toString() })
    //         })
    // }

    fetchEvTokens = () => {
        for (let i = 1; i <= this.props.members.length; i++) {
            this.props._evMyTokens(this.props.account, i)
        }
    }

    renderMember = (member, i) => {

        cc.log("Member: ", member);
        const img = member.carPic ? { "display": "block" } : { height: "auto", width: "auto" }
        // if (this.props.account)
        // if (!(this.props.evTokens && this.props.evTokens[member.carID]) || this.props.addNewObjectTxID || this.props.raiseFundsForCarTxID) this.props._evMyTokens(this.props.account, member.carID)
        // this.evTokenMyTokens(member.carID)
        const selected = (this.props.member && !this.props.member.crowdsaleClosed) ? (this.props.member.username === member.username ? true : false) : false
        let memberRows = [
            <div className="mtableLink" ref={divRef => this[member.carID] = divRef} key={i} onClick={() => member.authorized ? this.props._memberSelected(member, this.props.account, this.props.location.state.module) : cc.log("MEMBER NOT AUTHORIZED")}>
                {!member.authorized && <div className="membersBtn">
                    <button title="Authorize" className="arrowBtn" onClick={() => member.account !== this.props.account ? this.props._lcAddUser(member.account, this.props.account) : cc.log("MEMBER NOT AUTHORIZED, NO SELF AUTHORIZE")}>
                        <img src={require('../assets/add.jpg')} alt="addM" />
                    </button>
                </div>}
                <div className="mtableTokens">{member.crowdsaleClosed ? <span style={{ color: "green", fontSize: "12px" }}>Closed</span> : member.totalRaised || "0"} <p>{member.evTokens}</p></div>
                <div className="mtableUser">{member.username || ""} <p>{member.town || ""}</p></div>
                {<div className="mtableCar"><img style={img} src={member.carPic || require('../assets/noimage.png')} alt="carImage" /><span title="Car Raised" style={{ fontSize: "12px" }}>Euro {member.carPrice || "0"}</span></div>}
                {(this.props.newObject && this.props.newObject.id === member["_id"]) &&
                    (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newObject.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.newObject.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red" }}>pending</p>}</Link>)}
            </div>
        ]

        if (selected) {
            memberRows.push(

                <div className="rowSelect" key={'invest-' + i}>
                    <div style={{ cursor: (member.carID || member.authorized) ? "pointer" : "not-allowed" }} className="memberMesCon">{(member.carID || member.authorized) ? member.message : "Not Allowed to Add New Life Configurator"}</div>
                    {member.carID && <div className="memberMesBtns">
                        <div className="membersBtn">
                            <button className="arrowBtn" onClick={() => { member.authorized ? this.props.history.push("/", { module: this.props.location.state.module, path: "invest" }) : cc.log("NO OBJECT CONFIGURED") }}>
                                <img src={require('../assets/arrow.jpg')} alt="addM" />
                            </button>
                            <button title="Invoices (testing)" className="arrowBtn" onClick={() => { member.authorized ? this.props.history.push("/", { module: this.props.location.state.module, path: "invoices" }) : cc.log("NO OBJECT CONFIGURED") }}>
                                <img src={require('../assets/add.jpg')} alt="addI" />
                            </button>
                        </div>
                    </div>}
                </div>
            )
        }

        return <div className="leaseCarCon" key={i}>{memberRows}</div>
    }

    sortMembers = () => {
        if (this.props.members) {
            const members = this.props.members.sort((a, b) => {
                if (a.car && a.car.crowdsaleClosed)
                    return 0
                else if (a.totalRaised && b.totalRaised) {
                    // cc.log(`Car Raised-${b.carID}=> ${b.totalRaised} - Car Raised-${a.carID}=> ${a.totalRaised}`);
                    return b.totalRaised - a.totalRaised
                } else
                    return 0
            })
            // cc.log("$$$$$$$$$ sorted members: $$$$$$$$$$$$$", members);
            return members
        } else
            return []
    }

    render() {
        // cc.log("Members State: ", this.state);
        // cc.log("Members Props: ", this.props);

        // const members = this.state.members ? this.state.members.filter(member => (member.username.startsWith(this.state.filter) || member.carID === parseInt(this.state.filter, 10))) : []
        const members = this.props.members ? this.props.members.filter(member => (member.username.startsWith(this.state.filter) || member.carID === parseInt(this.state.filter, 10))) : []

        // TESTING DIV FOCUS
        // if (members && members[4] && members[4].car) members[4].car.crowdsaleClosed = true
        // const divFocus = members.length > 0 ? members.find(member => { cc.log(member, member.car && !member.car.crowdsaleClosed); if (member.car && !member.car.crowdsaleClosed) return member }) : 1
        // divFocus && cc.log("div Focus: ", divFocus.carID, this[divFocus.carID]);
        // if (divFocus) setTimeout(() => {
        //     scrollToComponent(this[divFocus.carID], {
        //         offset: 1000,
        //         align: 'top',
        //         duration: 1500
        //     })
        // }, 1000);

        return (
            <div className="content-border">
                <div className="mainContentCon">
                    {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">
                        <i onClick={() => this.fetchMembers()} className="flaticon-rotate"></i>
                        <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                    </div> */}
                    <div className="navCon">
                        <h1 id="header"><div className="fl"><i className="flaticon-back" onClick={() => this.props.history.push("/", { module: "westland", path: "main" })}></i></div>Members<div className="fr"><i onClick={() => this.fetchMembers()} className="flaticon-rotate marIcon"></i><i onClick={() => this.props.history.push("/")} className="flaticon-home"></i></div></h1>
                    </div>
                    <div className="contentCon overflow bg-none">
                        <BlockUi tag="div" blocking={this.props.progress}>
                            <div className="membersCon">
                                {
                                    members && members.map((member, i) => {
                                        return this.renderMember(member, i)
                                    })
                                }
                            </div>
                            {/* <div className="contentBtn">
                            {this.props.addNewObjectTxID && (!this.state.eventAddNewObject ? <p style={{ color: "red" }}>pending</p> : <p style={{ color: "green" }}><i>Confirmed</i></p>)}
                            <input className="searchBtn" type="text" name="filterMembers" value={this.state.filter || ""} placeholder="Search" onChange={(e) => { cc.log("SEARCH: ", e.target.value); this.setState({ filter: e.target.value }) }} />
                        </div> */}

                        </BlockUi>
                    </div>
                    <div className="footCon">
                        <div>
                            {/*this.props.AddNewUser && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.AddNewUser}>{!this.state.eventAddNewUser ? <p style={{ color: "red" }}>pending</p> : <p style={{ color: "green" }}><i>Confirmed</i></p>} </Link>)*/}
                            <input className="searchBtn" type="text" name="filterMembers" value={this.state.filter || ""} placeholder="Search" onChange={(e) => { cc.log("SEARCH: ", e.target.value); this.setState({ filter: e.target.value }) }} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Members