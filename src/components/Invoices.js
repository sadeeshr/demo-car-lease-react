import React, { Component } from 'react'
import BlockUi from 'react-block-ui';

class Invoices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            mileage: 0,
            progress: false,
            month: null,
            year: null
        }
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }


    componentWillMount() {
        this.fetchInvoices()
    }

    componentDidMount() {
        this.carID = this.props.member.carID
        if (this.props.car) this.fetchCarMileagesRedemption()
    }

    fetchInvoices = () => {
        let data = {
            module: "invoices",
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
        this.props._newContractData(data)
    }

    updateInvoice = (invoice, mileage, amount) => {
        let data = {
            module: "invoices",
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
        this.setState({ carMilages: car.milages.toNumber(), monthlyRedemption: car.totalDividends.toNumber() })
    }

    componentWillReceiveProps(nextProps) {
        console.log("new props", nextProps);
        if (nextProps.invoices_new || nextProps.invoices_edit)
            this.fetchInvoices()
        if (nextProps.invoices && nextProps.invoices.length > 0) {
            this.setState({ month: this.getMaxMonth(nextProps.invoices), year: (new Date()).getFullYear() })
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

    render() {
        console.log("INVOICE STATE: ", this.state, this.props);
        const invoices = this.props.invoices ? this.props.invoices.filter(invoice => (this.months[invoice.month].toLowerCase().startsWith(this.state.filter) || invoice.year === parseInt(this.state.filter, 10))) : []
        // const invoices = this.props.invoices
        let amount = (this.props.member.car.totalDividends.toNumber() || 0) + ((this.state.mileage - (this.props.member.car.milages.toNumber() || 0)) * 1)
        return (
            <div className="mainContentCon">
                <div className="navCon">
                    <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">
                        <i title="Add Invoice" className="flaticon-invoice" onClick={this.createInvoice.bind(this)}></i>
                        <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                    </div>
                </div>
                <div className="contentCon">
                    <BlockUi tag="div" blocking={this.props.progress}>
                        <h1 id="header">Invoices</h1>
                        <div className="nvoicesCon overflow">
                            {
                                invoices && invoices.map((invoice, i) => {
                                    return <div key={i} className="mtableLink">
                                        <div className="mtableInvoices">
                                            <p>{invoice.year} {this.months[invoice.month]}</p>
                                            {
                                                invoice.mileage === 0 ?
                                                    <input style={{ width: "80px", textAlign: "center" }} maxLength="20" value={this.state.mileage} onChange={(e) => this.setState({ mileage: e.target.value })} type="text" placeholder="Mileage" />
                                                    : invoice.mileage
                                            }
                                            km stand<p>{invoice.amount > 0 ? invoice.amount : (amount > 0 ? amount : 0)} Euro</p>
                                        </div>
                                        <div className="mtableInvoicesIcon">
                                            {
                                                invoice.status ?
                                                    <img src={require('../assets/Payed.png')} alt="Payed" />
                                                    : <img onClick={() => {
                                                        this.props._lcPaySubscription(this.props.member.carID, invoice.month, this.state.mileage || "0", this.props.account)
                                                        this.updateInvoice(invoice, this.state.mileage, amount || 0)
                                                    }} src={require('../assets/Ether.png')} alt="Ether" />}
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        {/*
                            <div className="mtableInvoices">
                                <p>2017 Oktober</p>
                                <p>2500 km stand 550 Euro</p>
                            </div>
                            <div className="mtableInvoicesIcon">
                                <img src={require('../assets/Payed.png')} alt="Payed" />
                            </div>
                        </div>
                        <div className="mtableLink">
                            <div className="mtableInvoices">
                                <p>2017 November</p>
                                <p>5000 km stand 550 Euro</p>
                            </div>
                            <div className="mtableInvoicesIcon">
                                <img src={require('../assets/Payed.png')} alt="Payed" />
                            </div>
                       </div>*/}


                        <div className="contentBtn">
                            <input className="searchBtn" type="text" name="filterMembers" value={this.state.filter || ""} placeholder="Search" onChange={(e) => { console.log("SEARCH: ", e.target.value); this.setState({ filter: e.target.value }) }} />
                        </div>
                    </BlockUi>
                </div>
            </div>
        )
    }
}

export default Invoices