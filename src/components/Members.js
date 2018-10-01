import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { Link } from 'react-router-dom'
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'
import Invest from '../containers/Invest';
import Invoices from '../containers/Invoices';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

// import { pseudoRandomBytes } from 'crypto';

class Members extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // filter: '',
            progress: true,
            modalCondition: false,
            activeIndex: null,
            ethVal: '',
            euroVal: '',
            coinVal: ''
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
        // if (!this.state.members && this.props.members) this.setState({ members: this.props.members })
        // let data = {
        //     module: "membersdev4",
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
        this.setState({ usernames: undefined })
        this.props._resetTxIds()
    }

    componentDidMount() {
        // if (!this.props.members) {
        // console.log("Y u call me !!!")
        if (!this.props.members && !this.props.coinNames)
            this.props._fetchContractData(this.props,
                {
                    module: "crowdfundobj2",
                    result: "coinNames",
                    query: {
                    },
                    filter: {
                        _id: 0,
                        objectName: 1,
                        objectID: 1
                    }
                }, this.props.account)
        this.setState({ progress: true })
        // this.fetchMembers()
        // }
    }

    componentWillReceiveProps(nextProps) {
        let refreshEvents = ["CreateNewUser", "NewMember"]

        if ((nextProps.AddNewUser && (nextProps.AddNewUser !== this.props.AddNewUser))) {
            this.setState({ pending: true })
        }

        if (
            nextProps.event && (nextProps.event !== this.props.event) &&
            (
                (nextProps.AddNewUser && (nextProps.event.transactionHash === nextProps.AddNewUser.txID))
                || (refreshEvents.indexOf(nextProps.event.event) !== -1)
            )
        ) {
            this.setState({ pending: false }, () => {
                // setTimeout(() => {
                // this.fetchMembers()
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
                // || (nextProps.newCrowdFundToken && (nextProps.event.transactionHash === nextProps.newCrowdFundToken.txID))
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

        // if (nextProps.members && nextProps.members !== this.state.members) {
        //     // let members = this.sortMembers()
        //     let members = nextProps.members
        //     let usernames = nextProps.usernames

        //     // cc.log("######## SORTED MEMBERS ###########", members);
        //     // if (members.length >= 3) { progress: true
        //     // members[0].car ? members[0].car.crowdsaleClosed = true : ""
        //     // members[1].car ? members[1].car.crowdsaleClosed = true : ""
        //     //     // members[2].car ? members[2].car.crowdsaleClosed = true : ""
        //     // }

        //     this.setState({ members, usernames }, () => setTimeout(() => this.setState({ progress: false }), 3500))
        //     // if (!this.props.lcCars)
        //     // for (let i = 1; i <= this.props.members.length; i++) {
        //     //     // this.fetchCar(i)
        //     //     this.props._lcCars(i)
        //     //     this.props._evMyTokens(this.props.account, i)
        //     // }
        //     // this.props.members.map(member => {
        //     //     if (!member.obj) this.props._lcCars(member.objectID)
        //     //     if (!member.evTokens) this.props._evMyTokens(this.props.account, member.objectID)

        //     // })
        //     // if (!this.props.evTokens) this.props._reloadTokens()
        // }

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

    onHandOut = () => {

    }

    topFunction = (k) => {
        // window.scrollTo({
        //     top: 20,
        //     behavior: "smooth"
        // });
        let el = "action" + k
        var elmnt = document.getElementById(el);
        elmnt.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
    }

    renderMember = (coins, member, i) => {

        const ethBal = this.props.ethBal ? parseFloat(this.props.ethBal).toFixed(2) : 0
        cc.log("coins: ", coins, this.state)
        let memberRows = [
            <div key={i} className="mtableLink" onClick={() => this.setState({ activeIndex: this.state.activeIndex === i ? null : i })}>
                <div className="col-5">
                    <div className="mtableUser">
                        <span className="fs-20 fw-700" style={member.account === this.props.account ? { fontWeight: "bold" } : {}}>{member.username || ""}</span>
                        <p>{member.town || ""}</p>
                    </div>
                </div>
                <div className="col-7">
                    <div className="mtableCar" style={{ backgroundImage: `url(${member.profilePic || require('../assets/anonymous.png')})` }}>
                        <span className="fs-20 fw-700" style={{ fontWeight: "bold" }}>{(member.balance > 0) ? "" : "NEW"}</span>
                    </div>
                    {(this.props.AddNewUser && this.props.AddNewUser["account"] === member["account"]) &&
                        (<Link target="_blank" to={this.rinkebyStatsURL + this.props.AddNewUser.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.AddNewUser.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Confirmed</p> : <p className="p-euro" style={{ color: "#FF9800", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Pending</p>}</Link>)}
                </div>
            </div>
        ]

        // let coins = this.props.coinNames ? this.props.coinNames: []
        let textStyle = {
            color: "red",
            fontSize: "10px"
        }
        // if (selected && this.props.account) {
        memberRows.push(
            <div className="rowSelect d-ib mb-5" key={'invest-' + i}>

                <div className="mb-10 d-flex">
                    <div className="col-4 d-flex">
                        <span className="lh-33 fs-14 ">{"Hand out ETH "}</span>
                    </div>
                    <div className="col-4 d-flex">
                        <span className="lh-33" style={textStyle}>{this.state.ethVal ? (ethBal - this.state.ethVal).toFixed(2) : ethBal}</span>
                    </div>
                    <div className="col-4 d-flex ml-10">
                        <input maxLength="20" onFocus={() => this.setState({ active: 0, euroVal: 0, coinVal: 0, coin: null })} value={this.state.ethVal} onChange={(e) => this.setState({ ethVal: e.target.value > 0 && (e.target.value < ethBal) && e.target.value })} type="number" step="0.01" placeholder="ETH *" />
                    </div>
                </div>

                <div className="mb-10 d-flex">
                    <div className="col-4 d-flex">
                        <span className="lh-33 fs-14 ">{"Hand out Euro "}</span>
                    </div>
                    <div className="col-4 d-flex">
                        <span className="lh-33" style={textStyle}>{this.state.euroVal ? (parseInt((this.props.euroTokenBalance || 0), 10) - this.state.euroVal) : parseInt((this.props.euroTokenBalance || 0), 10)}</span>
                    </div>
                    <div className="col-4 d-flex ml-10">
                        <input maxLength="20" onFocus={() => this.setState({ active: 1, ethVal: 0, coinVal: 0, coin: null })} value={this.state.euroVal} onChange={(e) => this.setState({ euroVal: e.target.value > 0 && e.target.value < parseInt(this.props.euroTokenBalance, 10) && e.target.value })} type="number" step="1" placeholder="Euro *" />
                    </div>
                </div>

                <div className="mb-10 d-flex">
                    <div className="col-4 d-flex fs-14">
                        <span className="lh-33">{"Hand out Coins "}<span style={textStyle}></span></span>
                    </div>
                    <div className="col-4 d-flex dropDown1">
                        <Dropdown optionLabel="objectName" style={{ width: '100%' }} value={this.state.coin} options={coins} onChange={(e) => { this.setState({ coin: e.value }) }} placeholder="Select Coin" />
                    </div>
                    <div className="col-4 d-flex ml-10">
                        <input maxLength="20" onFocus={() => this.setState({ active: 2, euroVal: 0, ethVal: 0 })} value={this.state.coinVal} onChange={(e) => this.setState({ coinVal: e.target.value })} type="number" placeholder="Coins *" />
                    </div>
                </div>
                <div className="col-4"></div>
                <div className="col-4 arrowHover-s2">
                    {/* <button className="arrowBtn" onClick={() => this.props.history.push("/", { path: "addnewlife" })}>
                        <span className="flaticon-right-arrow"></span>
                    </button> */}
                    <div className="btnPadlock">
                        <span className="flaticon-padlock unlock" onClick={() => this.props._handOutUser(this.state, member, this.props.account)}></span>
                    </div>
                </div>
                <div hidden className="col-4">
                    <p className="lh-75" style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", width: "100%" }}>Pending</p>
                    {/* <p className="lh-75" style={{ color: "green", fontSize: "18px", fontWeight: "600", width: "100%" }}>Confirmed</p> */}
                </div>
            </div>
        )
        // }

        return <div key={i} id={"action" + i} className={this.state.activeIndex === i ? 'leaseCarCon leden active' : 'leaseCarCon leden '} onClick={() => {this.topFunction(i)}}>{memberRows}</div>
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
        // cc.log(this.state);
        let members = this.props.usernames ? this.props.filter ? this.props.usernames.filter(user => ((user.username && user.username.toLowerCase().startsWith(this.props.filter && this.props.filter.toLowerCase())))) : this.props.usernames : []
        // members = members && members.sort((a, b) => a["balance"] - b["balance"]) // sort by eth balance asc
        // members = members && members.sort((a, b) => ((a["account"] === this.props.account) ? 0 : (b["account"] === this.props.account) ? -1 : 0))
        // console.log(members);
        // let user = this.props.usernames ? this.props.usernames.find(us => us["account"] === this.props.account) : {}
        let userIndex = this.props.usernames && this.props.usernames.findIndex(us => us["account"] === this.props.account)
        // if (userIndex && userIndex !== -1) {
        //     members.splice(userIndex, 1);
        // }
        members.sort((x, y) => (x["account"] === this.props.account ? -1 : y["account"] === this.props.account ? 1 : 0))
        // let user = {}
        // const coins = (this.props.coinNames && user) ? this.props.coinNames.filter(coin => user.coins.includes(coin.objectID)) : []
        let coins = []

        return (
            <div className="content-border mobile-margin">
                <div className="border-bottom-1  fix-small-dev">
                    <div className="container">
                        {/* <span className="lh-40">MIJN SALDO: <strong className="fs-20">{formatNumber(parseInt(((this.props.euroTokenBalance || 0) + (this.props.unClaimedRedemption || 0)), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}</strong> testEuro</span> */}
                        <span className="lh-40">MIJN SALDO: <strong className="fs-20">{formatNumber(parseInt((this.props.euroTokenBalance || 0), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}</strong> testEuro</span>
                        <span className="fr pt-8"><img className="infoImg" src={require('../assets/deal.png')} alt="deal" /></span>
                    </div>
                </div>
                <div className="mainContentCon foot">
                    <div className="contentCon overflow bg-none contentCon-8 pt-8" style={{height:"587px"}}>
                        {/* <BlockUi tag="div" blocking={this.state.progress} renderChildren={false}> || investObjs.length === 0 */}
                        <div className="membersCon pb-20 pt-5-mobile pv-5-mobile">
                            <div>
                                <div className="accordionContent">
                                    {
                                        members && members.map((member, i) => {
                                            // return <div className="leaseCarCon" key={i}>
                                            // </div>
                                            return this.renderMember(coins, member, i)
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        {/* <div className="contentBtn">
                            {this.props.addNewObjectTxID && (!this.state.eventAddNewObject ? <p style={{ color: "red" }}>pending</p> : <p style={{ color: "green" }}><i>Confirmed</i></p>)}
                            <input className="searchBtn" type="text" name="filterMembers" value={this.state.filter || ""} placeholder="Search" onChange={(e) => { cc.log("SEARCH: ", e.target.value); this.setState({ filter: e.target.value }) }} />
                        </div> */}

                        {/* </BlockUi> */}
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
