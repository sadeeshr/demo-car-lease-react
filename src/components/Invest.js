import React, { Component } from 'react'
import BigNumber from 'bignumber.js';
import ReactLoading from 'react-loading';
import util from 'util';

class Invest extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.carID = null
    }


    componentWillMount() {
        console.log(this.props);
    }

    componentDidMount() {
        this.carID = this.props.member.carID
        if (!this.state.unClaimedRedemption)
            this.readInvestorToClaim()

        this.fetchCar()     // we check the details for carID from Smart Contract cars(carId)

        if (!this.state.totalAmountRaised)
            this.fetchTotalAmountRaised()
    }

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
        this.props.contract.totalAmountRaised()
            .then(result => {
                console.log(result);
                console.log(util.inspect(result[0].toNumber(), false, null))
                this.setState({ totalAmountRaised: result[0].toNumber() })
            })
    }

    fetchCar = () => {
        this.props.contract.cars(this.carID)
            .then(car => {
                console.log("CAR EXISTS ? ", util.inspect(car[0], false, null))
                console.log(`Details of CAR ID ${this.carID} => `, car)
            })
    }

    raiseFundsForCar = () => {
        this.props.contract.raiseFundsForCar(this.carID, this.state.ethInvest || "0", { from: this.props.account })
            .then(result => console.log("raiseFundsForCar RESULT: ", result))
    }

    buyCarWhenFundsRaised = () => {
        this.props.contract.buyCarWhenFundsRaised(this.carID)
            .then(result => console.log("buyCarWhenFundsRaised RESULT: ", result))
    }

    payInterestAndRedemption = () => {
        this.props.contract.payInterestAndRedemption(this.carID, this.state.month || "0", this.state.milege || "0")
            .then(result => console.log("buyCarWhenFundsRaised RESULT: ", result))
    }

    readInvestorToClaim = () => {
        // const investorAddress = "0x0BA9F1b34681255664C26543AD451658f8d1AAdB"   // for testing
        this.props.contract.readInvestorToClaim(this.props.account, this.carID)
            .then(result => {
                console.log(result);
                console.log(util.inspect(result[0].toNumber(), false, null))
                this.setState({ unClaimedRedemption: result[0].toNumber() })
            })
    }

    claimInterestAndRedemption = () => {
        this.props.contract.claimInterestAndRedemption(this.carID, { from: this.props.account })
            .then(result => console.log("claimInterestAndRedemption RESULT: ", result))
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

        const cars = this.props[this.props.module].cars || []

        return (
            <div>
                <h1 id="header">Invest</h1>
                <div className="carIntestCon">
                    <div className="carCon">

                        <div className="carcol img">
                            <img src={require('../assets/TeslaRoadster.png')} alt="cars" />
                        </div>
                        <div className="carcol">
                            <div className="carTitle">Total raised: {this.state.totalAmountRaised || "0"}</div>
                            <div className="carEth">1000 ETH</div>
                            <div className="carPrice">400 &#8364;</div>
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
                                    <div className="carPrice">{this.props.account || ""}</div>
                                    <div className="carPrice">{this.props[this.props.account] || ""} ETH</div>
                                    <div className="carPrice">1174 EVTokens</div>
                                    <div className="carPrice">{this.state.unClaimedRedemption} Claim ETH  <img onClick={() => { this.claimInterestAndRedemption(this.props.member.carID) }} src={require('../assets/add.png')} alt="add" /></div>
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
                            <div className="mtableTokens">{this.props.member.tokens || ""} <p>{this.props.member.earned || ""}</p></div>
                            <div className="mtableUser">{this.props.member.fullname || this.props.member.fname || ""}</div>
                            <div className="mtableCar"><img src={this.props.member.carPic || ""} alt="carImage" /></div>
                        </div>


                        <div className="carcol img">
                            <img onClick={() => this.raiseFundsForCar()} src={require('../assets/add.png')} alt="add" />
                        </div>
                        <div className="carcol">
                            <div className="carTitle">Invest in ETH:
                                <input className="membership-input" maxLength="20" onChange={(e) => this.setState({ ethInvest: e.target.value })} type="text" placeholder="ETH" />
                            </div>
                            <div className="carEth">Receive Tokens: <div className="carPrice">1000</div></div>

                        </div>

                    </div>



                    {this.state.txId && <div className="carCon">
                        <div className="carcol">
                            <div className="carTitle">Transaction ID:</div>
                            <div className="carEth">{this.state.txId}</div>
                            <div className="carPrice"><a target="_blank" href={"https://ropsten.etherscan.io/tx/" + this.state.txId}>Check Transaction </a></div>
                        </div>
                    </div>}

                </div>

            </div>
        )
    }
}

export default Invest