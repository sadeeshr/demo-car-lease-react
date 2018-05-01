import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import { Link } from 'react-router-dom'
import Slide from 'react-reveal/Slide';
import cc from '../lib/utils';

class Invoices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            mileage: 0,
            progress: false,
            month: null,
            year: null,
            reveal: false
        }
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }


    componentWillMount() {
        this.fetchInvoices()
        this.setState({ eventSubscription: null })
        // cc.log("Object Fees: ", this.props.member.car.objectFee.toNumber())
        // cc.log("Object Price: ", this.props.member.car.objectPrice.toNumber())
        // cc.log("Object Type: ", this.props.member.car.objectType.toNumber())
        // cc.log("Object paymonth: ", this.props.member.paymonth)
        // cc.log("Object milages: ", this.props.member.mileagesTotal)
        // cc.log("Object totalDividends: ", this.props.member.totalDividends)

        this.props._lcLeaseObject(this.props.member.carID)
        this.props._lcLeaseObjectCycle(this.props.member.carID)
        this.props._lcLeaseObjectRedemption(this.props.member.carID)

        if (!this.props.unClaimedRedemption) this.props._lcToClaimTotal(this.props.account)
        if (!this.props.euroTokenBalance) this.props._euroBalanceOf(this.props.account)

    }

    componentWillUnmount() {
        this.props._resetTxIds()
    }

    componentDidMount() {
        this.carID = this.props.member.carID
        // if (this.props.car) this.fetchCarMileagesRedemption()
        setTimeout(() => this.setState({ reveal: true }), 200);
    }

    fetchInvoices = () => {
        let data = {
            module: "invoices",
            result: "invoicesdev",
            query: {
                module: this.props.location.state.module,
                carID: this.props.member.carID
            },
            filter: {
                // _id: 0
            }
        }
        this.props._fetchContractData(this.props.account, data)
    }

    createInvoice = () => {
        let data = {
            module: "invoices",
            result: "invoicesdev",
            data: {
                // module: this.props.location.state.module,
                carID: this.props.member.carID,
                year: this.state.year || (new Date()).getFullYear(),
                month: this.state.month ? this.state.month + 1 : (new Date()).getMonth(),
                mileage: this.state.mileage || 0,
                amount: this.state.amount || 0,
                status: false
            }
        }
        this.props._writeNewContractData(data)
    }

    updateInvoice = (invoice, mileage, amount) => {
        let data = {
            module: "invoices",
            result: "invoicesdev",
            query: { "_id": invoice["_id"] },
            data: {
                // module: invoice.module,
                carID: invoice.carID,
                year: invoice.year,
                month: invoice.month,
                mileage: mileage || 0,
                amount: amount || 0,
                status: true
            }
        }
        this.props._updateContractData(data)
    }

    fetchCarMileagesRedemption = () => {
        let car = this.props.car
        this.setState({ carMilages: car.milages.toNumber(), monthlyRedemption: car.objectFee.toNumber() })
    }

    componentWillReceiveProps(nextProps) {
        cc.log("new props", nextProps);
        if (nextProps.invoices_new || nextProps.invoices_edit)
            this.fetchInvoices()
        // if (nextProps.invoices && nextProps.invoices.length > 0) {
        //     this.setState({ month: this.getMaxMonth(nextProps.invoices), year: (new Date()).getFullYear() })
        // }
        if (nextProps.eventSubscription && !this.state.eventSubscription) { this.setState({ eventSubscription: nextProps.eventSubscription }) }

        if (!this.props.unClaimedRedemption) this.props._lcToClaimTotal(this.props.account)
        if (!this.props.euroTokenBalance) this.props._euroBalanceOf(this.props.account)

        if (nextProps.member && nextProps.member.car) {
            // cc.log("Object Fees: ", this.props.member.car.objectFee.toNumber())
            // cc.log("Object Price: ", this.props.member.car.objectPrice.toNumber())
            // cc.log("Object Type: ", this.props.member.car.objectType.toNumber())
            // cc.log("Object paymonth: ", this.props.member.paymonth)
            // cc.log("Object milages: ", this.props.member.mileagesTotal)
            // cc.log("Object totalDividends: ", this.props.member.totalDividends)
        }
    }

    getMaxMonth = (invoices) => {
        let max = invoices[0].month
        for (let i = 1; i < invoices.length; i++) {
            let v = invoices[i].month;
            max = (v > max) ? v : max;
        }
        return max
    }

    doExit = () => {
        this.setState({ reveal: false })
        setTimeout(() => {
            this.props.history.goBack()
        }, 300);
    }

    render() {
        cc.log("INVOICE State Props: ", this.state, this.props);
        const invoices = this.props.invoices ? this.props.invoices.filter(invoice => (this.months[invoice.month].toLowerCase().startsWith(this.state.filter) || invoice.year === parseInt(this.state.filter, 10))) : []
        invoices.sort((a, b) => parseFloat(b.month) - parseFloat(a.month))
        // const invoices = this.props.invoices
        let amount = (this.props.member.car.objectFee.toNumber()) + (((this.state.mileage || this.props.member.mileagesTotal) - this.props.member.mileagesTotal) * 0.10)
        // cc.log(amount, ' <= ', this.props.allowance, (amount <= this.props.allowance), this.state.mileage, ' >= ', this.props.member.mileagesTotal, (this.state.mileage >= this.props.member.mileagesTotal));
        const enableInvoice = ((this.state.mileage >= this.props.member.mileagesTotal) && (amount <= this.props.allowance)) ? true : false
        // cc.log("Invoice Enabled: ", enableInvoice);

        let invoicesRow = []

        // this.props.member.paymonth = 3
        for (var i = 0; i <= this.props.member.paymonth; i++) {
            invoicesRow.push(
                <div key={i} className="investAddCon">
                    <div className="arrowBtn" style={{ marginTop: "15%" }}>
                        <img onClick={() => this.props._lcPayFee(this.props.member.carID, this.props.account)} src={require('../assets/add.jpg')} alt="add2" />
                    </div>
                    <div className="investAddInput">
                        <p>{(new Date()).getUTCFullYear()} {this.months[(new Date()).getMonth()]}</p>
                        <p>{this.props.member.mileagesAverage} km stand</p>
                        <p>{this.props.member.car.objectFee.toNumber()} Euro</p>
                    </div>
                    <div className="investAddStatus">
                        {this.props.payFeeTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.payFeeTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.payFeeTxID)) ? <p className="p-euro" style={{ color: "green" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red" }}>pending</p>}</Link>)}
                    </div>
                </div>
            )
        }


        return (<div className="content-border">
            <div className="mainContentCon">
                {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                <div className="float-right">
                    <i title="Add Invoice" className="flaticon-invoice" onClick={this.createInvoice.bind(this)}></i>
                    <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                </div> */}
                <div className="navCon">
                    <h1 id="header">
                        <div hidden className="fl"><i className="flaticon-back" onClick={() => this.props.history.goBack()}></i></div>
                        Invoices
                        <div hidden className="fr">
                            <i title="Add Invoice" className="flaticon-invoice marIcon" onClick={this.createInvoice.bind(this)}></i>
                            <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                        </div>
                    </h1>
                </div>
                <Slide top opposite when={this.state.reveal}>
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
                                        </div>
                                        {invoicesRow}
                                    </div>
                                </div>
                            </div>
                        </BlockUi>
                    </div>
                </Slide>
                <div className="footCon">
                    <div className="arrowBtn back">
                        <img src={require('../assets/back.jpg')} onClick={this.doExit.bind(this)} alt="back" />
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Invoices

// <div className="contentCon overflow bg-none">
//                     <BlockUi tag="div" blocking={this.props.progress}>
//                         <div className="nvoicesCon">
//                             {
//                                 invoices && invoices.map((invoice, i) => {
//                                     return <div key={i} className="mtableLink">
//                                         <div className="mtableInvoices">
//                                             <div className="inDate"><span className="inLeft">{invoice.year}</span><span className="inRight">{this.months[invoice.month]}</span></div>
//                                             <div className="inKm">
//                                                 {
//                                                     invoice.mileage === 0 ?
//                                                         <span className="inLeft"><input style={{ width: "80px", textAlign: "center" }} maxLength="20" value={this.state.mileage || this.props.member.mileagesTotal} onChange={(e) => this.setState({ mileage: e.target.value })} type="text" placeholder="Mileage" /></span>
//                                                         : <span className="inLeft">{invoice.mileage}</span>
//                                                 }
//                                                 <span className="inRight">km stand</span></div>
//                                             <div className="inCost"><span className="inLeft" title="Includes Monthy-Fee and Running-Cost">{invoice.amount > 0 ? invoice.amount : (amount > 0 ? amount : 0)} </span><span className="inRight">Euro</span></div>
//                                         </div>
//                                         <div className="mtableInvoicesIcon">
//                                             {
//                                                 invoice.status ?
//                                                     <div className="arrowBtn"><img src={require('../assets/check.jpg')} alt="Payed" /></div>
//                                                     : <div title={!(amount <= this.props.allowance) ? "Less Allowance Set" : (!(this.state.mileage >= this.props.member.mileagesTotal) ? "Mileage Too Low" : "Pay Invoice")} className="arrowBtn">
//                                                         <img style={{ cursor: enableInvoice ? "pointer" : "not-allowed" }}
//                                                             onClick={() => {
//                                                                 enableInvoice && this.props._lcPaySubscription(this.props.member.carID, (this.props.member.paymonth + 1), parseInt(this.state.mileage, 10), this.props.account)
//                                                                 enableInvoice && this.updateInvoice(invoice, this.state.mileage, amount || 0)
//                                                             }}
//                                                             src={require('../assets/add.jpg')}
//                                                             alt="Ether" />
//                                                         {this.props.paySubscriptionTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.paySubscriptionTxID}>{!this.state.eventSubscription ? <p className="p-ip" style={{ color: "red" }}>pending</p> : <p className="p-ic" style={{ color: "green" }}><i>Confirmed</i></p>}</Link>)}
//                                                     </div>}
//                                         </div>
//                                     </div>
//                                 })
//                             }
//                         </div>
//                         {/*
//                             <div className="mtableInvoices">
//                                 <p>2017 Oktober</p>
//                                 <p>2500 km stand 550 Euro</p>
//                             </div>
//                             <div className="mtableInvoicesIcon">
//                                 <img src={require('../assets/Payed.png')} alt="Payed" />
//                             </div>
//                         </div>
//                         <div className="mtableLink">
//                             <div className="mtableInvoices">
//                                 <p>2017 November</p>
//                                 <p>5000 km stand 550 Euro</p>
//                             </div>
//                             <div className="mtableInvoicesIcon">
//                                 <img src={require('../assets/Payed.png')} alt="Payed" />
//                             </div>
//                        </div>*/}


//                         {/* <div className="contentBtn">
//                             <input className="searchBtn" type="text" name="filterMembers" value={this.state.filter || ""} placeholder="Search" onChange={(e) => { cc.log("SEARCH: ", e.target.value); this.setState({ filter: e.target.value }) }} />
//                         </div> */}
//                     </BlockUi>
//                 </div>
//                 <div className="footCon">
//                     <div>
//                         <input className="searchBtn" type="text" name="filterMembers" value={this.state.filter || ""} placeholder="Search" onChange={(e) => { this.setState({ filter: e.target.value }) }} />
//                     </div>
//                 </div>