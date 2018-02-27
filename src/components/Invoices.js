import React, { Component } from 'react'

class Invoices extends Component {
    render() {
        return (
            <div>
                <h1 id="header">Invoices</h1>
                <div className="mtableLink">
                    <div className="mtableInvoices">
                        <p>2017 Oktober</p>
                        <p>2500 km stand 550 Euro</p>
                    </div>
                    <div className="mtableInvoicesIcon">
                        <img src={require('../assets/Payed.png')} alt="Payed" />
                    </div>
                    <div className="carCon active">

                        <div className="mtableLink">
                            <div className="mtableTokens">1250 <p>150</p></div>
                            <div className="mtableUser">Yerontour, Monster</div>
                            <div className="mtableCar"><img src={require('../assets/tesla-models/model_3--side_profile.png')} alt="carImage" /></div>
                        </div>


                        <div className="carcol img">
                            <img onClick={this.sendTransaction.bind(this)} src={require('../assets/add.png')} alt="add" />
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
                        <p>7501 km stand 550.10 Euro</p>
                    </div>
                    <div className="mtableInvoicesIcon">
                        <img src={require('../assets/Ether.png')} alt="Ether" />
                    </div>
                </div>
                <div className="mtableLink">
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

                <div className="contentBtn">
                    <input className="searchBtn" type="" name="" placeholder="Search"></input>

                </div>


            </div>
        )
    }
}

export default Invoices