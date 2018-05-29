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
        cc.log("Members Props", this.props);

        // let data = {
        //     module: "membersdev2",
        //     result: "member",
        //     findone: true,
        //     query: {
        //         _id: this.props.registered
        //     }
        // }
        // this.props._fetchContractData(this.props, data, this.props.account)

        // this.setState({ eventAddNewObject: this.props.eventAddNewObject === "pending" ? this.props.eventAddNewObject : null })
        // if (this.props.reloadTokens || this.props.members_new || this.props.AddNewUser) this.fetchMembers()
    }

    componentWillUnmount() {
        this.props._resetTxIds()
    }

    componentDidMount() {
        // if (!this.props.members) {
            this.fetchMembers()
        // }
    }

    fetchMembers = () => {
        const townSelected = this.props.towns[this.props.town]

        let data = {
            module: "membersobj",
            result: "members",
            query: {
                municipalityID: townSelected ? townSelected["municipalityID"] : ""
            },
            filter: {
                // _id: 0,
                // member: 1,
                // town: 1,
                // message: 1,
                // objectID: 1,
                // objectPic: 1,
                // objectPrice: 1,
                // profilePic: 1,
                // months: 1,
                // municipalityID: 1,
                // account: 1
            }
        }
        this.props._fetchContractData(this.props, data, this.props.account)
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps
        // cc.log("Members Update Props", nextProps);
        // if (this.props.members && ) this.props._reloadTokens()
        // if (this.props.reloadTokens) this.fetchMembers()
        // if (this.props.eventAddNewObject && this.props.objectID && this.props.newObject) {
        //     let objectID = this.props.objectID
        //     let newObject = this.props.newObject
        //     newObject.data["objectID"] = objectID
        //     this.props._writeNewContractData(newObject)
        // }
        // if (this.props.eventAddNewObject && !this.state.eventAddNewObject) this.setState({ eventAddNewObject: this.props.eventAddNewObject })

        if (this.props.members) {
            // let members = this.sortMembers()
            let members = this.props.members

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
            //     if (!member.obj) this.props._lcCars(member.objectID)
            //     if (!member.evTokens) this.props._evMyTokens(this.props.account, member.objectID)

            // })
            // if (!this.props.evTokens) this.props._reloadTokens()
        }

        // if (this.props.event && this.props.addNewObjectTxID && !this.props.hashConfirmations)
        //     this.props._getConfirmationsHash(this.props.addNewObjectTxID)

        // if (this.props.hashConfirmations && this.props.hashConfirmations > 0) {
        //     // clearInterval(this.confTimer)
        //     cc.log("HASH CONFIRMS: ", this.props.hashConfirmations);
        //     this.fetchMembers()
        // }

        // if (this.props.addNewObjectTxID || this.props.raiseFundsForCarTxID) this.fetchMembers()
    }

    // evTokenMyTokens = (objectID) => {
    //     this.props.evToken.myTokens(this.props.account, objectID)
    //         .then(result => {
    //             this.setState({ ["evToken_" + objectID]: result[0].toString() })
    //         })
    // }

    // fetchEvTokens = () => {
    //     for (let i = 1; i <= this.props.members.length; i++) {
    //         this.props._evMyTokens(this.props.account, i)
    //     }
    // }

    renderMember = (member, i) => {

        // console.log("member object", member)
        const user = this.props.usernames && this.props.usernames.find(userO => userO["_id"] === member["member"])
        // console.log("user ", user)
        const objectPrice = member.obj ? member.obj.objectPrice.toNumber() : "0"

        const img = member.objectPic ? { "display": "block" } : { "maxHeight": "50px", "maxWidth": "118px", height: "auto", width: "auto" }
        // if (this.props.account)
        // if (!(this.props.evTokens && this.props.evTokens[member.objectID]) || this.props.addNewObjectTxID || this.props.raiseFundsForCarTxID) this.props._evMyTokens(this.props.account, member.objectID)
        // this.evTokenMyTokens(member.objectID)
        // const selected = (this.props.member && !this.props.member.crowdsaleClosed) ? (this.props.member.username === member.username ? true : false) : false
        const selected = this.props.member && (this.props.member["_id"] === member["_id"]) ? true : false
        let memberRows = [
            <div className="mtableLink" ref={divRef => this[member.objectID] = divRef} key={i} onClick={() => user.authorized ? this.props._objectSelected(member, this.props.account, this.props.location.state.module) : cc.log("MEMBER NOT AUTHORIZED")}>
                {!user.authorized && <div className="membersBtn">
                    <button title="Authorize" className="arrowBtn" onClick={() => user.account !== this.props.account ? this.props._lcAddUser(user.account, this.props.account) : cc.log("MEMBER NOT AUTHORIZED, NO SELF AUTHORIZE")}>
                        <img src={require('../assets/add.jpg')} alt="addM" />
                    </button>
                </div>}
                <div className="mtableTokens">{member.crowdsaleClosed ? <span style={{ color: "green", fontSize: "12px" }}>Closed</span> : member.totalRaised || "0"} <p>{member.evTokens}</p></div>
                <div className="mtableUser"><span style={user.account === this.props.account ? { fontWeight: "bold" } : {}}>{user.username || ""}</span> <p>{user.town || ""}</p></div>
                {<div className="mtableCar"><img style={img} src={member.objectPic || user.profilePic || require('../assets/ninja.png')} alt="carImage" /><span title="Car Raised" style={{ fontSize: "12px" }}>Euro {objectPrice}</span></div>}
                {(this.props.newObject && this.props.newObject["member"] === member["_id"]) &&
                    (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newObject.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.newObject.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red", marginLeft: "0px", marginTop: "15px" }}>pending</p>}</Link>)}
            </div>
        ]

        if (selected && this.props.account) {
            cc.log("Member: ", member);

            memberRows.push(

                <div className="rowSelect" key={'invest-' + i}>
                    <div style={{ cursor: (member.objectID || user.authorized) ? "pointer" : "not-allowed" }} className="memberMesCon">{(member.objectID || user.authorized) ? user.message : "Not Allowed to Add New Life Configurator"}</div>
                    {member.objectID && <div className="memberMesBtns">
                        <div className="membersBtn">
                            <button className="arrowBtn" onClick={() => {
                                member.crowdsaleClosed ?
                                    (member.active ?
                                        this.props.history.push("/", { path: "invoices" })
                                        :
                                        // (member.account === this.props.account) ? this.props._lcActivateDeactivateObject(member.objectID, this.props.account) : cc.log("USER CAN ONLY ACTIVATE HIS OBJECT")
                                        (this.props._setEventAlert({
                                            title: "Please contact admin for ACTIVATION",
                                            message: ``,
                                            level: "error",
                                            position: "tr",
                                            autoDismiss: 3
                                        }))
                                    )
                                    :
                                    (user.authorized ?
                                        this.props.history.push("/", { path: "invest" })
                                        :
                                        cc.log("NO OBJECT CONFIGURED")
                                    )
                            }}>
                                <img src={require('../assets/arrow.jpg')} alt="addM" />
                            </button>
                            {/*<button title="Invoices (testing)" className="arrowBtn" onClick={() => { member.authorized ? this.props.history.push("/", { path: "invoices" }) : cc.log("NO OBJECT CONFIGURED") }}>
                                <img src={require('../assets/add.jpg')} alt="addI" />
                        </button>*/}
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
                cc.log("Checking A: ", a.obj && a.obj.crowdsaleClosed, parseFloat(a.totalRaised), "----", "Checking B: ", b.obj && b.obj.crowdsaleClosed, parseFloat(b.totalRaised))
                if (a.obj && a.obj.crowdsaleClosed)
                    return 0
                else if (a.totalRaised && b.totalRaised) {
                    // cc.log(`Car Raised-${b.objectID}=> ${b.totalRaised} - Car Raised-${a.objectID}=> ${a.totalRaised}`);
                    return b.totalRaised - a.totalRaised
                } else
                    return 0
            })
            cc.log("$$$$$$$$$ sorted members: $$$$$$$$$$$$$", members);
            return members
        } else
            return []
    }

    render() {
        cc.log("Members State: ", this.state);
        cc.log("Members Props: ", this.props);

        // const members = this.state.members ? this.state.members.filter(member => (member.username.startsWith(this.state.filter) || member.objectID === parseInt(this.state.filter, 10))) : []
        // const members = this.props.members ? this.props.members.filter(member => ((member.username && member.username.startsWith(this.state.filter)) || member.objectID === parseInt(this.state.filter, 10))) : []

        const members = this.props.members || []

        // console.log("Members: ", members);

        // TESTING DIV FOCUS
        // if (members && members[4] && members[4].car) members[4].car.crowdsaleClosed = true
        // const divFocus = members.length > 0 ? members.find(member => { cc.log(member, member.obj && !member.obj.crowdsaleClosed); if (member.obj && !member.obj.crowdsaleClosed) return member }) : 1
        // divFocus && cc.log("div Focus: ", divFocus.objectID, this[divFocus.objectID]);
        // if (divFocus) setTimeout(() => {
        //     scrollToComponent(this[divFocus.objectID], {
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
                    <div hidden className="navCon">
                        <h1 id="header"><div className="fl"><i className="flaticon-back" onClick={() => this.props.history.push("/", { path: "main" })}></i></div>Members<div className="fr"><i onClick={() => this.fetchMembers()} className="flaticon-rotate marIcon"></i><i onClick={() => this.props.history.push("/")} className="flaticon-home"></i></div></h1>
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
                            <span>Ga duurzaam</span>
                            <button className="arrowBtn" onClick={() => this.props.history.push("/", { path: "addnewlife" })}>
                                <img src={require('../assets/arrow.jpg')} alt="addM" />
                            </button>
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