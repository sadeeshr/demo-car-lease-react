import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import { Link } from 'react-router-dom'
import Slide from 'react-reveal/Slide';
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'

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
        // cc.log("Object Fees: ", this.props.member.obj.objectFee.toNumber())
        // cc.log("Object Price: ", this.props.member.obj.objectPrice.toNumber())
        // cc.log("Object Type: ", this.props.member.obj.objectType.toNumber())
        // cc.log("Object paymonth: ", this.props.member.paymonth)
        // cc.log("Object milages: ", this.props.member.mileagesTotal)
        // cc.log("Object totalDividends: ", this.props.member.totalDividends)

        // this.props._lcLeaseObject(this.props.member.objectID)
        // this.props._lcLeaseObjectCycle(this.props.member.objectID)
        // this.props._lcLeaseObjectRedemption(this.props.member.objectID)

        if (!this.props.unClaimedRedemption && this.props.account) this.props._lcToClaimTotal(this.props.account)
        if (!this.props.euroTokenBalance && this.props.account) this.props._euroBalanceOf(this.props.account)

    }

    componentWillUnmount() {
        this.props._resetTxIds()
    }

    componentDidMount() {
        this.objectID = this.props.member.objectID
        // this.props.member.leaseType = "Per Dag"   // for testing
        // if (this.props.car) this.fetchCarMileagesRedemption()
        setTimeout(() => this.setState({ reveal: true }), 200);
    }

    fetchInvoices = () => {
        let data = {
            module: "invoicesdev2",
            result: "invoices",
            query: {
                module: this.props.location.state.module,
                objectID: this.props.member.objectID
            },
            filter: {
                // _id: 0
            }
        }
        this.props._fetchContractData(this.props, data, this.props.account)
    }

    createInvoice = () => {
        let data = {
            module: "invoicesdev2",
            result: "invoices",
            data: {
                objectID: this.props.member.objectID,
                year: this.state.year || (new Date()).getFullYear(),
                month: this.state.month ? this.state.month + 1 : (new Date()).getMonth(),
                // mileage: this.state.mileage || 0,
                // amount: this.state.amount || 0,                
                status: false
            }
        }
        if (this.props.member.leaseType === "Per Dag")
            data.data["date"] = this.getFormattedDate()

        this.props._writeNewContractData(this.props, data)
    }

    updateInvoice = (invoice, tariff, nextTariff, mileage, total) => {
        let data = {
            module: "invoicesdev2",
            result: "invoices",
            query: { "_id": invoice["_id"] },
            data: {
                // module: invoice.module,
                objectID: invoice.objectID,
                year: invoice.year,
                month: invoice.month,
                mileage: mileage || 0,
                total: total || 0,
                status: true
            }
        }
        this.props._updateContractData(this.props, data)
    }

    fetchCarMileagesRedemption = () => {
        // let car = this.props.car
        // this.setState({ carMilages: car.milages.toNumber(), monthlyRedemption: car.objectFee.toNumber() })
    }

    getFormattedDate(date) {
        if (!date) date = new Date()
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return month + '/' + day + '/' + year;
    }

    componentWillReceiveProps(nextProps) {
        cc.log("new props", nextProps);
        if (nextProps.invoices_new || nextProps.invoices_edit)
            this.fetchInvoices()

        // if (this.props.event && (this.props.event.transactionHash === this.props.payFeeTxID)) {
        //     // this.updateInvoice(invoice)
        //     // this.fetchInvoices()
        // }



        if (nextProps.invoices) {
            if (nextProps.invoices.length > 0)
                this.setState({ month: this.getMaxMonth(nextProps.invoices), year: (new Date()).getFullYear() })
        }

        if (nextProps.eventSubscription && !this.state.eventSubscription) { this.setState({ eventSubscription: nextProps.eventSubscription }) }

        if (!this.props.unClaimedRedemption) this.props._lcToClaimTotal(this.props.account)
        if (!this.props.euroTokenBalance) this.props._euroBalanceOf(this.props.account)

        if (nextProps.member && nextProps.member.obj) {
            // cc.log("Object Fees: ", this.props.member.obj.objectFee.toNumber())
            // cc.log("Object Price: ", this.props.member.obj.objectPrice.toNumber())
            // cc.log("Object Type: ", this.props.member.obj.objectType.toNumber())
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

        const user = this.props.usernames && this.props.usernames.find(userO => userO["_id"] === this.props.member["member"])

        // const invoices = this.props.invoices ? this.props.invoices.filter(invoice => (this.months[invoice.month].toLowerCase().startsWith(this.state.filter) || invoice.year === parseInt(this.state.filter, 10))) : []
        const invoices = this.props.invoices || []
        invoices.sort((a, b) => parseFloat(b.month) - parseFloat(a.month))
        // const invoices = this.props.invoices
        // let amount = (this.props.member.obj.objectPrice.toNumber()) + (((this.state.mileage || this.props.member.mileagesTotal) - this.props.member.mileagesTotal) * 0.10)
        // cc.log(amount, ' <= ', this.props.allowance, (amount <= this.props.allowance), this.state.mileage, ' >= ', this.props.member.mileagesTotal, (this.state.mileage >= this.props.member.mileagesTotal));
        // const enableInvoice = ((this.state.mileage >= this.props.member.mileagesTotal) && (amount <= this.props.allowance)) ? true : false
        // cc.log("Invoice Enabled: ", enableInvoice);

        let tariff = parseFloat(this.props.member.obj.monthlyCapitalCost.toNumber() / 100).toFixed(2)
        let mileageEuro = this.props.member.obj.monthlyOperatingCost.toNumber()
        let nextTariff = 0

        if (this.props.member.leaseType === "Per Dag") {
            tariff = this.props.member.obj.monthlyCapitalCost.toNumber()
            nextTariff = parseFloat(((invoices[0] && invoices[0]["nextTariff"]) ? invoices[0]["nextTariff"] : this.props.member.obj.monthlyCapitalCost.toNumber()) - (this.props.member.obj.monthlyCapitalCost.toNumber() / 2000)).toFixed(2)
            mileageEuro = parseFloat((this.state.mileage || 0) * 0.1).toFixed(2)
        }
        const total = parseFloat(tariff + mileageEuro).toFixed(2)

        let invoicesRow = []

        cc.log("INVOICES: ", invoices)
        // if (invoices.length === 0) this.createInvoice(year, month); this.props._lcPayFee(this.props.member.objectID, this.props.account)

        // this.props.member.paymonth = 3
        // for (var i = 0; i <= this.props.member.paymonth; i++) {
        //     invoicesRow.push(
        //         <div key={i} className="investAddCon">
        //             <div className="arrowBtn">
        //                 <img onClick={() => { this.createInvoice(year, month); this.props._lcPayFee(this.props.member.objectID, this.props.account) }} src={require('../assets/add.jpg')} alt="add2" />
        //             </div>
        //             <div className="investAddInput">
        //                 <p style={{ margin: "0" }}>{year} {this.months[month]}</p>
        //                 <p style={{ margin: "0" }}>{this.props.member.mileagesAverage} km stand</p>
        //                 <p style={{ margin: "0" }}>{this.props.member.obj.objectFee.toNumber()} Euro</p>
        //             </div>
        //             <div className="investAddStatus">
        //                 {this.props.payFeeTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.payFeeTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.payFeeTxID)) ? <p className="p-euro" style={{ color: "green" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red" }}>pending</p>}</Link>)}
        //             </div>
        //         </div>
        //     )
        // }


        return (<div className="content-border">
            <div className="mainContentCon">
                {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i> 
                <div className="float-right">
                    <i title="Add Invoice" className="flaticon-invoice" onClick={() => this.createInvoice()}></i>
                    <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                </div> */}
                <div hidden className="navCon">
                    <h1 id="header">
                        <div hidden className="fl"><i className="flaticon-back" onClick={() => this.props.history.goBack()}></i></div>
                        Invoices
                        <div className="fr">
                            {(!invoices || invoices.length <= 0) && <i title="Add Invoice" className="flaticon-invoice marIcon" onClick={() => this.createInvoice()}></i>}
                            {/*<i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>*/}
                        </div>
                    </h1>
                </div>
                <Slide top opposite when={this.state.reveal}>
                    <div className="fr"><i title="Add Invoice" className="flaticon-invoice marIcon" onClick={() => this.createInvoice()}></i></div>
                    <div className="contentCon bg-none overflow">
                        <BlockUi tag="div" blocking={this.props.progress}>
                            <div className="carIntestCon">
                                <div className="membersCon">
                                    <div className="leaseCarCon invest">
                                        <div className="balance">
                                            <div className="balanceName">MIJIN SALDO:</div>
                                            <div className="balanceNum">{formatNumber(parseInt((this.props.euroTokenBalance + this.props.unClaimedRedemption), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}<span> Euro</span></div>
                                        </div>
                                        <div className="mtableLink">
                                            <div className="mtableCar">
                                                <img src={this.props.member.objectPic} alt="carImage" />
                                            </div>
                                            <div className="mtableTokens">{"ACTIVE"}
                                                <p>{this.props.member.evTokens}</p>
                                            </div>
                                            <div className="mtableUser">{user.username}
                                                <p>{user.town}</p>
                                            </div>
                                            <div hidden className="mtableMnd">{formatNumber(parseInt((this.props.member.objectPrice), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} EUR
                                                <p>{this.props.member.months} MND</p>
                                            </div>
                                        </div>
                                        {/*invoicesRow*/}
                                        {
                                            invoices && invoices.map((invoice, i) => {
                                                return <div key={i} className="leaseCarCon invest">
                                                    <div className="balance balanceNum"> BETAAL {(this.props.member.leaseType === "Per Dag") ? (invoice.date || this.getFormattedDate()) : (this.months[invoice.month] + " " + invoice.year)} </div>
                                                    <div className="investAddCon">
                                                        <div className="investAddInput">
                                                            <table>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>Tarief (Incl BTW)</td><td>{tariff} Euro</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>{(this.props.member.objectType === "Car") ? "KM Vergoeding" : "Onderhoud p/m"}</td><td>{invoice.mileage || <input value={this.state.mileage || 0} onChange={(e) => this.setState({ mileage: e.target.value })} maxLength="20" type="number" placeholder="" />}{mileageEuro} Euro</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Totaal</td><td>{total} Euro</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                        {!invoice.status && <div hidden={this.props.payFeeTxID} className="arrowBtn">
                                                            {/*<img onClick={() => { this.props._lcPayCapitalAndOperation(this.props.member.objectID, (parseFloat(this.props.member.obj.monthlyCapitalCost.toNumber()) * 100).toFixed(2), (parseFloat(this.props.member.obj.monthlyOperatingCost.toNumber()) * 100).toFixed(2), this.props.account); this.updateInvoice(invoice, tariff, nextTariff, this.state.mileage, total) }} src={require('../assets/add.jpg')} alt="add2" />*/}
                                                            <img onClick={() => { this.props._lcPayCapitalAndOperation(this.props.member.objectID, tariff, mileageEuro, this.props.account); this.updateInvoice(invoice, tariff, nextTariff, this.state.mileage, total) }} src={require('../assets/add.jpg')} alt="add2" />
                                                        </div>}
                                                        <div className="investAddStatus">
                                                            {this.props.payFeeTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.payFeeTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.payFeeTxID)) ? <p className="p-euro" style={{ color: "green" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red" }}>pending</p>}</Link>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                        }
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
//                                                                 enableInvoice && this.props._lcPaySubscription(this.props.member.objectID, (this.props.member.paymonth + 1), parseInt(this.state.mileage, 10), this.props.account)
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

// <p style={{ margin: "0" }}> </p>
//                                                             <p style={{ margin: "0" }}> </p>
//                                                             <p style={{ margin: "0" }}> </p>