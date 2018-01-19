import React, { Component } from 'react'
import ledgerApi from './ledger';
import BigNumber from 'bignumber.js';
import ReactLoading from 'react-loading';
import util from 'ethereumjs-util';


class Demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            goHome: true,
            goMembers: false,
            members: [
                {
                    fname: "SaketTour",
                    lname: "Monster",
                    address: "",
                    message: "Hi, this is Saket, i have a black audi",
                    car: "Audi",
                    id: 1,
                    profilePic: "",
                    idPic: ""
                },
                {
                    fname: "Flint",
                    lname: "Monster",
                    address: "",
                    message: "Hi, this is Flint, i have a black tesla",
                    car: "Tesla",
                    id: 2,
                    profilePic: "",
                    idPic: ""
                },
                {
                    fname: "Piet",
                    lname: "P",
                    address: "",
                    message: "Hi, this is Piet, i have a Ferrari !!",
                    car: "Ferrari",
                    id: 3,
                    profilePic: "",
                    idPic: ""
                }
            ],
            cars: [
                {
                    id: 1,
                    label: "Audi",
                    raised: 1500,
                    price: 40400
                },
                {
                    id: 2,
                    label: "Tesla",
                    raised: 1000,
                    price: 50000
                },
                {
                    id: 3,
                    label: "Ferrari",
                    raised: 3000,
                    price: 100000
                },
                {
                    id: 4,
                    label: "BMW",
                    raised: 2000,
                    price: 34000
                }
            ],
            clicked: {
                fname: ""
            },
            progress: false

        }
        this.initialState = this.state
    }


    componentDidMount() {
        this.setState({ goHome: true })
    }

    resetState = () => {
        console.log("am i called ?");
        this.setState(this.initialState)
        console.log(this.state);
    }

    createAccount = () => {
        const self = this.state
        let newMember = {
            fname: self.fname || '',
            lname: self.lname || '',
            address: self.address || '',
            city: self.city || '',
            country: self.country || '',
            message: self.message || '',
            car: self.car || '',
            id: self.carId || '',
            profileID: self.profileID || '',
            profilePic: self.profilePic || ''
        }
        let membersList = self.members
        console.log(self.membersList)
        membersList.push(newMember)
        console.log(self.membersList);
        this.setState({ members: membersList, goMembers: true, goHome: false, goInvest: false, goAddMember: false })
        console.log(self);
    }

    Home = () => {
        return (
            <div>
                <div className="contentCon">
                    <h1 id="header">Westland1000x</h1>
                    <div id="car-logo" >
                        <img src={require('./assets/car.png')} alt="logo" />
                    </div>
                    <div className="contentText">
                        <p>The cooperative that always takes care of one electric autonomous car in front of your door and you only pay if you use it. From 10 euros per day, 1 euro per hour, 10 cents per km,  1 cent per ride for this fantastic app</p>
                        <p>You can opt for a (private) lease, full time user or prepaid account.</p>
                        <p>An ICO in which 1000+ cars become financed and money for the first 100 has been picked up. It’s a competition, the potential preparer with the most voting is at the top of the list to use a Tesla.</p>
                    </div>
                    <div className="contentBtn">
                        <button onClick={() => this.setState({ goMembers: true, goHome: false })}>Members</button>
                    </div>
                </div>

            </div>
        )
    }

    renderMember = (member, i) => {
        const invest = this.state.clicked.fname === member.fname ? true : false
        let memberRows = [
            <tr key={i} onClick={() => this.state.clicked !== member ? this.setState({ clicked: member }) : this.setState({ clicked: { fname: "" } })}>
                <td> {i + 1} </td>
                <td> {member.fname}, {member.lname}</td>
                <td> {member.car} </td>
            </tr>
        ]

        if (invest) {
            memberRows.push(
                <tr className="rowSelect" key={'invest-' + i}>
                    <td>{member.message}</td>
                    <td><button onClick={() => this.setState({ goInvest: true, goHome: false, goAddMember: false, goMembers: false })}>Invest</button></td>
                </tr>
            )
        }

        return memberRows
    }

    addMember = () => {
        return (
            <div>
                <form onSubmit={(e) => this._handleSubmit(e)}>
                    <div className="contentCon">
                        <h1 id="header">New Member</h1>
                        <div className="form-row-container">
                            <span className="form-input-containers">
                                <input className="membership-input" maxLength="20" onChange={(e) => this.setState({ fname: e.target.value })} type="text" id="firstname" name="firstname" placeholder="First Name *" />
                            </span>
                            <span className="form-input-containers">
                                <input className="membership-input" maxLength="20" onChange={(e) => this.setState({ lname: e.target.value })} type="text" id="lastname" name="lastname" placeholder="Last Name" />
                            </span>
                            <span className="form-input-containers">
                                <textarea className="membership-input" rows="10" onChange={(e) => this.setState({ address: e.target.value })} placeholder="Address"></textarea>
                            </span>
                            <span className="form-input-containers">
                                <input maxLength="30" className="membership-input" onChange={(e) => this.setState({ city: e.target.value })} type="text" id="City" name="city" placeholder="City" />
                            </span>
                            <span className="form-input-containers">
                                <input maxLength="30" className="membership-input" onChange={(e) => this.setState({ country: e.target.value })} type="text" placeholder="Country" />
                            </span>

                            <span className="form-input-containers">
                                <textarea className="membership-input" rows="10" onChange={(e) => this.setState({ message: e.target.value })} name="message" placeholder="Your message"></textarea>
                            </span>

                            <span className="form-input-containers marginBttm">
                                <label className="textbtn" htmlFor="imageUpload">{this.state.profilePic || "Profile Picture"}</label>
                                <input className="fileInput" id="imageUpload" type="file" onChange={(e) => this.setState({ profilePic: e.target.files[0].name })} />
                            </span>

                            <span className="form-input-containers marginBttm">
                                <label className="textbtn" htmlFor="imageUpload2">{this.state.profileID || "Upload ID"}</label>
                                <input className="fileInput" id="imageUpload2" type="file" onChange={(e) => this.setState({ profileID: e.target.files[0].name })} />
                            </span>
                            <div id="center-btn-container" className="btn-container-member contentBtn">
                                <button type="button" className="btnwithAdd" onClick={() => { this.setState({ seeCars: true }) }}>
                                    <img className="addBtn" src={require('./assets/add.png')} alt="test" />
                                    <div className="btnName">{this.state.car || "Select Car"}</div>
                                </button>
                            </div>
                            {
                                this.state.seeCars &&
                                this.state.cars.map((car, i) => {
                                    return (
                                        <div key={i} id="center-btn-container" className="contentBtn" onClick={() => { this.setState({ car: car.label, seeCars: false, carId: car.id }) }}>
                                            <img src={require('./assets/car.png')} alt="test" />

                                            <button type="button" className="btnwithAdd">
                                                {car.label}
                                            </button>
                                        </div>
                                    )
                                })
                            }
                            {this.state.car && <img src={require('./assets/car.png')} alt="test" />}


                            <div className="contentBtn">
                                <button onClick={this.createAccount.bind(this)}>Create Account</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    Members = () => {

        return (
            <div>
                <h1 id="header">Members</h1>
                <table className="tableCon">
                    <thead>
                        <tr>
                            <th>Nr</th><th>Members</th><th>Car</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.members.map((member, i) => {
                                return this.renderMember(member, i)
                            })
                        }
                    </tbody>
                </table>
                <div className="contentBtn">
                    <button type="button" onClick={() => this.setState({ goAddMember: true, goHome: false, goMembers: false })} className="btnwithAdd">
                        <img className="addBtn" src={require('./assets/add.png')} alt="test" />
                        <div className="btnName">Add Me</div>
                    </button>
                </div>
            </div>)
    }

    invest = () => {
        return (
            <div>
                <h1 id="header">Invest</h1>
                <div className="carCon">
                    <div className="carcol">
                        <div className="carTitle">Total raised: {this.state.cars[this.state.clicked.id - 1].label}</div>
                        <div className="carEth">{this.state.cars[this.state.clicked.id - 1].raised} ETH</div>
                        <div className="carPrice">{this.state.cars[this.state.clicked.id - 1].price} &#8364;</div>
                    </div>
                    <div className="carcol img">
                        <img src={require('./assets/tesla-models/model_3--side_profile.png')} alt="cars" />
                    </div>
                </div>
                <div className="carCon">
                    {!this.state.eths && <div className="carTitle">"Click On Device"</div>}
                    {this.state.eth && <div className="carTitle">{this.state.eth}</div>}
                    {this.state.ethBal && <div className="carEth">{this.state.ethBal} ETH</div>}
                    <div className="carcol">
                        {
                            this.state.eths &&
                            <select onChange={(e) => e.target.value !== "" && this.setState({ eth: this.state.eths[e.target.value].account, ethBal: new BigNumber(this.state.eths[e.target.value].balance, 10).mul(1).round(0, BigNumber.ROUND_DOWN).div(1000000000000000000).toString(10) })}>
                                <option value="" >Select</option>
                                {
                                    this.state.eths.map((eth, i) => {
                                        return <option key={i} value={i}>{eth.account.substring(0, 7) + '.....' + eth.account.substring(eth.account.length - 5)} Balance: {new BigNumber(eth.balance, 10).mul(1).round(0, BigNumber.ROUND_DOWN).div(1000000000000000000).toString(10)}</option>
                                    })
                                }
                            </select>
                        }
                    </div>
                    <div className="carcol img">
                        <img hidden={this.state.eths ? true : false} onClick={this.connectLedger.bind(this)} src={require('./assets/ledgernanos.png')} alt="ledger" />
                    </div>
                </div>
                <div className="carCon">
                    <div className="carcol">
                        <div className="carTitle">Invest in ETH:
                    <input className="membership-input" maxLength="20" onChange={(e) => this.setState({ ethInvest: e.target.value })} type="text" placeholder="ETH" />
                        </div>
                        <div className="carEth">Receive Tokens</div>
                        <div className="carPrice">1000</div>
                    </div>
                    <div className="carcol img">
                        <img onClick={this.sendTransaction.bind(this)} src={require('./assets/ok.png')} alt="ok" />
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
        )
    }

    connectLedger = () => {
        this.setState({ progress: true })
        ledgerApi.connect((eths) => {
            console.log("ETHS: ", eths)
            this.setState({ eths: eths, progress: false })
        })
    }

    sendTransaction = () => {
        this.setState({ progress: true })
        ledgerApi.genRawTransaction(this.state.clicked.id, this.state.eth, this.state.ethInvest, (txId) => {
            console.log("Transaction ID: ", txId.result)
            this.setState({ txId: txId.result, progress: false })
        })
    }

    render() {
        // console.log(this.state)
        return (
            <div className="main-body">
                <div className="content-wrapper">
                    <div className="mainContentCon">
                        <div className="navCon">
                            {(this.state.goAddMember || this.state.goInvest) && <i className="flaticon-left-arrow" onClick={() => this.setState({ goMembers: true, goHome: false, goInvest: false, goAddMember: false })}></i>}
                            <div className="float-right">
                                {this.state.progress && <ReactLoading type="bubbles" color="#444" />}
                                <i onClick={() => this.setState({ goHome: true, goAddMember: false, goMembers: false, goInvest: false })} className="flaticon-user"></i>
                            </div>
                        </div>
                        <div className="contentCon">
                            {this.state.goHome && this.Home()}
                            {this.state.goMembers && this.Members()}
                            {this.state.goAddMember && this.addMember()}
                            {this.state.goInvest && this.invest()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Demo