import React, { Component } from 'react'
import BigNumber from 'bignumber.js';
import BlockUi from 'react-block-ui';
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade';

class Invest extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.confTimer = null
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
    }


    componentWillMount() {
        // console.log("Invest Props: ", this.props);
        this.setState({
            carID: this.props.member ? this.props.member.carID : null,
            car: this.props.member ? this.props.member.car : null,
            eventTransfer: null,
            eventApprove: null,
            eventClaim: null,
            refreshValues: false
        })
    }

    componentWillUnmount() {
        this.props._resetTxIds()
    }

    componentDidMount() {
        this.refreshValues()
        // setTimeout(() => this.props._lcInvestInObject(this.props.member.carID, "10", this.props.account), 5000);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.paySubscriptionTxID)
            nextProps._lcToClaimDividend(nextProps.member.carID, nextProps.account)

        // let timeOut = 1000
        if (nextProps.eventClaim && !this.state.eventClaim) { this.setState({ eventClaim: nextProps.eventClaim, ethInvest: null }) }
        if (nextProps.eventApprove && !this.state.eventApprove) { this.setState({ eventApprove: nextProps.eventApprove, ethInvest: null }) }

        if (!this.props.unClaimedRedemption) this.props._lcToClaimTotal(this.props.account)
        if (!this.props.euroTokenBalance) this.props._euroBalanceOf(this.props.account)

        // this.setState({ refreshValues: !this.state.refreshValues })
        // console.log("#### TOTAL SUPPLY: ######", nextProps.eventTransfer, this.props.totalSupply, nextProps.totalSupply, this.props.hashConfirmations);
        if (nextProps.eventTransfer || nextProps.eventApprove || nextProps.eventClaim)
            if (!this.props.hashConfirmations) this.props._getConfirmationsHash(this.props.investInObjectTxID)

        if (this.props.hashConfirmations && this.props.hashConfirmations > 0) {
            // clearInterval(this.confTimer)
            // console.log("HASH CONFIRMS: ", this.props.hashConfirmations);
            // this.refreshValues()
        }

        // if (this.props.totalSupply !== nextProps.totalSupply || this.props.allowance !== nextProps.allowance || this.props.unClaimedRedemption !== nextProps.unClaimedRedemption) {
        // this.props._resetEvent() //temporary
        if (nextProps.eventTransfer && !this.state.eventTransfer) { this.setState({ eventTransfer: nextProps.eventTransfer, ethInvest: undefined }) }
        // }
        this.props = nextProps
    }

    refreshValues = () => {
        // fetch Total Supply
        this.props._lcTotalSupply()

        // fetch Total Crowdsale Closed Objects
        // this.props._lcAmountObjects()

        // fetch My Lease Tokens
        this.props._evBalanceOf(this.props.account)

        // fetch My Euro Tokens
        this.props._euroBalanceOf(this.props.account)

        // fetch My Allowance Value
        this.props._euroAllowance(this.props.account)

        // fetch Object ID's To Claim Dividend Value
        this.props._lcToClaimTotal(this.props.account)

        // fetch Object ID's Values
        this.props._lcLeaseObject(this.props.member.carID)

        // fetch Object ID Cycle's Values
        this.props._lcLeaseObjectCycle(this.props.member.carID)

        // fetch Object ID Redemption's Values
        this.props._lcLeaseObjectRedemption(this.props.member.carID)

        // fetch Object ID's EVTokens
        this.props._evMyTokens(this.props.account, this.props.member.carID)

        if (!this.props.unClaimedRedemption) this.props._lcToClaimTotal(this.props.account)
        if (!this.props.totalSupply) this.props._lcTotalSupply()
        if (!this.props.euroTokenBalance) this.props._euroBalanceOf(this.props.account)
        if (!this.props.evTokenBalance) this.props._evBalanceOf(this.props.account)
        // if (!this.props.crowdsaleClosed) this.props._lcAmountObjects()
        if (!this.props.allowance) this.props._euroAllowance(this.props.account)
    }

    render() {
        // console.log("#####", this.state, this.props);
        // console.log("##### EVT", this.props.member ? this.props.member.evTokens : "no evtokens");
        if (this.props.account && !this.props[this.props.account]) this.props._getBalance(this.props.account);

        const amountRemaining = this.props.member.carPrice - this.props.member.totalRaised
        // const allowedAmountToInvest = Math.min(Math.min(amountRemaining, this.props.allowance), this.props.euroTokenBalance)
        // const euroTokenBalance = this.props.euroTokenBalance ? (this.props.euroTokenBalance.length > 5 ? this.props.euroTokenBalance.substring(0, 5) + "..." : this.props.euroTokenBalance) : ""
        // (this.state.euroTokenBalance || "").substring(0, 8) + "..."
        const account = this.props.account ? this.props.account.substring(0, 7) + '.....' + this.props.account.substring(this.props.account.length - 5) : ""
        const hideInvest = (this.props.member && this.props.member.totalRaised >= this.props.member.carPrice) ? true : false
        const ethInvest = parseInt((this.state.ethInvest || "0"), 10)
        const enableInvest = ((ethInvest <= amountRemaining) && (ethInvest <= this.props.allowance) && (ethInvest <= this.props.euroTokenBalance) && (this.state.ethInvest !== "") && (this.state.ethInvest !== "0"))
        // console.log("Enable Invest: ", ethInvest, enableInvest, (ethInvest <= amountRemaining), (ethInvest <= this.props.allowance), (ethInvest <= this.props.euroTokenBalance), (this.state.ethInvest !== ""));
        // (this.props.account || "").substring(0, 8) + "..."
        return (<div className="content-border">
            <div className="mainContentCon">
                {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                <div className="float-right">
                    <i title="Invoices" className="flaticon-invoice" onClick={() => this.props.history.push("/", { path: "invoices" })}></i>
                    <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                </div> */}
                <div className="navCon">
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
                <Fade left>
                    <div className="contentCon bg-none overflow">
                        <BlockUi tag="div" blocking={this.props.progress}>
                            <div className="carIntestCon">
                                <div className="membersCon">
                                    <div className="leaseCarCon invest">
                                        <div className="balance">
                                            <div className="balanceName">My Balance</div>
                                            <div className="balanceNum">{(this.props.euroTokenBalance + this.props.unClaimedRedemption)}<span> Euro</span></div>
                                        </div>
                                        <div className="mtableLink">
                                            <div className="mtableCar">
                                                <img src={this.props.member.carPic} alt="carImage" />
                                            </div>
                                            <div className="mtableTokens">{this.props.member.totalRaised}
                                                <p>{this.props.member.evTokens}</p>
                                            </div>
                                            <div className="mtableUser">{this.props.member.username}
                                                <p>{this.props.member.town}</p>
                                            </div>
                                            <div className="mtableMnd">{this.props.member.car.objectTerm.toNumber()} mnd
                                                        <p>{this.props.member.car.objectPrice.toNumber()} euro</p>
                                            </div>
                                        </div>
                                        <div className="investAddCon">
                                            <div className="arrowBtn">
                                                <img onClick={() => this.props._lcInvestInObject(this.props.member.carID, this.state.ethInvest || "0", this.props.account)} src={require('../assets/add.jpg')} alt="add2" />
                                            </div>
                                            <div className="investAddInput">
                                                <input value={(typeof this.state.ethInvest === 'undefined') ? 0 : this.state.ethInvest} onChange={(e) => this.setState({ ethInvest: e.target.value })} maxLength="20" type="text" placeholder="Euro Token" />
                                            </div>
                                            <div className="investAddStatus">
                                                <p>Invest Euro</p>
                                                {this.props.investInObjectTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.investInObjectTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.investInObjectTxID)) ? <p className="p-euro" style={{ color: "green" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red" }}>pending</p>}</Link>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BlockUi>
                    </div>
                </Fade>
                <div className="footCon">
                    <div className="arrowBtn back">
                        <img src={require('../assets/back.jpg')} onClick={() => this.props.history.goBack()} alt="back" />
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Invest