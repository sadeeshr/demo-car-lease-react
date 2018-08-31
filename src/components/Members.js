import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { Link } from 'react-router-dom'
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'
import Invest from '../containers/Invest';
import Invoices from '../containers/Invoices';

// import { pseudoRandomBytes } from 'crypto';

class Members extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // filter: '',
            // progress: true,
            modalCondition: false,
            activeIndex: null,
        }
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
    }

    modalClick() {
        this.setState({
            modalCondition: !this.state.modalCondition
        });
    }

    componentWillMount() {
        cc.log("Members Props", this.props, this.state);
        // this.props._fetchUsers(this.props, this.props.account)
        // if (!this.props.unClaimedRedemption && this.props.account) this.props._lcToClaimTotal(this.props.account) // change
        if (!this.props.euroTokenBalance && this.props.account) this.props._euroBalanceOf(this.props.account)
        // if (!this.state.members) this.setState({ progress: true }) 
        if (!this.state.members && this.props.members) this.setState({ members: this.props.members })
        // let data = {
        //     module: "membersdev3",
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
        // this.setState({ members: undefined, usernames: undefined })
        this.props._resetTxIds()
    }

    componentDidMount() {
        if (!this.props.members) {
            // console.log("Y u call me !!!")
            this.setState({ progress: true }, () => this.fetchMembers())
        }
    }

    fetchMembers = () => {
        // const townSelected = this.props.towns[this.props.town]
        // console.log("how many times call me !!!");
        let data = {
            module: "crowdfundobj",
            result: "members",
            query: {
                // municipalityID: townSelected ? townSelected["municipalityID"] : ""
                municipalityID: "1"
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
        let refreshEvents = ["BoughtNewObject", "NewObject", "CreateNewUser", "AddNewObject", "NewMember", "NewCrowdFundToken"]
        if (nextProps.newLeaseTokenAddress && (this.props.newLeaseTokenAddress !== nextProps.newLeaseTokenAddress)) {
            // let data = {
            //     module: "crowdfundobj",
            //     result: "members",
            //     data: this.props.newLifeObj
            // }
            // data["data"]["leaseTokenAddress"] = nextProps.newLeaseTokenAddress
            // cc.log(data)
            // // this.props._updateContractData(this.props, data)
            // this.props._writeNewContractData(this.props, data)


            let data = {
                module: "crowdfundobj",
                result: "members",
                query: { "_id": this.props.members_new["_id"] },
                data: {
                    leaseTokenAddress: nextProps.newLeaseTokenAddress
                }
            }
            cc.log(data)
            this.props._updateContractData(this.props, data)

        }

        if ((nextProps.AddNewUser && (nextProps.AddNewUser !== this.props.AddNewUser)) || (nextProps.newObject && (nextProps.newObject !== this.props.newObject)) || (nextProps.newCrowdFundToken && (nextProps.newCrowdFundToken !== this.props.newCrowdFundToken))) {
            this.setState({ pending: true })
        }

        if (
            nextProps.event && (nextProps.event !== this.props.event) &&
            (
                (nextProps.AddNewUser && (nextProps.event.transactionHash === nextProps.AddNewUser.txID))
                || (nextProps.newObject && (nextProps.event.transactionHash === nextProps.newObject.txID))
                || (nextProps.newCrowdFundToken && (nextProps.event.transactionHash === nextProps.newCrowdFundToken.txID))
                || (refreshEvents.indexOf(nextProps.event.event) !== -1)
            )
        ) {
            this.setState({ pending: false }, () => {
                // setTimeout(() => {
                this.fetchMembers()
                // }, 1000);
            })
            if (this.props.account) this.props._euroBalanceOf(this.props.account)
            // if (this.props.account) this.props._lcToClaimTotal(this.props.account) // change

        }

        // if (nextProps.event && (nextProps.event !== this.props.event) && (nextProps.event.event === "InvestInObject")) {
        //     const objectID = nextProps.event.returnValues.objectID
        //     this.props._crowdFundData(objectID, "integer", "objectprice")
        //     this.props._crowdFundData(objectID, "integer", "raised")
        //     this.props._crowdFundData(objectID, "bool", "crowdsaleclosed")
        //     // this.props._crowdFundData(objectID, "bool", "objectActive")
        //     // this.props._crowdFundData(objectID, "bool", "claimedcrowdsale")
        // }

        if (
            nextProps.event && (nextProps.event !== this.props.event) &&
            (
                (nextProps.AddNewUser && (nextProps.event.transactionHash === nextProps.AddNewUser.txID))
                // || (nextProps.newObject && (nextProps.event.transactionHash === nextProps.newObject.txID))
                || (nextProps.newCrowdFundToken && (nextProps.event.transactionHash === nextProps.newCrowdFundToken.txID))
            )
        ) {
            setTimeout(() => {
                this.props._resetTxIds()
            }, 5000);
        }

        if (!nextProps.registered)
            this.checkRegistered()


        // if (nextProps.members_edit || nextProps.usernames_new) this.fetchMembers()

        // cc.log("Members Update Props", nextProps.members, this.state.members);
        // if (this.props.members && ) this.props._reloadTokens()
        // if (this.props.reloadTokens) this.fetchMembers()
        // if (this.props.eventAddNewObject && this.props.objectID && this.props.newObject) {
        //     let objectID = this.props.objectID
        //     let newObject = this.props.newObject
        //     newObject.data["objectID"] = objectID
        //     this.props._writeNewContractData(newObject)
        // }
        // if (this.props.eventAddNewObject && !this.state.eventAddNewObject) this.setState({ eventAddNewObject: this.props.eventAddNewObject })

        if (nextProps.members && nextProps.members !== this.state.members) {
            // let members = this.sortMembers()
            let members = nextProps.members
            let usernames = nextProps.usernames

            // cc.log("######## SORTED MEMBERS ###########", members);
            // if (members.length >= 3) { progress: true
            // members[0].car ? members[0].car.crowdsaleClosed = true : ""
            // members[1].car ? members[1].car.crowdsaleClosed = true : ""
            //     // members[2].car ? members[2].car.crowdsaleClosed = true : ""
            // }

            this.setState({ members, usernames }, () => setTimeout(() => this.setState({ progress: false }), 3500))
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

        this.props = nextProps

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


    // createObject = (id) => {
    //     let leaseobject = this.props.newLifeObj
    // }

    checkRegistered = () => {
        // console.log("REG check: ", account, this.props);
        if (this.props.usernames) {

            const member = this.props.usernames ? this.props.usernames.find(user => user.account === this.props.account) : null

            if (member) {
                this.props._setObject({ registered: member["_id"] })
            } else
                cc.log("USER NOT REGISTERED YET")
        }
    }

    renderMember = (userObject, i, hide) => {

        // cc.log("member object: ", userObject)

        // const userObjects = this.props.members && this.props.members.filter(userO => userO["member"] === member["_id"])
        const member = this.props.usernames && this.props.usernames.find(member => member["_id"] === userObject["member"])
        const textStyle = "fw-800 " + ((this.props.textStyle && this.props.textStyle.id === userObject["_id"] && this.props.textStyle.color) || "color-black")

        // console.log("UO", userObject, userObject.objectPrice);
        // const objectPrice = userObject.obj ? userObject.obj.objectPrice.toNumber() : "0"
        const objectPrice = parseInt(userObject.objectPrice, 10) || 0
        const img = userObject.objectPic ? { "display": "block" } : { "maxHeight": "50px", "maxWidth": "118px", height: "auto", width: "auto" }
        const selected = this.props.member && (this.props.member["_id"] === userObject["_id"]) ? true : false
        // const selected = true
        let memberRows = [
            <div className="mtableLink" key={i} onClick={() => this.setState({ activeIndex: this.state.activeIndex === i ? null : i }, () => { (this.props.newObject && (this.props.addNewObjectTxID === this.props.newObject.txID) && this.props._resetTxIds()); return member.authorized ? this.props._objectSelected(userObject, this.props.account) : cc.log("MEMBER NOT AUTHORIZED") })}>
                <div className="col-5">
                    <div className="mtableUser">
                        <span className="fs-20" style={member.account === this.props.account ? { fontWeight: "bold" } : {}}>{userObject.objectName || ""}</span>
                        <p>{member.town || ""}</p>
                        <div className="mtableTokens">
                            {userObject.crowdsaleclosed ?
                                <span style={{ color: "green", fontSize: "15px", }}>{userObject.objectActive ? "Active" : "Closed"}</span> : <span><span className={textStyle}>{userObject.raised || 0}</span> Euro opgehaald </span>}
                        </div>
                        {/*!member.authorized && <div className="membersBtn arrowHover-s2">
                            <button title="Authorize" className="arrowBtn" onClick={() => member.account !== this.props.account ? this.props._lcAddUser(member.account, this.props.account) : cc.log("MEMBER NOT AUTHORIZED, NO SELF AUTHORIZE")}>
                                <span className="flaticon-padlock-1 unlock"></span>
                            </button>
                            </div>*/}
                    </div>
                </div>
                <div className="col-7">

                    {<div className="mtableCar" style={{ backgroundImage: `url(${userObject.objectPic || member.profilePic || require('../assets/anonymous.png')})` }}>
                        {/* <img style={img} src={userObject.objectPic || member.profilePic || require('../assets/anonymous.png')} alt="carImage" /> */}
                    </div>}
                    {/*this.props.newObject  && this.props.newObject["id"] === userObject["_id"] && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newObject.txID}>{this.state.pending ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px", textAlign: "center", fontWeight: "600" }}>Confirmed</p> : <p className="p-euro" style={{ color: "#FF9800", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Pending</p>}</Link>)*/}
                    {(this.props.newObject && this.props.addNewObjectID === userObject["objectID"]) &&
                        (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newObject.txID}>{((this.props.addNewObjectTxID === this.props.newObject.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px", textAlign: "center", fontWeight: "600" }}>Confirmed</p> : <p className="p-euro" style={{ color: "#FF9800", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Pending</p>}</Link>)}
                    {(this.props.newCrowdFundToken && this.props.newCrowdFundToken["hash"] === userObject["objectHash"]) &&
                        (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newCrowdFundToken.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.newCrowdFundToken.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Confirmed</p> : <p className="p-euro" style={{ color: "#FF9800", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Pending</p>}</Link>)}
                </div>

                <div className="col-7">
                    <p className="fs-13" style={{ marginTop: '5px' }}>{userObject.evTokens ? <span>waarvan <span className={textStyle}>{userObject.evTokens}</span> door mij</span> : "-"}</p>
                </div>
                <div className="col-5">
                    <span title="Car Raised" className="carRaised tar fs-13">
                        <strong>Target:</strong>
                        <span className="">  {objectPrice} </span>
                        EUR
                    </span>
                </div>

            </div>
        ]

        if (selected && this.props.account && this.props.registered && !hide) {
            // cc.log("Member Object: ", userObject, member.account, this.props.account);
            // cc.log("---------------------------------------------------------------------------")
            // cc.log("CHECK 1 (crowdsale closed and user object not active and not owner address): ", (userObject.crowdsaleclosed && !userObject.objectActive && (member.account !== this.props.account)) || "false");
            // cc.log("CHECK 2 (object hash and no lease token address and not owner address): ", (userObject.objectHash && !userObject.leaseTokenAddress && (member.account !== this.props.account)) || "false");
            // cc.log("CHECK 3 (lease token address and no object ID and not owner address): ", (userObject.leaseTokenAddress && !userObject.objectID && (member.account !== this.props.account)) || "false");
            // cc.log("CHECK 4 (object hash and no lease token address and no object ID): ", (userObject.objectHash && !userObject.leaseTokenAddress && !userObject.objectID) || "false");
            // cc.log("CHECK 5 (pending status in state due to awaiting transaction confirmation event): ", this.state.pending || "false");

            const disableDownButton = (userObject.crowdsaleclosed && !userObject.objectActive && (member.account !== this.props.account)) || (userObject.objectHash && !userObject.leaseTokenAddress && (member.account !== this.props.account)) || (userObject.leaseTokenAddress && !userObject.objectID && (member.account !== this.props.account)) || (userObject.objectHash && !userObject.leaseTokenAddress && !userObject.objectID) || this.state.pending
            // cc.log("Disable button: ", disableDownButton || "false");
            memberRows.push(

                <div className="rowSelect mb-5" key={'invest-' + i}>


                    {/*<div style={{ cursor: (userObject.objectID || member.authorized) ? "pointer" : "not-allowed" }} className="memberMesCon">{member.message}</div>*/}
                    {(userObject.objectID || userObject.leaseTokenAddress || userObject.objectHash) && <div className="col-12">   {/*memberMesBtns*/}
                        {
                            !disableDownButton &&
                                userObject.crowdsaleclosed ?
                                userObject.objectActive ?
                                    <Invoices />
                                    :
                                    (member.account === this.props.account) ?
                                        <Invest />
                                        : cc.log("MEMBER CAN ONLY BUY AND ACTIVATE HIS OBJECT")
                                :
                                (member.authorized) ?
                                    <Invest />
                                    :
                                    cc.log("NO OBJECT CONFIGURED")
                        }
                    </div>}
                </div>
            )
        }

        return <div key={i} className={this.state.activeIndex === i ? 'leaseCarCon ph-5 active' : 'leaseCarCon ph-5'} onClick={() => { }}>{memberRows}</div>
    }

    sortMembers = () => {
        if (this.props.members) {
            const members = this.props.members.sort((a, b) => {
                cc.log("Checking A: ", a.obj && a.obj.crowdsaleclosed, parseFloat(a.raised), "----", "Checking B: ", b.obj && b.obj.crowdsaleclosed, parseFloat(b.raised))
                if (a.obj && a.obj.crowdsaleclosed)
                    return 0
                else if (a.raised && b.raised) {
                    // cc.log(`Car Raised-${b.objectID}=> ${b.raised} - Car Raised-${a.objectID}=> ${a.raised}`);
                    return b.raised - a.raised
                } else
                    return 0
            })
            cc.log("$$$$$$$$$ sorted members: $$$$$$$$$$$$$", members);
            return members
        } else
            return []
    }

    render() {
        // cc.log("Members State: ", this.state);
        // cc.log("Members Props: ", this.props);

        // const members = this.state.members ? this.state.members.filter(member => (member.username.startsWith(this.state.filter) || member.objectID === parseInt(this.state.filter, 10))) : []
        // const members = this.props.members ? this.props.members.filter(member => ((member.username && member.username.startsWith(this.state.filter)) || member.objectID === parseInt(this.state.filter, 10))) : []


        // const memberObjs = this.props.members || []
        const memberObjs = this.state.members || []
        // const members = this.props.usernames || []
        // const members = this.props.usernames ? this.props.filter ? this.props.usernames.filter(user => ((user.username && user.username.toLowerCase().startsWith(this.props.filter && this.props.filter.toLowerCase())))) : this.props.usernames : []
        // console.log("Members: ", members);
        let investObjs = []
        let invoiceObjs = []
        let buyObjs = []
        let expiredObjs = []

        memberObjs && memberObjs.forEach(mobj => mobj.crowdsaleclosed ? mobj.objectActive ? invoiceObjs.push(mobj) : buyObjs.push(mobj) : (mobj.biddingtime > Math.round((new Date()).getTime() / 1000)) ? investObjs.push(mobj) : mobj.biddingtime && !mobj.claimedcrowdsale && expiredObjs.push(mobj))

        const authMembers = this.state.usernames ? this.state.usernames.filter(user => user.authorized) : []
        const nauthMembers = this.state.usernames ? this.state.usernames.filter(user => !user.authorized) : []
        const selfAuth = this.state.usernames ? this.state.usernames.some(user => (user.account === this.props.account) && user.authorized) : false
        const header = {
            color: "white",
            backgroundColor: "black",
            padding: "5px 5px",
            fontSize: "14px",
            borderRadius: "5px",
            // borderBottom: "1px solid #ffffff"
        }

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
            <div className="content-border mobile-margin">
                <div className="border-bottom-1  fix-small-dev">
                    <div className="container">
                        <span className="lh-40">MIJN SALDO: <strong className="fs-20">{formatNumber(parseInt(((this.props.euroTokenBalance || 0) + (this.props.unClaimedRedemption || 0)), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}</strong> Euro</span>
                        <span className="fr pt-8"><img className="infoImg" src={require('../assets/deal.png')} alt="deal" /></span>
                    </div>
                </div>
                <div className="mainContentCon mainContentCon-43">
                    {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">
                        <i onClick={() => this.fetchMembers()} className="flaticon-rotate"></i>
                        <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                    </div> 
                    <div hidden className="navCon">
                        <h1 id="header"><div className="fl"><i className="flaticon-back" onClick={() => this.props.history.push("/", { path: "main" })}></i></div>Members<div className="fr"><i onClick={() => this.fetchMembers()} className="flaticon-rotate marIcon"></i><i onClick={() => this.props.history.push("/")} className="flaticon-home"></i></div></h1>
                    </div>*/}
                    <div className="contentCon overflow bg-none contentCon-8 pt-8">
                        <BlockUi tag="div" blocking={this.state.progress} renderChildren={false}>
                            <div className="membersCon pb-20 pt-5-mobile pv-5-mobile">

                                <div >
                                    <div style={header}>Investeer</div>
                                    <div className="accordionContent">
                                        {investObjs && investObjs.sort((a, b) => parseFloat(b.objectID) - parseFloat(a.objectID)).map((mObj, i) => this.renderMember(mObj, i))}
                                    </div>
                                </div>

                                <div >
                                    <div style={header}>Betaal rekening (Invoice)</div>
                                    <div className="accordionContent">
                                        {invoiceObjs && invoiceObjs.sort((a, b) => parseFloat(b.objectID) - parseFloat(a.objectID)).map((mObj, i) => this.renderMember(mObj, i))}
                                    </div>
                                </div>

                                <div >
                                    <div style={header}>Aanschaf duurzaam item (buy)</div>
                                    <div className="accordionContent">
                                        {buyObjs && buyObjs.sort((a, b) => parseFloat(b.objectID) - parseFloat(a.objectID)).map((mObj, i) => this.renderMember(mObj, i))}
                                    </div>
                                </div>

                                <div >
                                    <div style={header}>Menigte-verkoop is verlopen</div>
                                    <div className="accordionContent">
                                        {expiredObjs && expiredObjs.sort((a, b) => parseFloat(b.objectID) - parseFloat(a.objectID)).map((mObj, i) => this.renderMember(mObj, i, true))}
                                    </div>
                                </div>

                                <div>
                                    <div style={header}>Leden (members)</div>
                                    <div className="accordionContent">
                                        {
                                            authMembers && authMembers.reverse().map((member, i) => {
                                                return <div className="leaseCarCon" key={i}>
                                                    <div className="mtableLink">
                                                        <div className="col-5">
                                                            <div className="mtableUser">
                                                                <span className="fs-20 fw-700" style={member.account === this.props.account ? { fontWeight: "bold" } : {}}>{member.username || ""}</span>
                                                                <p>{member.town || ""}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-7">
                                                            <div className="mtableCar" style={{ backgroundImage: `url(${member.profilePic || require('../assets/anonymous.png')})` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>

                                <div>
                                    <div style={header}>Autoriseer nieuwe leden</div>
                                    <div className="accordionContent">
                                        {
                                            nauthMembers && nauthMembers.reverse().map((member, i) => {
                                                return <div className="leaseCarCon" key={i}>
                                                    <div className="mtableLink" onClick={() => member.authorized ? cc.log("MEMBER AUTHORIZED, NO OBJECTS") : cc.log("MEMBER NOT AUTHORIZED")}>
                                                        <div className="col-5">
                                                            <div className="mtableUser">
                                                                <span className="fs-20 fw-700" style={member.account === this.props.account ? { fontWeight: "bold" } : {}}>{member.username || ""}</span>
                                                                <p>{member.town || ""}</p>
                                                                {!member.authorized && selfAuth && <div className="membersBtn arrowHover-s2">
                                                                    <button title="Authorize" className="arrowBtn" onClick={() => member.account !== this.props.account ? this.props._lcAddUser(member.account, this.props.account) : cc.log("MEMBER NOT AUTHORIZED, NO SELF AUTHORIZE")}>
                                                                        <span className="flaticon-padlock-1 unlock"></span>
                                                                    </button>
                                                                </div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-7">
                                                            <div className="mtableCar" style={{ backgroundImage: `url(${member.profilePic || require('../assets/anonymous.png')})` }}>
                                                                {/* <img style={{ "maxHeight": "50px", "maxWidth": "118px", height: "auto", width: "auto" }} src={member.profilePic || require('../assets/anonymous.png')} alt="carImage" /> */}
                                                            </div>
                                                            {(this.props.AddNewUser && this.props.AddNewUser["account"] === member["account"]) &&
                                                                (<Link target="_blank" to={this.rinkebyStatsURL + this.props.AddNewUser.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.AddNewUser.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Confirmed</p> : <p className="p-euro" style={{ color: "#FF9800", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Pending</p>}</Link>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>

                            </div>
                            {/* <div className="contentBtn">
                            {this.props.addNewObjectTxID && (!this.state.eventAddNewObject ? <p style={{ color: "red" }}>pending</p> : <p style={{ color: "green" }}><i>Confirmed</i></p>)}
                            <input className="searchBtn" type="text" name="filterMembers" value={this.state.filter || ""} placeholder="Search" onChange={(e) => { cc.log("SEARCH: ", e.target.value); this.setState({ filter: e.target.value }) }} />
                        </div> */}

                        </BlockUi>
                    </div>
                    <div className={this.state.modalCondition ? "infoPop is-open" : "infoPop is-close"} >
                        <span className="modalCloseBtn" onClick={() => this.modalClick()}>x</span>
                        Vandaag 20 euro,
                        morgen 19.99,
                        overmorgen 19.98,
                        over 3 jaar 10
                        ...of 1 euro per uur
                    </div>
                </div>
                <div className="footBtn">
                    <div className="container text-center">
                        <div className="beforeFooter">
                            <div className="col-4 arrowHover-s2">
                                <button className="arrowBtn" onClick={() => this.props.history.push("/", { path: "addnewlife" })}>
                                    <span className="flaticon-right-arrow"></span>
                                </button>
                            </div>
                            <div className="col-4 pt-30 text-left">
                                Ga duurzaam

                                {/* <span>Ga duurzaam</span> */}
                                {/*this.props.AddNewUser && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.AddNewUser}>{!this.state.eventAddNewUser ? <p style={{ color: "red" }}>pending</p> : <p style={{ color: "green" }}><i>Confirmed</i></p>} </Link>)*/}
                            </div>
                            <div className="col-4 text-left padding-10-0">

                                <div className="text-right" style={{ float: 'right' }}>
                                    <span onClick={() => this.modalClick()}>
                                        <img className="infoImg" src={require('../assets/info.png')} alt="info" />
                                    </span>
                                </div>
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
                            <span className="smallText">CONTACT</span>
                        </div>
                    </div>
                </div>
                <div className={this.state.modalCondition ? "modalOverlay is-open" : "modalOverlay is-close"} onClick={() => this.modalClick()}></div>
            </div>
        )
    }
}

export default Members

// OldrenderMember = (member, i) => {

//     // console.log("member object", member)
//     const user = this.props.usernames && this.props.usernames.find(userO => userO["_id"] === member["member"])
//     // console.log("user ", user)
//     const objectPrice = member.obj ? member.obj.objectPrice.toNumber() : "0"

//     const img = member.objectPic ? { "display": "block" } : { "maxHeight": "50px", "maxWidth": "118px", height: "auto", width: "auto" }
//     // if (this.props.account)
//     // if (!(this.props.evTokens && this.props.evTokens[member.objectID]) || this.props.addNewObjectTxID || this.props.raiseFundsForCarTxID) this.props._evMyTokens(this.props.account, member.objectID)
//     // this.evTokenMyTokens(member.objectID)
//     // const selected = (this.props.member && !this.props.member.crowdsaleClosed) ? (this.props.member.username === member.username ? true : false) : false
//     const selected = this.props.member && (this.props.member["_id"] === member["_id"]) ? true : false
//     let memberRows = [
//         <div className="mtableLink" ref={divRef => this[member.objectID] = divRef} key={i} onClick={() => user.authorized ? this.props._objectSelected(member, this.props.account, this.props.location.state.module) : cc.log("MEMBER NOT AUTHORIZED")}>
//             {!user.authorized && <div className="membersBtn">
//                 <button title="Authorize" className="arrowBtn" onClick={() => user.account !== this.props.account ? this.props._lcAddUser(user.account, this.props.account) : cc.log("MEMBER NOT AUTHORIZED, NO SELF AUTHORIZE")}>
//                     <img src={require('../assets/add.jpg')} alt="addM" />
//                 </button>
//             </div>}
//             <div className="mtableTokens">{member.crowdsaleClosed ? <span style={{ color: "green", fontSize: "12px" }}>Closed</span> : member.raised || "0"} <p>{member.evTokens}</p></div>
//             <div className="mtableUser"><span style={user.account === this.props.account ? { fontWeight: "bold" } : {}}>{user.username || ""}</span> <p>{user.town || ""}</p></div>
//             {<div className="mtableCar"><img style={img} src={member.objectPic || user.profilePic || require('../assets/anonymous.png')} alt="carImage" /><span title="Car Raised" style={{ fontSize: "12px" }}>Euro {objectPrice}</span></div>}
//             {(this.props.newObject && this.props.newObject["id"] === member["_id"]) &&
//                 (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newObject.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.newObject.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red", marginLeft: "0px", marginTop: "15px" }}>pending</p>}</Link>)}
//             {(this.props.newCrowdFundToken && this.props.newCrowdFundToken["hash"] === member["objectHash"]) &&
//                 (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newCrowdFundToken.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.newCrowdFundToken.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red", marginLeft: "0px", marginTop: "15px" }}>pending</p>}</Link>)}
//         </div>
//     ]

//     if (selected && this.props.account) {
//         cc.log("Member: ", member);

//         memberRows.push(

//             <div className="rowSelect" key={'invest-' + i}>
//                 <div style={{ cursor: (member.objectID || user.authorized) ? "pointer" : "not-allowed" }} className="memberMesCon">{(member.objectID || user.authorized) ? user.message : "Not Allowed to Add New Life Configurator"}</div>
//                 {(member.objectID || member.leaseTokenAddress) && <div className="memberMesBtns">
//                     <div className="membersBtn">
//                         <button className="arrowBtn" onClick={() => {
//                             member.crowdsaleClosed ?
//                                 (member.active ?
//                                     this.props.history.push("/", { path: "invoices" })
//                                     :
//                                     // (member.account === this.props.account) ? this.props._lcActivateDeactivateObject(member.objectID, this.props.account) : cc.log("USER CAN ONLY ACTIVATE HIS OBJECT")
//                                     (this.props._setEventAlert({
//                                         title: "Please contact admin for ACTIVATION",
//                                         message: ``,
//                                         level: "error",
//                                         position: "tr",
//                                         autoDismiss: 3
//                                     }))
//                                 )
//                                 :
//                                 (
//                                     (member.leaseTokenAddress && !member.objectID) ?
//                                         this.props._lcCreateObject(this.props, member["_id"], member.months, member.municipalityID, member.objectPrice, member.objectHash, member.leaseTokenAddress, member.objectDealer, (parseFloat(member.objectMonthlyCapitalCost) * 100).toFixed(2), (parseFloat(member.objectMonthlyOperatingCost) * 100).toFixed(2), this.props.account)
//                                         :
//                                         (user.authorized) ?
//                                             this.props.history.push("/", { path: "invest" })
//                                             :
//                                             cc.log("NO OBJECT CONFIGURED")
//                                 )
//                         }}>
//                             <img src={require('../assets/arrow.jpg')} alt="addM" />
//                         </button>
//                         {/*<button title="Invoices (testing)" className="arrowBtn" onClick={() => { member.authorized ? this.props.history.push("/", { path: "invoices" }) : cc.log("NO OBJECT CONFIGURED") }}>
//                             <img src={require('../assets/add.jpg')} alt="addI" />
//                     </button>*/}
//                     </div>
//                 </div>}
//             </div>
//         )
//     }

//     return <div className="leaseCarCon" key={i}>{memberRows}</div>
// }

// oldRenderMember = (member, i) => {

//     // cc.log("member object: ", member)

//     const userObjects = this.props.members && this.props.members.filter(userO => userO["member"] === member["_id"])
//     // console.log("userObjects: ", userObjects);

//     if (!Array.isArray(userObjects) || !userObjects.length) {
//         return <div className="leaseCarCon" key={i}>
//             <div className="mtableLink" onClick={() => member.authorized ? cc.log("MEMBER AUTHORIZED, NO OBJECTS") : cc.log("MEMBER NOT AUTHORIZED")}>
//                 <div className="col-5">
//                     <div className="mtableUser">
//                         <span className="fs-20 fw-700" style={member.account === this.props.account ? { fontWeight: "bold" } : {}}>{member.username || ""}</span>
//                         <p>{member.town || ""}</p>
//                         {!member.authorized && <div className="membersBtn">
//                             <button title="Authorize" className="arrowBtn" onClick={() => member.account !== this.props.account ? this.props._lcAddUser(member.account, this.props.account) : cc.log("MEMBER NOT AUTHORIZED, NO SELF AUTHORIZE")}>
//                                 <span className="flaticon-padlock-1 unlock unlock-m"></span>
//                             </button>
//                         </div>}
//                     </div>
//                 </div>
//                 <div className="col-7">
//                     <div className="mtableCar" style={{ backgroundImage: `url(${member.profilePic || require('../assets/anonymous.png')})` }}>
//                         {/* <img style={{ "maxHeight": "50px", "maxWidth": "118px", height: "auto", width: "auto" }} src={member.profilePic || require('../assets/anonymous.png')} alt="carImage" /> */}
//                     </div>
//                     {(this.props.AddNewUser && this.props.AddNewUser["account"] === member["account"]) &&
//                         (<Link target="_blank" to={this.rinkebyStatsURL + this.props.AddNewUser.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.AddNewUser.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Confirmed</p> : <p className="p-euro" style={{ color: "#FF9800", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Pending</p>}</Link>)}
//                 </div>
//             </div>
//         </div>
//     } else {
//         return userObjects.map((userObject, j) => {
//             // console.log("UO", userObject, userObject.objectPrice);
//             // const objectPrice = userObject.obj ? userObject.obj.objectPrice.toNumber() : "0"
//             const objectPrice = parseInt(userObject.objectPrice, 10) || 0
//             const img = userObject.objectPic ? { "display": "block" } : { "maxHeight": "50px", "maxWidth": "118px", height: "auto", width: "auto" }
//             const selected = this.props.member && (this.props.member["_id"] === userObject["_id"]) ? true : false
//             // const selected = true
//             let memberRows = [
//                 <div className="mtableLink" key={j} onClick={() => member.authorized ? this.props._objectSelected(userObject, this.props.account) : cc.log("MEMBER NOT AUTHORIZED")}>
//                     <div className="col-5">
//                         <div className="mtableUser">
//                             <span className="fs-20 fw-700" style={member.account === this.props.account ? { fontWeight: "bold" } : {}}>{member.username || ""}</span>
//                             <p>{member.town || ""}</p>
//                             <div className="mtableTokens">
//                                 {userObject.crowdsaleclosed ?
//                                     <span style={{ color: "green", fontSize: "15px", }}>{userObject.objectActive ? "Active" : "Closed"}</span> : userObject.raised ? "E " + userObject.raised + " Totaal" : "E 0 Totaal"}
//                                 <p>{userObject.evTokens ? "E " + userObject.evTokens + " Van mij" : "-"}</p>
//                             </div>
//                             {!member.authorized && <div className="membersBtn">
//                                 <button title="Authorize" className="arrowBtn" onClick={() => member.account !== this.props.account ? this.props._lcAddUser(member.account, this.props.account) : cc.log("MEMBER NOT AUTHORIZED, NO SELF AUTHORIZE")}>
//                                     <span className="flaticon-padlock-1 unlock unlock-m"></span>
//                                 </button>
//                             </div>}
//                         </div>
//                     </div>
//                     <div className="col-7">

//                         {<div className="mtableCar" style={{ backgroundImage: `url(${userObject.objectPic || member.profilePic || require('../assets/anonymous.png')})` }}>
//                             {/* <img style={img} src={userObject.objectPic || member.profilePic || require('../assets/anonymous.png')} alt="carImage" /> */}
//                         </div>}
//                         <span title="Car Raised" className="carRaised">Euro {objectPrice}</span>

//                         {(this.props.newObject && this.props.newObject["id"] === userObject["_id"]) &&
//                             (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newObject.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.newObject.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px", textAlign: "center", fontWeight: "600" }}>Confirmed</p> : <p className="p-euro" style={{ color: "#FF9800", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Pending</p>}</Link>)}
//                         {(this.props.newCrowdFundToken && this.props.newCrowdFundToken["hash"] === userObject["objectHash"]) &&
//                             (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newCrowdFundToken.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.newCrowdFundToken.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Confirmed</p> : <p className="p-euro" style={{ color: "#FF9800", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Pending</p>}</Link>)}
//                     </div>
//                 </div>
//             ]

//             if (selected && this.props.account && this.props.registered) {
//                 cc.log("Member Object: ", userObject, member.account, this.props.account);
//                 cc.log("---------------------------------------------------------------------------")
//                 cc.log("CHECK 1 (crowdsale closed and user object not active and not owner address): ", (userObject.crowdsaleclosed && !userObject.objectActive && (member.account !== this.props.account)) || "false");
//                 cc.log("CHECK 2 (object hash and no lease token address and not owner address): ", (userObject.objectHash && !userObject.leaseTokenAddress && (member.account !== this.props.account)) || "false");
//                 cc.log("CHECK 3 (lease token address and no object ID and not owner address): ", (userObject.leaseTokenAddress && !userObject.objectID && (member.account !== this.props.account)) || "false");
//                 cc.log("CHECK 4 (object hash and no lease token address and no object ID): ", (userObject.objectHash && !userObject.leaseTokenAddress && !userObject.objectID) || "false");
//                 cc.log("CHECK 5 (pending status in state due to awaiting transaction confirmation event): ", this.state.pending || "false");

//                 const disableDownButton = (userObject.crowdsaleclosed && !userObject.objectActive && (member.account !== this.props.account)) || (userObject.objectHash && !userObject.leaseTokenAddress && (member.account !== this.props.account)) || (userObject.leaseTokenAddress && !userObject.objectID && (member.account !== this.props.account)) || (userObject.objectHash && !userObject.leaseTokenAddress && !userObject.objectID) || this.state.pending
//                 cc.log("Disable button: ", disableDownButton || "false");
//                 memberRows.push(

//                     <div className="rowSelect mb-5" key={'invest-' + i}>


//                         {/*<div style={{ cursor: (userObject.objectID || member.authorized) ? "pointer" : "not-allowed" }} className="memberMesCon">{member.message}</div>*/}
//                         {(userObject.objectID || userObject.leaseTokenAddress || userObject.objectHash) && <div className="col-12">   {/*memberMesBtns*/}
//                             {
//                                 !disableDownButton &&
//                                     userObject.crowdsaleclosed ?
//                                     userObject.objectActive ?
//                                         <Invoices />
//                                         :
//                                         (member.account === this.props.account) ?
//                                             <Invest />
//                                             : cc.log("MEMBER CAN ONLY BUY AND ACTIVATE HIS OBJECT")
//                                     :
//                                     (member.authorized) ?
//                                         <Invest />
//                                         :
//                                         cc.log("NO OBJECT CONFIGURED")
//                             }
//                             {/*!disableDownButton && <div className="membersBtn">
//                                 <button className="arrowBtn" onClick={() => {
//                                     userObject.crowdsaleclosed ?
//                                         (userObject.active ?
//                                             this.props.history.push("/", { path: "invoices" })
//                                             :
//                                             (member.account === this.props.account) ? this.props.history.push("/", { path: "invest" }) : cc.log("MEMBER CAN ONLY BUY AND ACTIVATE HIS OBJECT")
//                                             // 
//                                             // (this.props._setEventAlert({
//                                             //     title: "Please contact admin for ACTIVATION",
//                                             //     message: ``,
//                                             //     level: "error",
//                                             //     position: "tr",
//                                             //     autoDismiss: 3
//                                             // }))
//                                         )
//                                         :
//                                         (
//                                             (userObject.leaseTokenAddress && !userObject.objectID) ?
//                                                 // this.props._lcCreateObject(this.props, userObject["_id"], userObject.months, userObject.municipalityID, userObject.objectPrice, userObject.objectHash, userObject.leaseTokenAddress, userObject.objectDealer, (parseFloat(userObject.objectMonthlyCapitalCost) * 100), (parseFloat(userObject.objectMonthlyOperatingCost) * 100), this.props.account)
//                                                 (member.account === this.props.account) ? this.props.history.push("/", { path: "newobject" }) : cc.log("MEMBER CAN ONLY CREATE HIS OBJECT")
//                                                 :
//                                                 (member.authorized) ?
//                                                     this.props.history.push("/", { path: "invest" })
//                                                     :
//                                                     cc.log("NO OBJECT CONFIGURED")
//                                         )
//                                 }}>
//                                     <span className="flaticon-right-arrow fs-25"></span>
//                                 </button>                                    
//                         </div>*/}
//                         </div>}
//                     </div>
//                 )
//             }

//             return <div className="leaseCarCon ph-5" key={j}>{memberRows}</div>
//         })
//     }
// }
