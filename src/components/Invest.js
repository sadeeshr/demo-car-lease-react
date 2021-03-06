import React, { Component } from 'react'
// import BigNumber from 'bignumber.js';
import BlockUi from 'react-block-ui';
import { Link } from 'react-router-dom'
import Slide from 'react-reveal/Slide';
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'
import { Calendar } from 'primereact/components/calendar/Calendar';
import { Button } from 'primereact/components/button/Button';

import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class Invest extends Component {

    constructor(props) {
        super(props)
        this.state = { reveal: false, activedate: new Date(), ethInvest: 1 }
        // this.confTimer = null
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
    }


    componentWillMount() {
        // cc.log("Invest Props: ", this.props);
        this.setState({
            refreshValues: false,
            modalCondition: false,
        })
    }

    modalClick() {
        this.setState({
            modalCondition: !this.state.modalCondition
        });
    }

    componentWillUnmount() {
        this.props._resetTxIds()
    }

    componentDidMount() {
        this.refreshValues()
        this.setState({ reveal: true })
    }

    componentWillReceiveProps(nextProps) {
        const member = nextProps.members && nextProps.members.find(memberO => memberO["_id"] === nextProps.member["_id"])

        if (nextProps.payFeeTxID) {
            nextProps._lcToClaimDividend(member.objectID, nextProps.account)
        }

        // let timeOut = 1000
        if (nextProps.eventClaim && !this.state.eventClaim) { this.setState({ eventClaim: nextProps.eventClaim, ethInvest: null }) }
        if (nextProps.eventApprove && !this.state.eventApprove) { this.setState({ eventApprove: nextProps.eventApprove, ethInvest: null }) }

        if ((nextProps.investInObjectTxID && (nextProps.investInObjectTxID !== this.props.investInObjectTxID)) || (nextProps.BuyAndActivateTxID && (nextProps.BuyAndActivateTxID !== this.props.BuyAndActivateTxID))) {
            // console.log("### PENDING ###");
            this.setState({ pending: true })
            this.props._setObject({ textStyle: { id: member["_id"], color: "color-orange" } })
        }
        if (nextProps.event && (nextProps.event !== this.props.event) && ((nextProps.event.event === "InvestInObject") || (nextProps.event.event === "AddNewObject") || (nextProps.event.event === "BoughtNewObject") || (nextProps.event.transactionHash === nextProps.investInObjectTxID) || (nextProps.event.transactionHash === nextProps.BuyAndActivateTxID))) {
            // this.refreshValues()
            // const member = nextProps.members && nextProps.members.find(memberO => memberO["_id"] === nextProps.member["_id"])
            this.props._euroBalanceOf(this.props.account)

            this.props._crowdFundData(member.objectID, "address", "fundtoken")
            this.props._crowdFundData(member.objectID, "string", "fundtokenname")
            this.props._crowdFundData(member.objectID, "address", "objectowner")
            this.props._crowdFundData(member.objectID, "integer", "objectprice")
            this.props._crowdFundData(member.objectID, "bytes", "objecthash")
            this.props._crowdFundData(member.objectID, "address", "fundreceiver")
            this.props._crowdFundData(member.objectID, "address", "currency")
            this.props._crowdFundData(member.objectID, "integer", "monthlycapitalcost")
            this.props._crowdFundData(member.objectID, "integer", "monthlyoperatingcost")
            this.props._crowdFundData(member.objectID, "integer", "raised")
            this.props._crowdFundData(member.objectID, "bool", "crowdsaleclosed")
            this.props._crowdFundData(member.objectID, "bool", "objectActive")
            this.props._crowdFundData(member.objectID, "integer", "objectActiveTime")
            this.props._crowdFundData(member.objectID, "bool", "claimedcrowdsale")
            this.props._crowdFundData(member.objectID, "address", "serviceProvider")
            this.props._crowdFundData(member.objectID, "integer", "biddingtime")

            // this.props._lcLeaseObject(this.props.account, member.objectID) // change
            // this.props._lcLeaseObjectCycle(member.objectID) // change
            // this.props._ldGetRaised(member.objectID) // change
            // cc.log("i need to refresh here !!");
        }
        // if (!this.props.unClaimedRedemption && this.props.account) this.props._lcToClaimTotal(this.props.account) //change
        if (!this.props.euroTokenBalance && this.props.account) this.props._euroBalanceOf(this.props.account)

        // this.setState({ refreshValues: !this.state.refreshValues })
        // cc.log("#### TOTAL SUPPLY: ######", nextProps.eventTransfer, this.props.totalSupply, nextProps.totalSupply, this.props.hashConfirmations);
        // if (nextProps.eventTransfer || nextProps.eventApprove || nextProps.eventClaim)
        //     if (!this.props.hashConfirmations) this.props._getConfirmationsHash(this.props.investInObjectTxID)

        // if (this.props.hashConfirmations && this.props.hashConfirmations > 0) {
        //     // clearInterval(this.confTimer)
        //     // cc.log("HASH CONFIRMS: ", this.props.hashConfirmations);
        //     // this.refreshValues()
        // }

        // if (this.props.totalSupply !== nextProps.totalSupply || this.props.allowance !== nextProps.allowance || this.props.unClaimedRedemption !== nextProps.unClaimedRedemption) {
        // this.props._resetEvent() //temporary
        if (nextProps.eventTransfer && !this.state.eventTransfer) { this.setState({ eventTransfer: nextProps.eventTransfer, ethInvest: undefined }) }
        // if (nextProps.member.crowdsaleClosed && !nextProps.member.active) this.props._resetTxIds()

        if (nextProps.event && (nextProps.event !== this.props.event) && ((nextProps.event.transactionHash === nextProps.investInObjectTxID) || (nextProps.event.transactionHash === nextProps.BuyAndActivateTxID))) {
            this.setState({ pending: false }, () => {
                this.props._setObject({ textStyle: { id: member["_id"], color: "color-green" } })
                setTimeout(() => {
                    this.props._setObject({ textStyle: { id: member["_id"], color: "color-black" } })
                    this.props._resetTxIds()
                }, 5000)
            })
        }
        // }
        this.props = nextProps
    }

    doExit = () => {
        this.setState({ reveal: false })
        setTimeout(() => {
            this.props.history.goBack()
        }, 500);
    }

    incDecInvestValue = (type) => {
        let invest = this.state.ethInvest || 0
        this.setState({ ethInvest: (type === "inc") ? (invest + 1) : (invest > 0) ? (invest - 1) : 0 })
    }

    refreshValues = () => {
        // fetch Total Supply
        // this.props._lcTotalSupply() //sadeesh

        // fetch Total Crowdsale Closed Objects
        // this.props._lcAmountObjects()

        // fetch My Lease Tokens
        // this.props.account && this.props._evBalanceOf(this.props.account) //sadeesh

        // fetch My Euro Tokens
        this.props.account && this.props._euroBalanceOf(this.props.account)

        // fetch My Allowance Value
        // this.props.account && this.props._euroAllowance(this.props.account) //sadeesh

        // fetch Object ID's To Claim Dividend Value
        // this.props.account && this.props._lcToClaimTotal(this.props.account)

        // fetch Object ID's Values
        // this.props._lcLeaseObject(this.props.member.objectID)

        // fetch Object ID Cycle's Values
        // this.props._lcLeaseObjectCycle(this.props.member.objectID)

        // fetch Object ID Redemption's Values
        // this.props._lcLeaseObjectRedemption(this.props.member.objectID)  //sadeesh

        // fetch Total Raised
        // this.props._ldGetRaised(this.props.member.objectID)

        // fetch Object ID's EVTokens
        //this.props._evMyTokens(this.props.account, this.props.member.objectID) //sadeesh

        // if (!this.props.unClaimedRedemption && this.props.account) this.props._lcToClaimTotal(this.props.account)
        // if (!this.props.totalSupply) this.props._lcTotalSupply() //sadeesh
        // if (!this.props.euroTokenBalance) this.props._euroBalanceOf(this.props.account) //sadeesh
        // if (!this.props.evTokenBalance) this.props._evBalanceOf(this.props.account) //sadeesh
        // if (!this.props.crowdsaleClosed) this.props._lcAmountObjects()
        // if (!this.props.allowance) this.props._euroAllowance(this.props.account) //sadeesh


    }

    doInvest = (objectID) => {
        const member = this.props.usernames.find(user => user["account"] === this.props.account)
        if (member.coins.indexOf(parseInt(objectID)) === -1) {
            let coins = member.coins
            coins.push(parseInt(objectID))
            let coinsData = {
                module: "membersdev4",
                result: "usernames",
                query: {
                    "_id": member["_id"]
                },
                data: { coins }
            }
            cc.log(coinsData)

            this.props._updateContractData(this.props, coinsData)
        }

        this.props._lcInvestInObject(objectID, this.state.ethInvest || "0", this.props.account)
    }

    render() {
        cc.log("Invest State Props", this.state, this.props);
        // if (this.props.account && !this.props[this.props.account]) this.props._getBalance(this.props.account);

        const user = this.props.usernames && this.props.usernames.find(userO => userO["_id"] === this.props.member["member"])
        const member = this.props.members && this.props.members.find(memberO => memberO["_id"] === this.props.member["_id"])
        cc.log("User, Member Objects: ", user, member)
        const buyAndActivate = member.crowdsaleclosed && !member.objectActive && (user["account"] === this.props.account)
        cc.log(buyAndActivate, this.props.account);
        const amountRemaining = member.objectPrice - member.raised
        // const allowedAmountToInvest = Math.min(Math.min(amountRemaining, this.props.allowance), this.props.euroTokenBalance)
        // const euroTokenBalance = this.props.euroTokenBalance ? (this.props.euroTokenBalance.length > 5 ? this.props.euroTokenBalance.substring(0, 5) + "..." : this.props.euroTokenBalance) : ""
        // (this.state.euroTokenBalance || "").substring(0, 8) + "..."
        // const account = this.props.account ? this.props.account.substring(0, 7) + '.....' + this.props.account.substring(this.props.account.length - 5) : ""
        // const hideInvest = (this.props.member.raised >= this.props.member.objectPrice) ? true : false
        const ethInvest = parseInt((this.state.ethInvest || "0"), 10)
        const enableInvest = ((ethInvest <= amountRemaining) && (ethInvest <= (this.props.euroTokenBalance)) && (this.state.ethInvest !== "") && (this.state.ethInvest !== 0))
        // const enableInvest = ((ethInvest <= amountRemaining) && (ethInvest <= (this.props.euroTokenBalance + this.props.unClaimedRedemption)) && (this.state.ethInvest !== "") && (this.state.ethInvest !== "0")) // change
        // const enableInvest = ((ethInvest <= amountRemaining) && (ethInvest <= this.props.allowance) && (ethInvest <= this.props.euroTokenBalance) && (this.state.ethInvest !== "") && (this.state.ethInvest !== "0"))
        // cc.log("Enable Invest: ", ethInvest, enableInvest, (ethInvest <= amountRemaining), (ethInvest <= this.props.allowance), (ethInvest <= this.props.euroTokenBalance), (this.state.ethInvest !== ""));
        // (this.props.account || "").substring(0, 8) + "..."
        const perMaand = member.objectMonthlyCapitalCost / (member.objectPrice / ethInvest)
        cc.log("Object Price, Total Raised, perMaand: ", member.objectPrice, member.raised, perMaand)
        cc.log("Allowed amount: ", amountRemaining, ethInvest, enableInvest);

        return (<div className="col-12">
            <div className="col-12 mt-15 mb-15">
                <p className="fw-700 text-center" style={{ color: (member.crowdsaleclosed || member.objectActive) ? "black" : "black" }}>{buyAndActivate ? ("AANSCHAF " + member.objectType.toUpperCase()) : (member.objectActive ? "ACTIVE" : member.crowdsaleclosed ? "CLOSED" : "INVESTEER")}</p>
            </div>
            <div className="col-12 text-center fs-13"> <span>{buyAndActivate ? "Opleverdatum" : ""}</span></div>
            {/* <div className="col-2 lh-40"> &nbsp; </div> */}

            <div className="col-12">
                {
                    buyAndActivate ?
                        <Calendar className="calInput" value={this.state.activedate || new Date()} onChange={(e) => this.setState({ activedate: e.value })}>Opleverdatum</Calendar>
                        : <div className="investAddInput" style={{ width: '100%' }}>
                            {
                                !member.crowdsaleclosed &&
                                <div className="mb-5 d-ib fs-13">

                                    <div className="col-7 mb-10">
                                        <p>Rendement: <span className="fw-900">{member.objectInterest || 0}% </span></p>
                                    </div>
                                    <div className="col-5 mb-10">
                                        <p>Maanden: {member.months}</p>
                                    </div>

                                    <div className="col-7 mb-15">
                                        <p>Per maand: <span className="fw-900">{perMaand.toFixed(2)} Euro</span></p>
                                    </div>
                                    <div className="col-5 mb-15">
                                        <p>Restwaarde: {formatNumber(member.objectRest, { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}</p>
                                    </div>

                                    <div className="col-12">
                                        <div className='value'>
                                            <div className="text-center sliderBtn">

                                                <button className="sliderMinus" onClick={() => (this.state.ethInvest > 1) && this.incDecInvestValue("dec")} >{" - "}</button>
                                                <div className="fs-20 ph-10" style={{ display: 'inline-block' }}>
                                                    <span className="fw-900">{formatNumber((typeof this.state.ethInvest === 'undefined') ? 0 : this.state.ethInvest, { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}</span> Euro
                                                </div>
                                                <button className="sliderAdd" onClick={() => (this.state.ethInvest < Math.min(amountRemaining, this.props.euroTokenBalance)) && this.incDecInvestValue("inc")} >{" + "}</button>

                                            </div>
                                            {/* <div className="col-9 text-left ti-15">&nbsp;</div> */}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <Slider
                                            disabled={this.state.pending}
                                            min={1}
                                            max={Math.min(amountRemaining, this.props.euroTokenBalance)}
                                            step={5}
                                            value={this.state.ethInvest}
                                            orientation='horizontal'
                                            onChange={(value) => this.setState({ ethInvest: value })}
                                        />
                                    </div>
                                </div>
                                /*<input style={{ color: (enableInvest ? "black" : "red") }} value={(typeof this.state.ethInvest === 'undefined') ? 0 : this.state.ethInvest} onChange={(e) => this.setState({ ethInvest: e.target.value })} maxLength="20" type="text" placeholder="Euro Token" />*/
                            }
                        </div>
                }
            </div>
            {/*!buyAndActivate && !member.crowdsaleclosed && <div className="col-3 lh-40"> Euro </div>*/}
            <div className="col-12 text-center">

                <div className="col-4">

                </div>
                <div className="col-4">
                    <div className="btnPadlock">
                        <span className="flaticon-padlock unlock" style={{ cursor: !this.state.pending && ((enableInvest && !member.crowdsaleclosed) || buyAndActivate) ? "pointer" : "not-allowed" }}
                            onClick={() => {
                                buyAndActivate ?
                                    !this.state.pending && this.state.activedate && this.props._lcBuyAndActivate(member.objectID, this.state.activedate, this.props.account)
                                    : !this.state.pending && this.props.account && !member.crowdsaleclosed && enableInvest && this.doInvest(member.objectID || (this.props.event && this.props.event.returnValues && this.props.event.returnValues.objectID))
                            }} >
                        </span>
                    </div>
                </div>
                <div className="col-4 pv-20">
                    {this.props.investInObjectTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.investInObjectTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.investInObjectTxID)) ? <p className="p-euro" style={{ color: "green", fontSize: "18px", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Confirmed</p> : <p className="p-euro" style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Pending</p>}</Link>)}
                    {this.props.BuyAndActivateTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.BuyAndActivateTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.BuyAndActivateTxID)) ? <p className="p-euro" style={{ ccolor: "green", fontSize: "18px", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Confirmed</p> : <p className="p-euro" style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Pending</p>}</Link>)}
                </div>
            </div>
        </div>
        )
    }
}

export default Invest

// old render
// <div className="content-border mobile-margin">
// <div className="border-bottom-1  fix-small-dev">
//     <div className="container">
//         <span className="lh-40">MIJN SALDO: <strong className="fs-20">{formatNumber(parseInt((this.props.euroTokenBalance), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}</strong> Euro</span>
//         <span className="fr pt-8"><img className="infoImg" src={require('../assets/deal.png')} alt="deal" /></span>
//     </div>
// </div>
// <div className="mainContentCon mainContentCon-43">
//     {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
// <div className="float-right">
//     <i title="Invoices" className="flaticon-invoice" onClick={() => this.props.history.push("/", { path: "invoices" })}></i>
//     <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
// </div> */}
//     <div hidden className="navCon">
//         <h1 id="header">
//             <div hidden className="fl">
//                 <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
//             </div>
//             Invest
//         <div hidden className="fr">
//                 <i title="Invoices" className="flaticon-invoice marIcon" onClick={() => this.props.history.push("/", { path: "invoices" })}></i>
//                 <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
//             </div></h1>
//     </div>
//     <Slide right opposite when={this.state.reveal}>
//         <div className="contentCon bg-none overflow contentCon-8 pt-8">
//             <BlockUi tag="div" blocking={this.props.progress}>
//                 <div className="carIntestCon">
//                     <div className="membersCon text-center pt-5-mobile">
//                         <div className="leaseCarCon br-30 main-i invest">
//                             {/* <div className="balance d-ib inv">
//                             <div className="col-6 balanceName lh-25 text-right">MIJN SALDO : </div>
//                             <div className="col-6 balanceNum lh-25 text-left">{formatNumber(parseInt((this.props.euroTokenBalance + this.props.unClaimedRedemption), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}<span> Euro</span></div> */}
//                             {/* <div className="col-6">&nbsp;</div>
//                             <div className="col-6 minusBal text-left">-2.500</div> */}
//                             {/* </div> */}
//                             <div className="col-6">
//                                 <div className="pt-25 pl-15 fs-20  tt-capital fw-600">
//                                     <span className="opacity07">{user.username}</span>
//                                     <p>{user.town}</p>
//                                     <span className="opacity07 fs-14"><span className="fw-900">{member.raised}</span> Euro opgehaald</span>
//                                 </div>
//                             </div>
//                             <div className="col-6 mtableLink">
//                                 <div className="mtableCar" style={{ backgroundImage: `url(${member.objectPic})` }}>
//                                     {/* <img src={this.props.member.objectPic} alt="carImage" /> */}
//                                 </div>
//                             </div>
//                             <div className="col-12">
//                                 <div className="col-6 text-left pl-10 w6-10">

//                                     {/* <span style={{ width: "40px", display: "inline-block", textAlign: "right"}}>{member.raised}</span>
//                                 <span className="ml-3">Totaal</span> */}

//                                     <p className="fs-15">
//                                         <span style={{ display: "inline-block", textAlign: "right" }}>waarvan <span className="fw-900">{member.evTokens}</span> door mij</span>
//                                         {/* <span className="ml-3">Mijn Investering</span> */}
//                                     </p>
//                                 </div>
//                                 <div className="col-6 mtableMnd text-center" style={{ fontSize: "14px" }}><span className="fw-900">Target: </span>{formatNumber(parseInt((member.objectPrice), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} EUR
//                                 {/* <p className="fs-12">{member.months} MND</p> */}
//                                 </div>
//                             </div>
//                             <div className="col-12 investAddCon border-2">
//                                 <div className="col-12 mb-15">
//                                     <p className="fw-700 text-center" style={{ color: (member.crowdsaleclosed || member.objectActive) ? "black" : "black" }}>{buyAndActivate ? ("AANSCHAF " + member.objectType.toUpperCase()) : (member.objectActive ? "ACTIVE" : member.crowdsaleclosed ? "CLOSED" : "INVESTEER")}</p>
//                                 </div>
//                                 <div className="col-12 text-center fs-13"> <span>{buyAndActivate ? "Opleverdatum" : "Bedrag"}</span></div>
//                                 <div className="col-3 lh-40">
//                                     &nbsp;
//                             </div>
//                                 <div className="col-6">
//                                     {
//                                         buyAndActivate ?
//                                             <Calendar className="calInput" value={this.state.activedate || new Date()} onChange={(e) => this.setState({ activedate: e.value })}>Opleverdatum</Calendar>
//                                             : <div className="investAddInput">{!member.crowdsaleclosed && <input style={{ color: (enableInvest ? "black" : "red") }} value={(typeof this.state.ethInvest === 'undefined') ? 0 : this.state.ethInvest} onChange={(e) => this.setState({ ethInvest: e.target.value })} maxLength="20" type="text" placeholder="Euro Token" />}
//                                             </div>
//                                     }
//                                 </div>
//                                 {!buyAndActivate && !member.crowdsaleclosed && <div className="col-3 lh-40">
//                                     Euro
//                             </div>}

//                                 <div className="col-12 text-center">

//                                     {/* <span className="flaticon-padlock unlock"></span>  */}
//                                     {/* <span className="minusBal">Pending</span> */}
//                                     {this.props.investInObjectTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.investInObjectTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.investInObjectTxID)) ? <p className="p-euro" style={{ color: "green", fontSize: "18px", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Confirmed</p> : <p className="p-euro" style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Pending</p>}</Link>)}
//                                     {this.props.BuyAndActivateTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.BuyAndActivateTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.BuyAndActivateTxID)) ? <p className="p-euro" style={{ ccolor: "green", fontSize: "18px", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Confirmed</p> : <p className="p-euro" style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Pending</p>}</Link>)}

//                                     <span className="flaticon-padlock unlock unlock-m" style={{ cursor: !this.state.pending && ((enableInvest && !member.crowdsaleclosed) || buyAndActivate) ? "pointer" : "not-allowed" }} onClick={() => {
//                                         buyAndActivate ?
//                                             !this.state.pending && this.state.activedate && this.props._lcBuyAndActivate(member.objectID, this.state.activedate, this.props.account)
//                                             : !this.state.pending && this.props.account && !member.crowdsaleclosed && enableInvest && this.props._lcInvestInObject(member.objectID || (this.props.event && this.props.event.returnValues && this.props.event.returnValues.objectID), this.state.ethInvest || "0", this.props.account)
//                                     }} ></span>


//                                     {/* <span className="confirmBal">Confirmed</span> */}
//                                 </div>

//                                 {/* <div className="arrowBtn">
//                                 <img style={{ cursor: ((enableInvest && !this.props.member.crowdsaleClosed) || buyAndActivate) ? "pointer" : "not-allowed" }} onClick={() => {
//                                     buyAndActivate ?
//                                         this.state.activedate && this.props._lcBuyAndActivate(this.props.member.objectID, this.state.activedate, this.props.account)
//                                         : this.props.account && !this.props.member.crowdsaleClosed && enableInvest && this.props._lcInvestInObject(this.props.member.objectID || (this.props.event && this.props.event.returnValues && this.props.event.returnValues.objectID), this.state.ethInvest || "0", this.props.account)
//                                 }} src={require('../assets/add.jpg')} alt="add2" />
//                             </div>
// */}


//                                 {/* <div className="investAddStatus">

//                                 {this.props.investInObjectTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.investInObjectTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.investInObjectTxID)) ? <p className="p-euro" style={{ color: "green" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red" }}>pending</p>}</Link>)}
//                                 {this.props.BuyAndActivate && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.BuyAndActivateTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.BuyAndActivateTxID)) ? <p className="p-euro" style={{ color: "green" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red" }}>pending</p>}</Link>)}
//                             </div> */}

//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </BlockUi>
//         </div>
//     </Slide>
// </div>
// <div className={this.state.modalCondition ? "infoPop is-open" : "infoPop is-close"} >
//     <span className="modalCloseBtn" onClick={() => this.modalClick()}>x</span>
//     Vandaag 20 euro,
//     morgen 19.99,
//     overmorgen 19.98,
//     over 3 jaar 10
//     ...of 1 euro per uur
//     </div>
// <div className="footBtn container">
//     <div className="container text-center">
//         <div className="beforeFooter">
//             <div className="col-2 text-left">
//                 <button className="arrowBtn" onClick={this.doExit.bind(this)}>
//                     <span className="flaticon-left-arrow"></span>
//                 </button>
//             </div>
//             <div className="col-8 lh-54 text-left ti-5-mobile">
//                 Ga Terug
//         </div>
//             <div className="col-2 text-left padding-10-0">
//                 <div className="text-right" style={{ float: 'right' }}>
//                     <span onClick={() => this.modalClick()}>
//                         <img className="infoImg" src={require('../assets/info.png')} alt="info" />
//                     </span>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
// <div className="footCon-bottom">
//     <div className="social bg-lightgrey">
//         <div className="container">
//             <span className="smallText">VOLG ONS</span>

//             <span className="flaticon-twitter-logo-on-black-background"></span>
//             <span className="flaticon-facebook-logo"></span>
//             <span className="flaticon-social-media"></span>
//         </div>
//     </div>
//     <div className="contact bg-grey textWhite">
//         <div className="container">
//             <span className="smallText">CONTACT</span>
//         </div>
//     </div>
// </div>
// <div className={this.state.modalCondition ? "modalOverlay is-open" : "modalOverlay is-close"} onClick={() => this.modalClick()}></div>
// </div>