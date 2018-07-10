import React, { Component } from 'react'
// import BigNumber from 'bignumber.js';
import BlockUi from 'react-block-ui';
import { Link } from 'react-router-dom'
import Slide from 'react-reveal/Slide';
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'
import { Calendar } from 'primereact/components/calendar/Calendar';

class Invest extends Component {

    constructor(props) {
        super(props)
        this.state = { reveal: false, activedate: new Date() }
        // this.confTimer = null
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
    }


    componentWillMount() {
        // cc.log("Invest Props: ", this.props);
        this.setState({
            objectID: this.props.member ? this.props.member.objectID : null,
            obj: this.props.member ? this.props.member.obj : null,
            eventTransfer: null,
            eventApprove: null,
            eventClaim: null,
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
        if (!this.props.member.objectID) {
            const townSelected = this.props.towns[this.props.town]
            this.props._fetchMembers(this.props, townSelected["municipalityID"], this.props.account)
        }
        // setTimeout(() => this.props._lcInvestInObject(this.props.member.objectID, "10", this.props.account), 5000);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.payFeeTxID)
            nextProps._lcToClaimDividend(nextProps.member.objectID, nextProps.account)

        // let timeOut = 1000
        if (nextProps.eventClaim && !this.state.eventClaim) { this.setState({ eventClaim: nextProps.eventClaim, ethInvest: null }) }
        if (nextProps.eventApprove && !this.state.eventApprove) { this.setState({ eventApprove: nextProps.eventApprove, ethInvest: null }) }

        if (nextProps.event && (nextProps.event !== this.props.event) && ((nextProps.event.event === "Transfer") || (nextProps.event.event === "AddNewObject") || (nextProps.event.event === "BoughtNewObject") || (nextProps.event.transactionHash === nextProps.investInObjectTxID) || (nextProps.event.transactionHash === nextProps.BuyAndActivateTxID))) {
            // this.refreshValues()
            this.props._euroBalanceOf(this.props.account)
            this.props._lcLeaseObject(this.props.account, nextProps.member.objectID)
            this.props._lcLeaseObjectCycle(nextProps.member.objectID)
            this.props._ldGetRaised(nextProps.member.objectID)
            // cc.log("i need to refresh here !!");
        }
        if (!this.props.unClaimedRedemption && this.props.account) this.props._lcToClaimTotal(this.props.account)
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
        // }
        this.props = nextProps
    }

    doExit = () => {
        this.setState({ reveal: false })
        setTimeout(() => {
            this.props.history.goBack()
        }, 500);
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
        this.props.account && this.props._lcToClaimTotal(this.props.account)

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

    render() {
        cc.log("Invest State Props", this.state, this.props);
        // cc.log("##### EVT", this.props.member ? this.props.member.evTokens : "no evtokens");
        if (this.props.account && !this.props[this.props.account]) this.props._getBalance(this.props.account);

        const user = this.props.usernames && this.props.usernames.find(userO => userO["_id"] === this.props.member["member"])

        const buyAndActivate = this.props.member.crowdsaleClosed && !this.props.member.active && (user["account"] === this.props.account)
        cc.log(buyAndActivate, this.props.account);
        const amountRemaining = this.props.member.objectPrice - this.props.member.totalRaised
        // const allowedAmountToInvest = Math.min(Math.min(amountRemaining, this.props.allowance), this.props.euroTokenBalance)
        // const euroTokenBalance = this.props.euroTokenBalance ? (this.props.euroTokenBalance.length > 5 ? this.props.euroTokenBalance.substring(0, 5) + "..." : this.props.euroTokenBalance) : ""
        // (this.state.euroTokenBalance || "").substring(0, 8) + "..."
        // const account = this.props.account ? this.props.account.substring(0, 7) + '.....' + this.props.account.substring(this.props.account.length - 5) : ""
        // const hideInvest = (this.props.member.totalRaised >= this.props.member.objectPrice) ? true : false
        const ethInvest = parseInt((this.state.ethInvest || "0"), 10)
        const enableInvest = ((ethInvest <= amountRemaining) && (ethInvest <= this.props.euroTokenBalance) && (this.state.ethInvest !== "") && (this.state.ethInvest !== "0"))
        // const enableInvest = ((ethInvest <= amountRemaining) && (ethInvest <= this.props.allowance) && (ethInvest <= this.props.euroTokenBalance) && (this.state.ethInvest !== "") && (this.state.ethInvest !== "0"))
        // cc.log("Enable Invest: ", ethInvest, enableInvest, (ethInvest <= amountRemaining), (ethInvest <= this.props.allowance), (ethInvest <= this.props.euroTokenBalance), (this.state.ethInvest !== ""));
        // (this.props.account || "").substring(0, 8) + "..."
        cc.log("Allowed amount: ", amountRemaining, ethInvest, enableInvest);

        return (<div className="content-border">
            <div className="mainContentCon">
                {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                <div className="float-right">
                    <i title="Invoices" className="flaticon-invoice" onClick={() => this.props.history.push("/", { path: "invoices" })}></i>
                    <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                </div> */}
                <div hidden className="navCon">
                    <h1 id="header">
                        <div hidden className="fl">
                            <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                        </div>
                        Invest
                        <div hidden className="fr">
                            <i title="Invoices" className="flaticon-invoice marIcon" onClick={() => this.props.history.push("/", { path: "invoices" })}></i>
                            <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                        </div></h1>
                </div>
                <Slide right opposite when={this.state.reveal}>
                    <div className="contentCon bg-none overflow">
                        <BlockUi tag="div" blocking={this.props.progress}>
                            <div className="carIntestCon">
                                <div className="membersCon">
                                    <div className="leaseCarCon  main-i invest">
                                        <div className="balance d-ib inv">
                                            <div className="col-6 balanceName lh-25 text-right">MIJN SALDO : </div>
                                            <div className="col-6 balanceNum lh-25 text-left">{formatNumber(parseInt((this.props.euroTokenBalance + this.props.unClaimedRedemption), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}<span> Euro</span></div>
                                            {/* <div className="col-6">&nbsp;</div>
                                            <div className="col-6 minusBal text-left">-2.500</div> */}
                                        </div>
                                        <div className="col-12 mtableLink">
                                            <div className="mtableCar" style={{ backgroundImage: `url(${this.props.member.objectPic})` }}>
                                                {/* <img src={this.props.member.objectPic} alt="carImage" /> */}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="col-3 text-right mtableTokens fs-16">
                                                {this.props.member.totalRaised}
                                                <p style={{ color: 'green' }}>{this.props.member.evTokens}</p>
                                            </div>
                                            <div className="col-5 mtableUser text-center">{user.username}
                                                <p>{user.town}</p>
                                            </div>
                                            <div className="col-4 mtableMnd">{formatNumber(parseInt((this.props.member.objectPrice), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} EUR
                                                <p>{this.props.member.months} MND</p>
                                            </div>
                                        </div>
                                        <div className="col-12 investAddCon border-2">
                                            <div className="col-12 mb-15">
                                                <p className="fw-700 text-center" style={{ color: (this.props.member.crowdsaleClosed || buyAndActivate) ? "green" : "black" }}>{buyAndActivate ? ("BETAAL " + this.props.member.objectType.toUpperCase()) : (this.props.member.active ? "ACTIVE" : this.props.member.crowdsaleClosed ? "CLOSED" : "INVESTEER")}</p>
                                            </div>
                                            <div className="col-4 lh-40">
                                                &nbsp;
                                            </div>
                                            <div className="col-4">
                                                {
                                                    buyAndActivate ?
                                                        <Calendar value={this.state.activedate || new Date()} onChange={(e) => this.setState({ activedate: e.value })}>Opleverdatum</Calendar>
                                                        : <div className="investAddInput">{!this.props.member.crowdsaleClosed && <input style={{ color: (enableInvest ? "black" : "red") }} value={(typeof this.state.ethInvest === 'undefined') ? 0 : this.state.ethInvest} onChange={(e) => this.setState({ ethInvest: e.target.value })} maxLength="20" type="text" placeholder="Euro Token" />}
                                                        </div>
                                                }
                                            </div>
                                            <div className="col-4 lh-40">
                                                Euro
                                            </div>

                                            <div className="col-12 text-center">
                                                <span className="flaticon-lock-1 unlock" style={{ cursor: ((enableInvest && !this.props.member.crowdsaleClosed) || buyAndActivate) ? "pointer" : "not-allowed" }} onClick={() => {
                                                    buyAndActivate ?
                                                        this.state.activedate && this.props._lcBuyAndActivate(this.props.member.objectID, this.state.activedate, this.props.account)
                                                        : this.props.account && !this.props.member.crowdsaleClosed && enableInvest && this.props._lcInvestInObject(this.props.member.objectID || (this.props.event && this.props.event.returnValues && this.props.event.returnValues.objectID), this.state.ethInvest || "0", this.props.account)
                                                }} ></span>
                                                {/* <span className="flaticon-lock unlock"></span>  */}
                                                {/* <span className="minusBal">Pending</span> */}

                                                {this.props.investInObjectTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.investInObjectTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.investInObjectTxID)) ? <p className="p-euro" style={{ color: "green", fontSize: "18px", fontWeight: "600", marginLeft: "0", marginTop: "0" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Pending</p>}</Link>)}
                                                {this.props.BuyAndActivate && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.BuyAndActivateTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.BuyAndActivateTxID)) ? <p className="p-euro" style={{ ccolor: "green", fontSize: "18px", fontWeight: "600", marginLeft: "0", marginTop: "0" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Pending</p>}</Link>)}

                                                {/* <span className="confirmBal">Confirmed</span> */}
                                            </div>

                                            {/* <div className="arrowBtn">
                                                <img style={{ cursor: ((enableInvest && !this.props.member.crowdsaleClosed) || buyAndActivate) ? "pointer" : "not-allowed" }} onClick={() => {
                                                    buyAndActivate ?
                                                        this.state.activedate && this.props._lcBuyAndActivate(this.props.member.objectID, this.state.activedate, this.props.account)
                                                        : this.props.account && !this.props.member.crowdsaleClosed && enableInvest && this.props._lcInvestInObject(this.props.member.objectID || (this.props.event && this.props.event.returnValues && this.props.event.returnValues.objectID), this.state.ethInvest || "0", this.props.account)
                                                }} src={require('../assets/add.jpg')} alt="add2" />
                                            </div>
 */}


                                            {/* <div className="investAddStatus">

                                                {this.props.investInObjectTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.investInObjectTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.investInObjectTxID)) ? <p className="p-euro" style={{ color: "green" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red" }}>pending</p>}</Link>)}
                                                {this.props.BuyAndActivate && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.BuyAndActivateTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.BuyAndActivateTxID)) ? <p className="p-euro" style={{ color: "green" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red" }}>pending</p>}</Link>)}
                                            </div> */}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BlockUi>
                    </div>
                </Slide>
            </div>
            <div className={this.state.modalCondition ? "infoPop is-open" : "infoPop is-close"} >
                <span className="modalCloseBtn" onClick={() => this.modalClick()}>x</span>
                Vandaag 20 euro,
                morgen 19.99,
                overmorgen 19.98,
                over 3 jaar 10
                ...of 1 euro per uur
                    </div>
            <div className="footBtn container">
                <div className="container text-center">
                    <div className="beforeFooter">
                        <div className="col-3">
                            <button className="arrowBtn" onClick={this.doExit.bind(this)}>
                                <span className="flaticon-left-arrow"></span>
                            </button>
                        </div>
                        <div className="col-4 lh-54 text-left">
                            Ga Terug
                        </div>
                        <div className="col-5 text-left padding-10-0">
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
                        <span className="flaticon-youtube-logo"></span>
                    </div>
                </div>
                <div className="contact bg-grey textWhite">
                    <div className="container">
                        <span className="smallText">CONTACT</span>
                    </div>
                </div>
            </div>
            <div className={this.state.modalCondition ? "modalOverlay is-open" : "modalOverlay is-close"} onClick={() => this.modalClick()}></div>
        </div >
        )
    }
}

export default Invest