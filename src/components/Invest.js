import React, { Component } from 'react'
import BigNumber from 'bignumber.js';
import BlockUi from 'react-block-ui';

class Invest extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }


    componentWillMount() {
        console.log("Invest Props: ", this.props);
        this.setState({
            carID: this.props.member ? this.props.member.carID : null,
            car: this.props.member ? this.props.member.car : null,
            eventTransfer: this.props.eventTransfer === "pending" ? this.props.eventTransfer : null,
            eventClaim: this.props.eventClaim === "pending" ? this.props.eventClaim : null,
        })
    }

    componentDidMount() {

        if (!this.props.unClaimedRedemption)
            this.props._lcToClaimDividend(this.props.member.carID, this.props.account)

        // for (let i = 1; i <= this.props.members.length; i++) {
        //     // this.fetchCar(i)
        //     this.props._lcCars(i, i === this.carID ? true : false)
        // }
        // this.props._lcCars(this.carID)
        // this.fetchCar()     // we check the details for carID from Smart Contract cars(carId)

        if (!this.props.sumBalanceOf)
            this.props._lcSumBalanceOf(this.props.account)

        if (!this.props.euroTokenBalance) this.props._euroBalanceOf(this.props.account)
        if (!this.props.evTokenBalance) this.props._evBalanceOf(this.props.account)
        if (!this.props.crowdsaleClosed) this.props._lcAmountObjects()
        if (!this.props.allowance) this.props._euroAllowance(this.props.account)
        // if (!this.state["evToken_" + this.carID]) this.evTokenMyTokens()

        this.eventHandler()
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps
        if (this.props.paySubscriptionTxID)
            this.props._lcToClaimDividend(this.props.member.carID, this.props.account)
        if (this.props.eventClaim && !this.state.eventClaim) this.setState({ eventClaim: this.props.eventClaim })
        if (this.props.eventTransfer && !this.state.eventTransfer) this.setState({ eventTransfer: this.props.eventTransfer })
    }


    /**
     * COIN MARKETCAP API
     * ******************
     * To convert Euro to Eth
     */

    // convertEuroToEth = () => {
    //     const apiURL = "https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=EUR"
    //     fetch(apiURL)
    //         .then((resp) => resp.json())
    //         .then((data) => {
    //             console.log(data[0]);
    //             let euroBalToEthBal = this.props.sumBalanceOf / Number(data[0]["price_eur"])
    //             console.log("TotalEthRaised: ", euroBalToEthBal);
    //             this.setState({ totalEthRaised: euroBalToEthBal })
    //         })
    // }

    /**
     * EURO TOKEN METHODS:
     * *******************
     * balanceOf                 [IMPLEMENTED]
     */


    /**
     * EV TOKEN METHODS:
     * *******************
     * balanceOf                 [IMPLEMENTED]
     * myTokens                  [IMPLEMENTED]
     */

    // evTokenBalanceOf = () => {
    //     this.props.evToken.balanceOf(this.props.account)
    //         .then(result => {
    //             console.log("evTokenBalance: ", util.inspect(result[0].toString(), false, null))
    //             this.setState({ evTokenBalance: result[0].toString() })
    //         })
    // }


    /**
     * LEASE CONTRACT METHODS:
     * ***********************
     * AddNewCar                  [IMPLEMENTED]
     * raiseFundsForCar           [IMPLEMENTED]
     * buyCarWhenFundsRaised      [IMPLEMENTED  - UI PENDING]
     * payInterestAndRedemption   [IMPLEMENTED  - UI PENDING]
     * ClaimDividend [IMPLEMENTED]
     * ToClaimDividend        [IMPLEMENTED]
     */

    // fetchsumBalanceOf = () => {
    //     this.props.LeaseContract.sumBalanceOf()
    //         .then(result => {
    //             console.log("sumBalanceOf: ", util.inspect(result[0].toNumber(), false, null))
    //             this.setState({ sumBalanceOf: result[0].toNumber() })
    //             this.convertEuroToEth()
    //         })
    // }

    // fetchCar = (carID) => {
    //     this.props.LeaseContract.cars(carID)
    //         .then(car => {
    //             console.log("CAR EXISTS ? ", util.inspect(car[0], false, null))
    //             console.log(`Details of CAR ID ${carID} => `, car)
    //             console.log(`CROWD SALE STATUS: CAR ID ${carID} => `, car.crowdsaleClosed)
    //             if (car.crowdsaleClosed) {
    //                 this.setState({ crowdsaleClosed: this.state.crowdsaleClosed + 1 })
    //             }
    //             if (carID === this.carID)
    //                 this.props._carSelected(car)
    //         })
    // }

    // raiseFundsForCar = () => {
    //     this.setState({ progress: true })
    //     this.props.LeaseContract.raiseFundsForCar(this.carID, this.state.ethInvest || "0", { from: this.props.account })
    //         .then(result => { this.setState({ progress: false }); this.props.history.goBack(); console.log("raiseFundsForCar RESULT: ", result) })
    // }

    buyCarWhenFundsRaised = () => {
        this.props.LeaseContract.buyCarWhenFundsRaised(this.props.member.carID)
            .then(result => console.log("buyCarWhenFundsRaised RESULT: ", result))
    }

    // payInterestAndRedemption = () => {
    //     this.props.LeaseContract.payInterestAndRedemption(this.carID, this.state.month || "0", this.state.milege || "0")
    //         .then(result => console.log("buyCarWhenFundsRaised RESULT: ", result))
    // }

    // ToClaimDividend = () => {
    //     // const investorAddress = "0x0BA9F1b34681255664C26543AD451658f8d1AAdB"   // for testing
    //     this.props.LeaseContract.ToClaimDividend(this.props.account, this.carID)
    //         .then(result => {
    //             console.log("unClaimedRedemption: ", util.inspect(result[0].toString(), false, null))
    //             this.setState({ unClaimedRedemption: result[0].toString() })
    //         })
    // }

    // ClaimDividend = () => {
    //     this.setState({ progress: true })
    //     this.props.LeaseContract.ClaimDividend(this.carID, { from: this.props.account })
    //         .then(result => { this.setState({ progress: false }); console.log("ClaimDividend RESULT: ", result) })
    // }

    // Till Here

    eventHandler = () => {
        // const euroTokenTransferEvent = this.props.euroToken.Transfer().new((error, result) => {
        //     console.log("WATCH result: ", error, result, euroTokenTransferEvent);
        // });


        // const euroTokenApprovalEvent = this.props.euroToken.Approval().new((error, result) => { });
        // euroTokenApprovalEvent.watch().then((result) => {
        //     // result null FilterResult {...} (will only fire once)
        // });

        // const evTokenTransferEvent = this.props.evToken.Transfer().new((error, result) => { });
        // evTokenTransferEvent.watch().then((result) => {
        //     // result null FilterResult {...} (will only fire once)
        // });

        // const LeaseContractFundTransferEvent = this.props.LeaseContract.FundTransfer().new((error, result) => { });
        // LeaseContractFundTransferEvent.watch().then((result) => {
        //     // result null FilterResult {...} (will only fire once)
        // });

        //   euroTokenTransferEvent.uninstall((error, result) => {
        //     // result null Boolean filterUninstalled
        //   });
    }

    sendTransaction = () => {
        // this.setState({ progress: true })
        // ledgerApi.genRawTransaction(this.props.member.id, this.state.eth, this.state.ethInvest, (txId) => {
        //     console.log("Transaction ID: ", txId.result)
        //     this.setState({ txId: txId.result, progress: false })
        // })
    }

    render() {
        console.log("#####", this.state);
        if (this.props.account && !this.props[this.props.account]) this.props._getBalance(this.props.account);

        const euroTokenBalance = this.props.euroTokenBalance ? (this.props.euroTokenBalance.length > 5 ? this.props.euroTokenBalance.substring(0, 5) + "..." : this.props.euroTokenBalance) : ""
        // (this.state.euroTokenBalance || "").substring(0, 8) + "..."
        const account = this.props.account ? this.props.account.substring(0, 7) + '.....' + this.props.account.substring(this.props.account.length - 5) : ""
        const hideInvest = (this.props.member && this.props.member.car.totalRaised.toNumber() >= this.props.member.carPrice) ? true : false
        const ethInvest = parseInt(this.state.ethInvest || "0", 10)
        const disableInvest = ((ethInvest < (this.props.member.carPrice - this.props.member.car.totalRaised.toNumber())) && (ethInvest < this.props.allowance) && (ethInvest < this.props.euroTokenBalance) && (ethInvest > 0)) ? false : true
        console.log("Disable Invest: ", disableInvest, (ethInvest < (this.props.member.carPrice - this.props.member.car.totalRaised.toNumber())), (ethInvest < this.props.allowance), (ethInvest < this.props.euroTokenBalance));
        // (this.props.account || "").substring(0, 8) + "..."
        return (
            <div className="mainContentCon">
                <div className="navCon">
                    <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">
                        <i title="Invoices" className="flaticon-invoice" onClick={() => this.props.history.push("/", { path: "invoices" })}></i>
                        <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                    </div>
                </div>
                <div className="contentCon">
                    <BlockUi tag="div" blocking={this.props.progress}>
                        <h1 id="header">Invest</h1>
                        <div className="carIntestCon">
                            <div className="carCon">

                                <div className="carcol img">
                                    <img src={require('../assets/TeslaRoadster.png')} alt="cars" />
                                </div>
                                <div className="carcol">
                                    <div className="carTitle">Total raised: </div>
                                    {/*<div className="carEth">{this.state.totalEthRaised || "0"} ETH</div>*/}
                                    <div className="carEth">{this.props.sumBalanceOf || "0"} Euro</div>
                                    {<div className="carPrice">{this.props.crowdsaleClosed || "0"} cars</div>}
                                </div>
                            </div>
                            <div className="carCon">

                                <div className="carcol">
                                    {/*!this.state.eths && <div className="carTitle">"Click On Device"</div>*/}
                                    {!this.props.account && <div className="carTitle">Please Unlock Your Metamask Account.</div>}
                                    {this.state.eth && <div className="carTitle">{this.state.eth}</div>}
                                    {this.state.ethBal && <div className="carEth">{this.state.ethBal} ETH</div>}
                                    {this.props.account &&
                                        <div>
                                            <div className="carTitle">My Account: </div>
                                            <div className="carPrice">{account || ""}</div>
                                            {/*<div className="carPrice">{this.props[this.props.account] || ""} ETH</div>*/}
                                            <div className="carPrice">{this.props.evTokenBalance || "0"} EVTokens</div>
                                            <div className="carPrice">{euroTokenBalance || "0"} Euro</div>
                                            <div hidden={hideInvest} className="carcol">
                                                <div className="carTitle">
                                                    <input className="membership-input" maxLength="20" value={this.state.authValue || this.props.allowance || ""} onChange={(e) => this.setState({ authValue: e.target.value })} type="text" placeholder="Authorize Value" />
                                                    Authorized
                                                    <div className="carcol img">
                                                        <img onClick={() => { this.state.authValue && this.props._euroApprove(this.state.authValue, this.props.account) }} src={require('../assets/add.png')} alt="add2" />
                                                    </div>
                                                </div>
                                            </div>
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
                                <div className="carcol img">
                                    <img hidden={Array.isArray(this.state.eths) ? true : false} onClick={() => {/*this.connectLedger.bind(this)*/ }} src={require('../assets/ledgernanos.png')} alt="ledger" />
                                </div>
                            </div>
                            <div className="carCon active">

                                <div className="mtableLink">
                                    <div className="mtableTokens" title="Car ID">{this.props.member.car.totalRaised.toNumber() || ""} <p title="EVTokens">{this.props.member.evTokens}</p></div>
                                    <div className="mtableUser">{this.props.member.username || ""}<p>{this.props.member.state || ""}</p></div>
                                    <div className="mtableCar">
                                        <img src={this.props.member.carPic || ""} alt="carImage" />
                                        <span title="Price" style={{ fontSize: "10px" }}>Euro {this.props.member.carPrice || "0"}</span>
                                    </div>
                                </div>

                                <div hidden={hideInvest} className="carcol img">
                                    <img style={{ cursor: disableInvest ? "not-allowed" : "pointer" }} onClick={() => !disableInvest && this.props._lcInvestInObject(this.props.member.carID, this.state.ethInvest || "0", this.props.account)} src={require('../assets/add.png')} alt="add" />
                                </div>
                                <div hidden={hideInvest} className="carcol">
                                    <div className="carTitle">Invest Euro:
                            <input className="membership-input" maxLength="20" value={(typeof this.state.ethInvest === 'undefined') ? euroTokenBalance : this.state.ethInvest} onChange={(e) => this.setState({ ethInvest: e.target.value })} type="text" placeholder="Euro Token" />
                                        {this.props.investInObjectTxID && (!this.state.eventTransfer ? <p style={{ color: "red" }}>pending</p> : <p style={{ color: "green" }}><i>Confirmed</i></p>)}
                                    </div>
                                </div>
                                <div className="carcol img">
                                    <img style={{ cursor: (this.props.unClaimedRedemption > 0) ? "pointer" : "not-allowed" }} onClick={() => { (this.props.unClaimedRedemption > 0) && this.props._lcClaimDividend(this.props.member.carID, this.props.account) }} src={require('../assets/add.png')} alt="add2" />
                                </div>
                                <div className="carcol">
                                    <div className="carTitle">Claim Euro: {this.props.unClaimedRedemption || "0"}</div>
                                    {this.props.claimDividendTxID && (!this.state.eventClaim ? <p style={{ color: "red" }}>pending</p> : <p style={{ color: "green" }}><i>Confirmed</i></p>)}
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
        )
    }
}

export default Invest