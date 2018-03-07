import React, { Component } from 'react'
import BlockUi from 'react-block-ui';

class Invoices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            mileage: 0,
            progress: false
        }
        this.carID = null
        this.month = 1
    }

    componentDidMount() {
        this.carID = this.props.member.carID
        if (this.props.car) this.fetchCarMileagesRedemption()
    }

    fetchCarMileagesRedemption = () => {
        let car = this.props.car
        this.setState({ carMilages: car.carMilages.toNumber(), monthlyRedemption: car.monthlyRedemption.toNumber() })
    }

    payInterestAndRedemption = () => {
        this.setState({ progress: true })
        this.props.LeaseContract.payInterestAndRedemption(this.carID, this.month || "0", this.state.mileage || "0", { from: this.props.account })
            .then(result => {
                this.setState({ progress: false })
                this.props.history.goBack()
                console.log("payInterestAndRedemption RESULT: ", result)
            })
    }

    render() {
        console.log("INVOICE STATE: ", this.state);
        let amount = (this.state.monthlyRedemption || 0) + (this.state.mileage - (this.state.carMilages || 0))
        return (
            <div className="mainContentCon">
                <div className="navCon">
                    <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">
                        <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                    </div>
                </div>
                <div className="contentCon">
                    <BlockUi tag="div" blocking={this.state.progress}>
                        <h1 id="header">Invoices</h1>
                        <div className="mtableLink">
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
                        </div>

                        <div className="mtableLink">
                            <div className="mtableInvoices">
                                <p>2017 December</p>
                                <input style={{ width: "80px", textAlign: "center" }} maxLength="20" value={this.state.mileage} onChange={(e) => this.setState({ mileage: e.target.value })} type="text" placeholder="Mileage" />
                                <span> km stand {amount > 0 ? amount : 0} euro</span>
                            </div>
                            <div className="mtableInvoicesIcon">
                                <img onClick={() => this.payInterestAndRedemption()} src={require('../assets/Ether.png')} alt="Ether" />
                            </div>
                        </div>
                        {/* <div className="mtableLink">
                        <div className="mtableInvoices">
                            <p>2018 January</p>
                            <p>7501 km stand 380 Euro</p>
                        </div>
                        <div className="mtableInvoicesIcon">
                            <img src={require('../assets/Ether.png')} alt="Ether" />
                        </div>
                    </div>
                    <div className="mtableLink">
                        <div className="mtableInvoices">
                            <p>2018 February</p>
                            <p>8301 km stand 300 Euro</p>
                        </div>
                        <div className="mtableInvoicesIcon">
                            <img src={require('../assets/Ether.png')} alt="Ether" />
                        </div>
                    </div>
        */}
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