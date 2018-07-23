import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import { Link } from 'react-router-dom'
import Slide from 'react-reveal/Slide';
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'

import Swiper from 'react-id-swiper';

class Invoices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            invoice: '',
            filter: '',
            mileage: 0,
            progress: false,
            month: null,
            year: null,
            modalCondition: false,
            reveal: false
        }
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }

    modalClick() {
        this.setState({
            modalCondition: !this.state.modalCondition
        });
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
        // this.objectID = this.props.member.objectID
        // this.props.member.leaseType = "Per Dag"   // for testing
        // if (this.props.car) this.fetchCarMileagesRedemption()
        setTimeout(() => this.setState({ reveal: true }), 200);
    }

    fetchInvoices = () => {
        let data = {
            module: "invoicesdev2",
            result: "invoices",
            query: {
                objectID: this.props.member.objectID
            },
            filter: {
                // _id: 0
            }
        }
        this.props._fetchContractData(this.props, data, this.props.account)
    }

    createInvoice = () => {
        // console.log("MONTH:", this.state);
        let data = {
            module: "invoicesdev2",
            result: "invoices",
            data: {
                objectID: this.props.member.objectID,
                year: this.state.year ? ((this.state.month === 11) ? this.state.year + 1 : this.state.year) : (new Date()).getFullYear(),
                month: this.state.month ? (this.state.month === 11) ? 0 : this.state.month + 1 : (new Date()).getMonth(),
                // mileage: this.state.mileage || 0,
                // amount: this.state.amount || 0,                
                status: false
            }
        }
        if (this.props.member.leaseType === "Per Dag")
            data.data["date"] = this.getFormattedDate()

        // cc.log(data, this.state.invoice);
        if (this.state.invoice) cc.log((this.state.invoice.objectID === data["data"]["objectID"]), (this.state.invoice.month === data["data"]["month"]), (this.state.invoice.year === data["data"]["year"]));
        if (this.state.invoice && (this.state.invoice.objectID === data["data"]["objectID"]) && (this.state.invoice.month === data["data"]["month"]) && (this.state.invoice.year === data["data"]["year"]))
            cc.log("DUPLICATE CREATE INVOICE REQUEST, DONT PUSH TO DB")
        else {
            cc.log("CREATE NEW INVOICE")
            this.setState({ invoice: data["data"] }, () => this.props._writeNewContractData(this.props, data))
        }

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
                status: true,
                tariff: tariff,
                nextTariff: nextTariff
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
        if (nextProps.payFeeTxID && (nextProps.payFeeTxID !== this.props.payFeeTxID)) this.setState({ pending: true })
        if (nextProps.invoices_new || nextProps.invoices_edit || (nextProps.event && (nextProps.event !== this.props.event) && (nextProps.event.event === "PayCapitalAndOperation" || nextProps.event.event === "Transfer" || nextProps.event.event === "NewInvoice"))) {
            this.fetchInvoices()
        }

        if (nextProps.event && (nextProps.event !== this.props.event) && (nextProps.event.transactionHash === nextProps.payFeeTxID)) {
            // this.updateInvoice(invoice)
            this.fetchInvoices()
            this.setState({ pending: false }, () => setTimeout(() => {
                this.props._resetTxIds()
            }, 5000))
        }



        if (nextProps.invoices) {
            if (this.state.invoices ? (nextProps.invoices.length > this.state.invoices.length) : (nextProps.invoices.length > 0)) {
                // const invoices = nextProps.invoices.filter(invoice => invoice["objectID"] === this.props.member.objectID)
                // cc.log("$$$$", invoices, this.props.member.objectID);
                let invoices = nextProps.invoices.sort((a, b) => (parseFloat(b.year) - parseFloat(a.year)) || (parseFloat(b.month) - parseFloat(a.month)))
                // console.log("Last Invoice status: ", invoices, invoices[0].status, nextProps.invoices[0].status, this.state.invoices && this.state.invoices[0].status);

                this.setState({ month: this.getMaxMonth(invoices), year: (new Date()).getFullYear(), invoices: invoices }, () => { if (invoices[0].status === true) this.createInvoice() })
            } else if (nextProps.invoices.length === 0) {
                this.createInvoice()
            }
        }

        if (nextProps.eventSubscription && !this.state.eventSubscription) { this.setState({ eventSubscription: nextProps.eventSubscription }) }

        if (!nextProps.unClaimedRedemption) this.props._lcToClaimTotal(this.props.account)
        if (!nextProps.euroTokenBalance) this.props._euroBalanceOf(this.props.account)

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

        // const invoices = this.state.invoices ? this.state.invoices.filter(invoice => (this.months[invoice.month].toLowerCase().startsWith(this.state.filter) || invoice.year === parseInt(this.state.filter, 10))) : []
        const invoices = this.state.invoices || []

        // const invoices = this.state.invoices
        // let amount = (this.props.member.obj.objectPrice.toNumber()) + (((this.state.mileage || this.props.member.mileagesTotal) - this.props.member.mileagesTotal) * 0.10)
        // cc.log(amount, ' <= ', this.props.allowance, (amount <= this.props.allowance), this.state.mileage, ' >= ', this.props.member.mileagesTotal, (this.state.mileage >= this.props.member.mileagesTotal));
        // const enableInvoice = ((this.state.mileage >= this.props.member.mileagesTotal) && (amount <= this.props.allowance)) ? true : false
        // cc.log("Invoice Enabled: ", enableInvoice);


        let tariff = 0
        let mileageEuro = 0
        let nextTariff = 0
        let total = 0

        if (this.props.member.leaseType === "Per Dag") {

            tariff = (invoices[1] && invoices[1]["nextTariff"] && invoices[0] && invoices[0]["nextTariff"] === "false") ? invoices[1]["nextTariff"] : (this.props.member.obj.monthlyCapitalCost.toNumber() / 100).toFixed(2)
            nextTariff = parseFloat(((invoices[0] && invoices[0]["nextTariff"] === "false" && invoices[1] && invoices[1]["nextTariff"]) ? invoices[1]["nextTariff"] : (this.props.member.obj.monthlyCapitalCost.toNumber() / 100)) - ((this.props.member.obj.monthlyCapitalCost.toNumber() / 100) / 2000)).toFixed(2)
            mileageEuro = parseFloat((this.state.mileage || 0) * 0.1).toFixed(2)
            total = parseFloat(tariff) + parseFloat(mileageEuro)
        } else {
            tariff = ((this.props.member.obj.monthlyCapitalCost.toNumber()) / 100).toFixed(2)
            mileageEuro = ((this.props.member.obj.monthlyOperatingCost.toNumber()) / 100).toFixed(2)
            total = parseFloat(tariff) + parseFloat(mileageEuro)
            // .toFixed(2)
        }

        cc.log("Invoices, Tariff, Next Tariff, Mileage, Total : ", invoices, tariff, nextTariff, mileageEuro, total);

        // let invoicesRow = []

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

        const params = {
            shouldSwiperUpdate: true,
            navigation: {
                prevEl: '.swiper-button-next',
                nextEl: '.swiper-button-prev'
            },

        }


        return (<div className="content-border">
            <div className="border-bottom-1">
                <div className="container">
                    <span className="lh-40">MIJN SALDO: <strong className="fs-20">{formatNumber(parseInt((this.props.euroTokenBalance + this.props.unClaimedRedemption), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}</strong> Euro</span>
                    <span className="fr pt-8"><img className="infoImg" src={require('../assets/deal.png')} alt="deal" /></span>
                </div>
            </div>
            <div className="mainContentCon  mainContentCon-43">
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
                <Slide right opposite when={this.state.reveal}>
                    <div hidden className="fr addInv"><i title="Add Invoice" className="flaticon-invoice marIcon" onClick={() => this.createInvoice()}></i></div>
                    <div className="contentCon bg-none overflow contentCon-8 pt-8">
                        <BlockUi tag="div" blocking={this.props.progress}>
                            <div className="carIntestCon">
                                <div className="membersCon">
                                    <div className="leaseCarCon main-i invest">
                                        {/* <div className="balance d-ib inv">
                                            <div className="col-6 balanceName lh-25 text-right">MIJN SALDO : &nbsp;&nbsp;</div>
                                            <div className="col-6 balanceNum lh-25 text-left">{formatNumber(parseInt((this.props.euroTokenBalance + this.props.unClaimedRedemption), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}<span> Euro</span></div> */}
                                        {/* <div className="col-6">&nbsp;</div>
                                            <div className="col-6 minusBal text-left">-2.500</div> */}
                                        {/* </div> */}
                                        <div className="col-12 mtableLink">
                                            <div className="mtableCar" style={{ backgroundImage: `url(${this.props.member.objectPic})` }}>
                                                {/* <img src={this.props.member.objectPic} alt="carImage" /> */}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="col-4 text-right mtableTokens">{"ACTIVE"}
                                                <p>{this.props.member.evTokens}</p>
                                            </div>
                                            <div className="col-8 mtableUser">
                                                <div style={{ paddingLeft: '20px' }}>
                                                    {user.username}
                                                    <p>{user.town} {this.props.member.leaseType}</p>
                                                </div>
                                            </div>

                                            <div hidden className="col-12 mtableMnd">{formatNumber(parseInt((this.props.member.objectPrice), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} EUR
                                                <p>{this.props.member.months} MND</p>
                                            </div>
                                        </div>

                                        {/*invoicesRow*/}
                                        {/* <div className="investAddStatus">
                                            {this.props.payFeeTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.payFeeTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.payFeeTxID)) ? <p className="p-euro" style={{ color: "green" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red" }}>pending</p>}</Link>)}
                                        </div> */}
                                        <div className="col-12 cPadding">
                                            <Swiper {...params}>
                                                {
                                                    invoices && invoices.map((invoice, i) => {

                                                        if (this.props.member.leaseType === "Per Dag" && invoice["status"] === false) {
                                                            tariff = nextTariff
                                                        }

                                                        cc.log("STATUS: ", this.state.pending, invoice.status, (this.state.pending && !invoice.status));
                                                        return <div key={i} className="leaseCarCon invest no-border cPadding">
                                                            <div className="col-12 d-ib border-2">
                                                                <div className="balance balanceNum text-center"> REKENING {(this.props.member.leaseType === "Per Dag") ? (invoice.date || this.getFormattedDate()) : (this.months[invoice.month] + " " + invoice.year)}
                                                                    <div className="col-12 text-center">
                                                                        <span style={{ fontSize: '11px' }}>(Incl BTW)</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 investAddCon">
                                                                    <div className="col-6 text-right">
                                                                        <span style={{ padding: '0 5px', lineHeight: '30px' }}>Tarief</span>
                                                                    </div>
                                                                    <div className="col-2 text-center">
                                                                        <span style={{ fontSize: '11px' }}>&nbsp;</span>
                                                                    </div>

                                                                    <div className="col-4" style={{ lineHeight: '30px' }}>
                                                                        {formatNumber(tariff, { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} Euro
                                                            </div>
                                                                    <div className="col-6 text-right">&nbsp;
                                                                <span style={{ padding: '0 5px', lineHeight: '30px' }}>{(this.props.member.objectType === "Car") ? "KM" : "Onderhoud p/m"}</span>
                                                                    </div>

                                                                    <div className="col-2 text-center input-inv">
                                                                        {invoice.mileage || (this.props.member.leaseType === "Per Dag" && <input value={this.state.mileage || 0} onChange={(e) => this.setState({ mileage: e.target.value })} maxLength="20" type="number" placeholder="" />)}
                                                                    </div>

                                                                    <div className="col-4" style={{ lineHeight: '30px' }}>
                                                                        {formatNumber(mileageEuro, { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} Euro
                                                            </div>

                                                                    <div className="col-6 text-right">
                                                                        <span style={{ padding: '0 5px', lineHeight: '30px' }}>Totaal</span>
                                                                    </div>
                                                                    <div className="col-2 text-center">
                                                                        <span style={{ fontSize: '11px' }}>&nbsp;</span>
                                                                    </div>

                                                                    <div className="col-4" style={{ lineHeight: '30px' }}>
                                                                        {formatNumber(total, { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} Euro
                                                            </div>

                                                                    <div className="col-12 text-center">
                                                                        {/* {!this.state.pending && !invoice.status && <span className="flaticon-lock-1 unlock" onClick={() => { this.props._lcPayCapitalAndOperation(this.props, this.props.member.objectID, (tariff * 100), (mileageEuro * 100), this.props.account); this.updateInvoice(invoice, tariff, nextTariff, this.state.mileage, total) }} ></span>} */}
                                                                        {/* <span className="flaticon-lock unlock"></span>  */}
                                                                        {/* <span className="minusBal">Pending</span> */}
                                                                        {this.props.payFeeTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.payFeeTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.payFeeTxID)) ? <p className="p-euro" style={{ color: "green", fontSize: "18px", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Confirmed</p> : <p className="p-euro " style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Pending</p>}</Link>)}
                                                                        {/* <span className="confirmBal">Confirmed</span> */}

                                                                        {(!this.state.pending && !invoice.status) && <span className="flaticon-padlock unlock unlock-m" onClick={() => { this.props._lcPayCapitalAndOperation(this.props, this.props.member.objectID, (tariff * 100), (mileageEuro * 100), this.props.account); this.updateInvoice(invoice, tariff, nextTariff, this.state.mileage, total) }} ></span>}
                                                                    </div>

                                                                </div>
                                                                {/* {!invoice.status && <div className="arrowBtn"> */}
                                                                {/*<img onClick={() => { this.props._lcPayCapitalAndOperation(this.props.member.objectID, (parseFloat(this.props.member.obj.monthlyCapitalCost.toNumber()) * 100).toFixed(2), (parseFloat(this.props.member.obj.monthlyOperatingCost.toNumber()) * 100).toFixed(2), this.props.account); this.updateInvoice(invoice, tariff, nextTariff, this.state.mileage, total) }} src={require('../assets/add.jpg')} alt="add2" />*/}
                                                                {/* <img onClick={() => { this.props._lcPayCapitalAndOperation(this.props, this.props.member.objectID, (tariff * 100), (mileageEuro * 100), this.props.account); this.updateInvoice(invoice, tariff, nextTariff, this.state.mileage, total) }} src={require('../assets/add.jpg')} alt="add2" />
                                                        </div>} */}

                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </Swiper>
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
                        <div className="col-2 text-left">
                            <button className="arrowBtn" onClick={this.doExit.bind(this)}>
                                <span className="flaticon-left-arrow"></span>
                            </button>
                        </div>
                        <div className="col-8 lh-54 text-left">
                            Ga Terug
                        </div>
                        <div className="col-2 text-left padding-10-0">
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
        </div >
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