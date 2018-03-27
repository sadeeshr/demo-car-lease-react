import React, { Component } from 'react'
import BigNumber from 'bignumber.js';
import BlockUi from 'react-block-ui';
import { Link } from 'react-router-dom'

class Invest extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
    }


    componentWillMount() {
        console.log("Invest Props: ", this.props);
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
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.paySubscriptionTxID)
            nextProps._lcToClaimDividend(nextProps.member.carID, nextProps.account)

        let timeOut = 1000
        if (nextProps.eventClaim && !this.state.eventClaim) { this.setState({ eventClaim: nextProps.eventClaim, ethInvest: null }) }
        if (nextProps.eventTransfer && !this.state.eventTransfer) { this.setState({ eventTransfer: nextProps.eventTransfer, ethInvest: null }) }
        if (nextProps.eventApprove && !this.state.eventApprove) { this.setState({ eventApprove: nextProps.eventApprove, ethInvest: null }) }

        // this.setState({ refreshValues: !this.state.refreshValues })
        console.log("#### TOTAL SUPPLY: ######", nextProps.eventTransfer, this.props.totalSupply, nextProps.totalSupply);
        if (nextProps.eventTransfer || nextProps.eventApprove || nextProps.eventClaim)
            setTimeout(this.refreshValues, timeOut)

        if (this.props.totalSupply !== nextProps.totalSupply || this.props.allowance !== nextProps.allowance || this.props.unClaimedRedemption !== nextProps.unClaimedRedemption)
            this.props._resetEvent()

        this.props = nextProps
    }

    refreshValues = () => {
        // fetch Total Supply
        this.props._lcTotalSupply()

        // fetch Total Crowdsale Closed Objects
        this.props._lcAmountObjects()

        // fetch My Lease Tokens
        this.props._evBalanceOf(this.props.account)

        // fetch My Euro Tokens
        this.props._euroBalanceOf(this.props.account)

        // fetch My Allowance Value
        this.props._euroAllowance(this.props.account)

        // fetch Object ID's To Claim Dividend Value
        this.props._lcToClaimDividend(this.props.member.carID, this.props.account)

        // fetch Object ID's Values
        this.props._lcLeaseObjects(this.props.member.carID)

        // fetch Object ID's EVTokens
        this.props._evMyTokens(this.props.account, this.props.member.carID)

        if (!this.props.unClaimedRedemption) this.props._lcToClaimDividend(this.props.member.carID, this.props.account)
        if (!this.props.totalSupply) this.props._lcTotalSupply()
        if (!this.props.euroTokenBalance) this.props._euroBalanceOf(this.props.account)
        if (!this.props.evTokenBalance) this.props._evBalanceOf(this.props.account)
        if (!this.props.crowdsaleClosed) this.props._lcAmountObjects()
        if (!this.props.allowance) this.props._euroAllowance(this.props.account)
    }

    render() {
        console.log("#####", this.state, this.props);
        console.log("##### EVT", this.props.member ? this.props.member.evTokens : "no evtokens");
        if (this.props.account && !this.props[this.props.account]) this.props._getBalance(this.props.account);

        const amountRemaining = this.props.member.carPrice - this.props.member.car.totalRaised.toNumber()
        const allowedAmountToInvest = Math.min(Math.min(amountRemaining, this.props.allowance), this.props.euroTokenBalance)
        // const euroTokenBalance = this.props.euroTokenBalance ? (this.props.euroTokenBalance.length > 5 ? this.props.euroTokenBalance.substring(0, 5) + "..." : this.props.euroTokenBalance) : ""
        // (this.state.euroTokenBalance || "").substring(0, 8) + "..."
        const account = this.props.account ? this.props.account.substring(0, 7) + '.....' + this.props.account.substring(this.props.account.length - 5) : ""
        const hideInvest = (this.props.member && this.props.member.car.totalRaised.toNumber() >= this.props.member.carPrice) ? true : false
        const ethInvest = parseInt((this.state.ethInvest || "0"), 10)
        const enableInvest = ((ethInvest <= amountRemaining) && (ethInvest <= this.props.allowance) && (ethInvest <= this.props.euroTokenBalance) && (this.state.ethInvest !== "") && (this.state.ethInvest !== "0"))
        console.log("Enable Invest: ", ethInvest, enableInvest, (ethInvest <= amountRemaining), (ethInvest <= this.props.allowance), (ethInvest <= this.props.euroTokenBalance), (this.state.ethInvest !== ""));
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
                        <div className="fl">
                            <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                        </div>
                        Invest
                        <div className="fr">
                            <i title="Invoices" className="flaticon-invoice marIcon" onClick={() => this.props.history.push("/", { path: "invoices" })}></i>
                            <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                        </div></h1>
                </div>
                <div className="contentCon bg-none">
                    <BlockUi tag="div" blocking={this.props.progress}>
                        <div className="carIntestCon">
                            <div className="carCon">

                                <div className="carcol img">
                                    <img src={require('../assets/TeslaRoadster.png')} alt="cars" />
                                </div>
                                <div className="carcol">
                                    <div className="carTitle"><strong>Total raised: </strong></div>
                                    {/*<div className="carEth">{this.state.totalEthRaised || "0"} ETH</div>*/}
                                    <div className="carEth"><strong>{this.props.totalSupply || "0"}</strong> Euro</div>
                                    {<div className="carPrice"><strong>{this.props.crowdsaleClosed || "0"}</strong> cars</div>}
                                </div>
                            </div>
                            <div className="carCon">

                                <div className="myaccount">
                                    {/*!this.state.eths && <div className="carTitle">"Click On Device"</div>*/}
                                    {!this.props.account && <div className="carTitle">Please Unlock Your Metamask Account.</div>}
                                    {this.state.eth && <div className="carTitle">{this.state.eth}</div>}
                                    {this.state.ethBal && <div className="carEth">{this.state.ethBal} ETH</div>}
                                    {this.props.account &&
                                        <div>

                                            <div className="mad1">
                                                <div className="carTitle"><strong>My Account: </strong></div>
                                                <div className="carPrice"><u>{account || ""}</u></div>
                                            </div>
                                            <div className="mad2 ledgerImg">
                                                <img hidden={Array.isArray(this.state.eths) ? true : false} onClick={() => {/*this.connectLedger.bind(this)*/ }} src={require('../assets/ledgernanos2.png')} alt="ledger" />
                                            </div>



                                            {/*<div className="carPrice">{this.props[this.props.account] || ""} ETH</div>*/}
                                            <div className="mad3 carPrice"><strong>{this.props.evTokenBalance || "0"}</strong> LeaseTokens</div>
                                            <div className="mad4 carPrice"><strong>{this.props.euroTokenBalance || "0"}</strong> EuroTokens</div>
                                        </div>
                                    }
                                    {
                                        Array.isArray(this.state.eths) ?
                                            <select onChange={(e) => e.target.value !== "" && this.setState({ eth: this.state.eths[e.target.value].account, ethBal: new BigNumber(this.state.eths[e.target.value].balance, 10).mul(1).round(0, BigNumber.ROUND_DOWN).div(1000000000000000000).toString(10) })}>
                                                <option value="" >Select</option>
                                                {
                                                    this.state.eths.map((eth, i) => {
                                                        return <option key={i} value={i}>{eth.account.substring(0, 7) + '.....' + eth.account.substring(eth.account.length - 5)} Balance: {new BigNumber(eth.balance, 10).mul(1).round(0, BigNumber.ROUND_DOWN).div(1000000000000000000).toString(10)}</option>
                                                    })
                                                }
                                            </select> :
                                            this.state.eths ? this.state.eths + ".  Please check your device." : ""
                                    }
                                </div>

                                <div hidden={hideInvest} className="">
                                    <div className="carTitle investInput">
                                        <div className="arrowBtn">
                                            <img onClick={() => { this.state.authValue && this.props._euroApprove(this.state.authValue, this.props.account) }} src={require('../assets/add.jpg')} alt="add2" />
                                        </div>
                                        <input className="membership-input" maxLength="20" value={this.state.authValue || this.props.allowance || 0} onChange={(e) => this.setState({ authValue: e.target.value })} type="text" placeholder="Authorize Value" />
                                        Authorized
                                        {this.props.approveTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.approveTxID}>{!this.state.eventApprove ? <p style={{ color: "red" }}>pending</p> : <p style={{ color: "green" }}><i>Confirmed</i></p>}</Link>)}
                                    </div>
                                </div>
                            </div>
                            <div className="carCon active">

                                <div className="mtableLink">
                                    <div className="mtableTokens" title="Car ID">{this.props.member.car.totalRaised.toNumber() || ""} <p title="EVTokens">{this.props.member.evTokens}</p></div>
                                    <div className="mtableUser">{this.props.member.username || ""}<p>{this.props.member.municipality || ""}</p></div>
                                    <div className="mtableCar">
                                        <img src={this.props.member.carPic || ""} alt="carImage" />
                                        <span title="Price" style={{ fontSize: "12px" }}>Euro {this.props.member.carPrice || "0"}</span>
                                    </div>
                                </div>

                                {/* <div hidden={hideInvest} className="carcol img arrowBtn">
                                    <img onClick={() => this.props._lcInvestInObject(this.props.member.carID, this.state.ethInvest || "0", this.props.account)} src={require('../assets/add.jpg')} alt="add" />
                                </div> */}
                                <div hidden={hideInvest} className="">
                                    <div className="carTitle investInput">
                                        <div className="arrowBtn">
                                            <img style={{ cursor: enableInvest ? "pointer" : "not-allowed" }} onClick={() => enableInvest && this.props._lcInvestInObject(this.props.member.carID, this.state.ethInvest || "0", this.props.account)} src={require('../assets/add.jpg')} alt="add2" />
                                        </div>
                                        Invest Euro:
                                        <input className="membership-input" maxLength="20" value={(typeof this.state.ethInvest === 'undefined') ? (allowedAmountToInvest || 0) : this.state.ethInvest} onChange={(e) => this.setState({ ethInvest: e.target.value })} type="text" placeholder="Euro Token" />
                                        {this.props.investInObjectTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.investInObjectTxID}>{!this.state.eventTransfer ? <p style={{ color: "red" }}>pending</p> : <p style={{ color: "green" }}><i>Confirmed</i></p>}</Link>)}
                                    </div>
                                </div>
                                <div className="carTitle investInput">
                                    <div className="arrowBtn">
                                        <img style={{ cursor: (this.props.unClaimedRedemption > 0) ? "pointer" : "not-allowed" }} onClick={() => { (this.props.unClaimedRedemption > 0) && this.props._lcClaimDividend(this.props.member.carID, this.props.account) }} src={require('../assets/add.jpg')} alt="add2" />
                                    </div>
                                    Claim Euro: {this.props.unClaimedRedemption || "0"}
                                    <div className="claim-euro">
                                        {this.props.claimDividendTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.claimDividendTxID}>{!this.state.eventClaim ? <p style={{ color: "red" }}>pending</p> : <p style={{ color: "green" }}><i>Confirmed</i></p>} </Link>)}
                                    </div>
                                </div>
                            </div>



                            {this.state.txId && <div className="carCon">
                                <div className="carcol">
                                    <div className="carTitle">Transaction ID:</div>
                                    <div className="carEth">{this.state.txId}</div>
                                    <div className="carPrice"><a target="_blank" href={"https://rinkbey.etherscan.io/tx/" + this.state.txId}>Check Transaction </a></div>
                                </div>
                            </div>}

                        </div>
                    </BlockUi>
                </div>
            </div>
        </div>
        )
    }
}

export default Invest