import React, { Component } from 'react'
import BigNumber from 'bignumber.js';
import ReactLoading from 'react-loading';
import util from 'util';
import BlockUi from 'react-block-ui';

class Invest extends Component {

    constructor(props) {
        super(props)
        this.state = { crowdsaleClosed: 0, progress: false }
        this.carID = null
    }


    componentWillMount() {
        console.log(this.props);
    }

    componentDidMount() {
        this.carID = this.props.member.carID
        if (!this.state.unClaimedRedemption)
            this.readInvestorToClaim()

        for (let i = 1; i <= this.props.members.length; i++) {
            this.fetchCar(i)
        }

        // this.fetchCar()     // we check the details for carID from Smart Contract cars(carId)

        if (!this.state.totalAmountRaised)
            this.fetchTotalAmountRaised()

        if (!this.props.euroTokenBalance) this.props._euroBalanceOf(this.props.account)
        if (!this.props.evTokenBalance) this.props._evBalanceOf(this.props.account)
        // if (!this.state["evToken_" + this.carID]) this.evTokenMyTokens()

        this.eventHandler()
    }

    /**
     * COIN MARKETCAP API
     * ******************
     * To convert Euro to Eth
     */

    convertEuroToEth = () => {
        const apiURL = "https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=EUR"
        fetch(apiURL)
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data[0]);
                let euroBalToEthBal = this.state.totalAmountRaised / Number(data[0]["price_eur"])
                console.log("TotalEthRaised: ", euroBalToEthBal);
                this.setState({ totalEthRaised: euroBalToEthBal })
            })
    }

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
     * claimInterestAndRedemption [IMPLEMENTED]
     * readInvestorToClaim        [IMPLEMENTED]
     */

    fetchTotalAmountRaised = () => {
        this.props.LeaseContract.totalAmountRaised()
            .then(result => {
                console.log("totalAmountRaised: ", util.inspect(result[0].toNumber(), false, null))
                this.setState({ totalAmountRaised: result[0].toNumber() })
                this.convertEuroToEth()
            })
    }

    fetchCar = (carID) => {
        this.props.LeaseContract.cars(carID)
            .then(car => {
                console.log("CAR EXISTS ? ", util.inspect(car[0], false, null))
                console.log(`Details of CAR ID ${carID} => `, car)
                console.log(`CROWD SALE STATUS: CAR ID ${carID} => `, car.crowdsaleClosed)
                if (car.crowdsaleClosed) {
                    this.setState({ crowdsaleClosed: this.state.crowdsaleClosed + 1 })
                }
                if (carID === this.carID)
                    this.props._carSelected(car)
            })
    }

    raiseFundsForCar = () => {
        this.setState({ progress: true })
        this.props.LeaseContract.raiseFundsForCar(this.carID, this.state.ethInvest || "0", { from: this.props.account })
            .then(result => { this.setState({ progress: false }); this.props.history.goBack(); console.log("raiseFundsForCar RESULT: ", result) })
    }

    buyCarWhenFundsRaised = () => {
        this.props.LeaseContract.buyCarWhenFundsRaised(this.carID)
            .then(result => console.log("buyCarWhenFundsRaised RESULT: ", result))
    }

    payInterestAndRedemption = () => {
        this.props.LeaseContract.payInterestAndRedemption(this.carID, this.state.month || "0", this.state.milege || "0")
            .then(result => console.log("buyCarWhenFundsRaised RESULT: ", result))
    }

    readInvestorToClaim = () => {
        // const investorAddress = "0x0BA9F1b34681255664C26543AD451658f8d1AAdB"   // for testing
        this.props.LeaseContract.readInvestorToClaim(this.props.account, this.carID)
            .then(result => {
                console.log("unClaimedRedemption: ", util.inspect(result[0].toString(), false, null))
                this.setState({ unClaimedRedemption: result[0].toString() })
            })
    }

    claimInterestAndRedemption = () => {
        this.setState({ progress: true })
        this.props.LeaseContract.claimInterestAndRedemption(this.carID, { from: this.props.account })
            .then(result => { this.setState({ progress: false }); console.log("claimInterestAndRedemption RESULT: ", result) })
    }

    // Till Here

    eventHandler = () => {
        const euroTokenTransferEvent = this.props.euroToken.Transfer().new((error, result) => {
            console.log("WATCH result: ", error, result, euroTokenTransferEvent);
        });


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
        if (this.props.account && !this.props[this.props.account]) this.props._getBalance(this.props.account);

        const euroTokenBalance = this.props.euroTokenBalance ? (this.props.euroTokenBalance.length > 5 ? this.props.euroTokenBalance.substring(0, 5) + "..." : this.props.euroTokenBalance) : ""
        // (this.state.euroTokenBalance || "").substring(0, 8) + "..."
        const account = this.props.account ? this.props.account.substring(0, 7) + '.....' + this.props.account.substring(this.props.account.length - 5) : ""
        // (this.props.account || "").substring(0, 8) + "..."
        return (
            <div className="mainContentCon">
                <div className="navCon">
                    <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">
                        <i title="Invoices" className="flaticon-invoice" onClick={() => this.props.history.push("/invoices")}></i>
                        <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                    </div>
                </div>
                <div className="contentCon">
                    <BlockUi tag="div" blocking={this.state.progress}>
                        <h1 id="header">Invest</h1>
                        <div className="carIntestCon">
                            <div className="carCon">

                                <div className="carcol img">
                                    <img src={require('../assets/TeslaRoadster.png')} alt="cars" />
                                </div>
                                <div className="carcol">
                                    <div className="carTitle">Total raised: </div>
                                    {/*<div className="carEth">{this.state.totalEthRaised || "0"} ETH</div>*/}
                                    <div className="carEth">{this.state.totalAmountRaised || "0"} Euro</div>
                                    {<div className="carPrice">{this.state.crowdsaleClosed} cars</div>}
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
                                            <div className="carPrice">{euroTokenBalance || "0"} Euro</div>
                                            <div className="carPrice">{this.props.evTokenBalance || "0"} EVTokens</div>
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
                                    <div className="mtableTokens">{this.props.member.carID || ""} <p>{this.props.evTokens ? this.props.evTokens[this.props.member.carID] || "" : ""}</p></div>
                                    <div className="mtableUser">{this.props.member.fullname || ""}</div>
                                    <div className="mtableCar"><img src={this.props.member.carPic || ""} alt="carImage" /></div>
                                </div>

                                <div className="carcol img">
                                    <img onClick={() => this.raiseFundsForCar()} src={require('../assets/add.png')} alt="add" />
                                </div>
                                <div className="carcol">
                                    <div className="carTitle">Invest Euro, receive EVTokens:
                            <input className="membership-input" maxLength="20" value={this.state.ethInvest || euroTokenBalance} onChange={(e) => this.setState({ ethInvest: e.target.value })} type="text" placeholder="Euro Token" />
                                    </div>
                                </div>
                                <div className="carcol img">
                                    <img onClick={() => { this.claimInterestAndRedemption(this.props.member.carID) }} src={require('../assets/add.png')} alt="add2" />
                                </div>
                                <div className="carcol">
                                    <div className="carTitle">Claim Euro: {this.state.unClaimedRedemption}</div>
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