import React, { Component } from 'react'
import ledgerApi from './lib/Ledger';
import BigNumber from 'bignumber.js';
import ReactLoading from 'react-loading';
// import util from 'ethereumjs-util';
import util from 'util';
import * as Actions from './actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import md5 from 'md5';

class CarLease extends Component {
    constructor(props) {
        super(props)
        this.state = {
            clicked: {
                fname: ""
            },
            progress: false
        }
        this.param = {
            from: "0xc3699ba87C3E96dF9eD66B3B05bf4e80bd688965" // ethereum from account addr, my metamask from addr for testing
        }
    }



    componentWillMount() {
        this.props._connectSocket(this.props);
    }

    componentDidMount() {
        this.setState({ module: "Main" })

        const { web3 } = window
        // Check if Web3 has been injected by the browser:
        if (typeof web3 !== 'undefined') {
            // You have a web3 browser! Continue below!
            this.props._initContract(this.props, web3)
        } else {
            // Warn the user that they need to get a web3 browser
            // Or install MetaMask, maybe with a nice graphic.
            console.log("NO WEB3");
        }

        setTimeout(() => {
            [1, 2].map(i => {
                this.props.contract.cars(i)
                    .then(car => console.log(`CAR: ${i} => `, car))
            })

        }, 2000);
    }



    fetchContractData(module) {
        this.props._fetchContractData(module)
        this.setState({ module: "Home" })
    }

    fetchTotalAmountRaised = () => {
        this.props.contract.totalAmountRaised()
            .then(result => {
                console.log(result);
                console.log(util.inspect(result[0].toNumber(), false, null))
                this.setState({ totalAmountRaised: result[0].toNumber() })
            })
    }

    fetchCrowdSaleClosed = () => {
        this.props.contract.totalAmountRaised()
            .then(result => {
                console.log(result);
                console.log(util.inspect(result[0].toNumber(), false, null))
                this.state.totalRaised = result[0].toNumber()
            })
    }

    fileUploadHandler = (file, name) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => this.setState({ [name]: reader.result })
    }

    createAccount = () => {
        const self = this.state
        let newMember = {
            username: self.username || '',
            fullname: self.fullname || '',
            address: self.address || '',
            city: self.city || '',
            county: self.county || '',
            message: self.message || '',
            carID: self.carID || '',
            carPic: self.carPic || '',
            profileID: self.profileID || '',
            profilePic: self.profilePic || ''
        }
        let membersList = this.props[this.props.module].members
        console.log(membersList)
        membersList.push(newMember)
        console.log(membersList);
        this.setState({ module: "Members" })
        let dbVar = this.props.module + ".members"
        this.props._updateContractData({ [dbVar]: membersList })
        console.log(self);
    }

    addNewCar = () => {
        this.props.contract.AddNewCar(this.state.carID, this.state.carHash, this.state.carDealer, this.state.carDriver, this.state.monRedemption, this.param)
            .then(result => {
                console.log("ADD NEW CAR RESULT: ", result)
                this.setState({ module: "AddMember" })
            })
    }

    Home = () => {
        return (
            <div>
                <div>
                    <h1 id="header">Westland1000x</h1>
                    <div className="contentText">
                        <p>The cooperative that always takes care of one electric autonomous car in front of your door and you only pay if you use it. From 10 euros per day, 1 euro per hour, 10 cents per km,  1 cent per ride for this fantastic app</p>
                        <p>You can opt for a (private) lease, full time user or prepaid account.</p>
                        <p>An ICO in which 1000+ cars become financed and money for the first 100 has been picked up. It’s a competition, the potential preparer with the most voting is at the top of the list to use a Tesla.</p>
                        <div className="contentBtn bg-none">
                            <button onClick={() => this.setState({ module: "Members" })}><img src={require('./assets/add.png')} alt="addM" /></button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    Main = () => {
        const img = { "maxHeight": "95px", "maxWidth": "180px", "display": "block", "width": "auto", "height": "auto" }
        const thumbImg = { "maxHeight": "40px", "maxWidth": "40px", "display": "block", "width": "auto", "height": "auto" }
        return (
            <div>
                <div>
                    <h1 id="header">Car Lease</h1>

                    <table>
                        <tbody>
                            <tr>
                                <td><img style={img} src={require('./assets/TeslaRoadster.png')} alt="logo" /></td>
                                <td>
                                    <img className="flagMargin" style={thumbImg} src={require('./assets/india_flag.jpg')} alt="logo" />
                                    <img style={thumbImg} src={require('./assets/netherlands_flag.png')} alt="logo" />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="contentBtn ">
                        <button onClick={() => this.fetchContractData("westland")} >Westland</button>
                        <button onClick={() => this.fetchContractData("middendelftland")}>Midden Delftland</button>
                        <button onClick={() => this.setState({ module: "AddMember" })}>Jouw gemeente hier<img src={require('./assets/add.png')} alt="addM" /></button>
                    </div>
                </div>
            </div>
        )
    }

    renderMember = (member, i) => {
        if (this.state.progress) this.setState({ progress: false })
        const img = { "display": "block" }
        const selected = this.state.clicked.fullname === member.fullname ? true : false
        let memberRows = [
            <div className="mtableLink" key={i} onClick={() => this.state.clicked !== member ? this.setState({ clicked: member }) : this.setState({ clicked: { fullname: "" } })}>
                <div className="mtableTokens">{member.tokens || ""} <p>{member.earned || "" && "\n" + member.earned || ""}</p></div>
                <div className="mtableUser">{member.fullname || member.fname || ""}, {member.county || member.city || ""}</div>
                <div className="mtableCar"><img style={img} src={member.carPic || ""} alt="carImage" /></div>
            </div>
        ]

        if (selected) {
            memberRows.push(

                <div className="rowSelect" key={'invest-' + i}>
                    <div className="memberMesCon">{member.message}</div>
                    <div className="memberMesBtns">
                        <div className="membersBtn">
                            <a role="button" onClick={() => this.setState({ module: "Invest" })}>
                                <p><img src={require('./assets/add.png')} alt="test" /> Invest</p>
                            </a>
                        </div>
                    </div>
                </div>
            )
        }

        return memberRows
    }

    AddCar = () => {
        const img = { "maxHeight": "95px", "maxWidth": "230px", "display": "block", "width": "auto", "height": "auto" }

        return (
            <div>
                <div>
                    <h1 id="header">Add Car</h1>
                    <div className="form-row-container">
                        <span className="form-input-containers">
                            <input className="membership-input" maxLength="20" onChange={(e) => this.setState({ carID: e.target.value })} type="text" placeholder="Car ID" />
                        </span>
                        <span className="form-input-containers">
                            <input className="membership-input" onChange={(e) => this.setState({ carModel: e.target.value, carHash: '0x' + md5(e.target.value + this.state.carID) })} type="text" placeholder="Car Model" />
                        </span>
                        <span className="form-input-containers">
                            <input className="membership-input" onChange={(e) => this.setState({ carDealer: e.target.value })} type="text" placeholder="Car Dealer Address" />
                        </span>
                        <span className="form-input-containers">
                            <input className="membership-input" onChange={(e) => this.setState({ carDriver: e.target.value })} type="text" placeholder="Car Driver Address" />
                        </span>
                        <span className="form-input-containers">
                            <input className="membership-input" onChange={(e) => this.setState({ monRedemption: e.target.value })} type="text" placeholder="Monthly Redemption" />
                        </span>

                        <span className="form-input-containers">
                            <input className="membership-input" readOnly maxLength="32" type="text" value={this.state.carHash || ""} placeholder="Car Hash" />
                        </span>
                        <span className="form-input-containers marginBttm inputAddbtn">
                            <div className="image-upload" htmlFor="imageUpload">
                                <label style={{ "textAlign": "center", }} htmlFor="crPicIn">
                                    <img src={require('./assets/add.png')} alt="crPic" />
                                </label>
                                <input type="file" id="crPicIn" onChange={(e) => { this.fileUploadHandler(e.target.files[0], "carPic") }} />
                            </div>
                            <label >Add Car Pic</label>

                            {this.state.carPic && <img className="inputImg" src={this.state.carPic} alt="intI" />}
                        </span>

                        <div className="contentBtn">
                            <button onClick={this.addNewCar.bind(this)}>Add New Car</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    AddMember = () => {
        const cars = this.props[this.props.module] ? this.props[this.props.module].cars : []
        const img = { "maxHeight": "95px", "maxWidth": "230px", "display": "block", "width": "auto", "height": "auto" }

        return (
            <div>
                <div>
                    <h1 id="header">Become Member</h1>
                    <div className="form-row-container">
                        <span className="form-input-containers">
                            <input className="membership-input" maxLength="20" onChange={(e) => this.setState({ username: e.target.value })} type="text" id="username" name="username" placeholder="Username *" />
                        </span>
                        <span className="form-input-containers">
                            <input className="membership-input" maxLength="20" onChange={(e) => this.setState({ fullname: e.target.value })} type="text" id="fullname" name="fullname" placeholder="Full Name" />
                        </span>
                        <span className="form-input-containers">
                            <input className="membership-input" maxLength="20" onChange={(e) => this.setState({ address: e.target.value })} type="text" id="address" name="address" placeholder="Address" />
                        </span>
                        <span className="form-input-containers">
                            <input maxLength="30" className="membership-input" onChange={(e) => this.setState({ state: e.target.value })} type="text" id="state" name="state" placeholder="State" />
                        </span>
                        <span className="form-input-containers">
                            <input maxLength="30" className="membership-input" onChange={(e) => this.setState({ county: e.target.value })} type="text" placeholder="County" />
                        </span>

                        <span className="form-input-containers">
                            <textarea className="membership-input" rows="5" onChange={(e) => this.setState({ message: e.target.value })} name="message" placeholder="Your message"></textarea>
                        </span>

                        <span className="form-input-containers marginBttm inputAddbtn">
                            <div style={{ "textAlign": "right" }} htmlFor="imageUpload">
                                <button style={{ "backgroundColor": "Transparent", "outline": "none", "border": "none", "padding": "0" }} onClick={() => { this.setState({ module: "AddCar" }) }}><img src={require('./assets/add.png')} alt="addM" /></button>
                            </div>
                            <label>Add Car</label>
                            {this.state.carPic && <img className="inputImg" src={this.state.carPic} alt="ncintI" />}
                        </span>

                        <span className="form-input-containers marginBttm inputAddbtn">
                            <div className="image-upload" htmlFor="imageUpload">
                                <label style={{ "textAlign": "center", }} htmlFor="prPicIn">
                                    <img src={require('./assets/add.png')} alt="prPic" />
                                </label>
                                <input type="file" id="prPicIn" onChange={(e) => { this.fileUploadHandler(e.target.files[0], "profilePic") }} />
                            </div>
                            <label >Profile Pic</label>

                            {this.state.profilePic && <img className="inputImg" src={this.state.profilePic} alt="intI" />}
                        </span>

                        <span className="form-input-containers marginBttm inputAddbtn">
                            <div className="image-upload" htmlFor="imageUpload">
                                <label style={{ "textAlign": "center" }} htmlFor="prID">
                                    <img src={require('./assets/add.png')} alt="intI" />
                                </label>
                                <input type="file" id="prID" onChange={(e) => { this.fileUploadHandler(e.target.files[0], "profileID") }} />
                            </div>
                            <label >Profile ID</label>

                            {this.state.profileID && <img className="inputImg" src={this.state.profileID} alt="inputI" />}
                        </span>

                        <div className="contentBtn">
                            <button onClick={this.createAccount.bind(this)}>Create Account</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    Members = () => {
        return (
            <div>
                <h1 id="header">Members</h1>


                <div className="mtableCon">
                    <div className="mtableTitle">
                        <div className="mtableTokens">EVTokens</div>
                        <div className="mtableUser">User Town</div>
                        <div className="mtableCar">Car</div>
                    </div>
                </div>

                {
                    (this.props.module && this.props[this.props.module]) ? this.props[this.props.module].members.map((member, i) => {
                        return this.renderMember(member, i)
                    }) : []
                }

                <div className="contentBtn">
                    <input className="searchBtn" type="" name="" placeholder="Search"></input>

                </div>
                <div className="contentBtn addMe" >
                    <a role="button" onClick={() => this.setState({ module: "AddMember" })}>
                        <img src={require('./assets/add.png')} alt="addM" />
                        <p>Add Me</p></a>
                </div>
            </div>)
    }

    Invest = () => {
        [1, 2].map(i => {
            console.log("CONTRACT: Fetching details of CAR ID: => ", i);
            return this.props.contract.cars(i)
                .then(car => console.log(`CONTRACT: Details of CAR ID ${i} => `, car))
        })
        if (!this.state.totalAmountRaised) this.fetchTotalAmountRaised()
        const cars = this.props[this.props.module].cars

        return (
            <div>
                <h1 id="header">Invest</h1>
                <div className="carIntestCon">
                    <div className="carCon">

                        <div className="carcol img">
                            <img src={require('./assets/TeslaRoadster.png')} alt="cars" />
                        </div>
                        <div className="carcol">
                            <div className="carTitle">Total raised: {this.state.totalAmountRaised || "0"}</div>
                            <div className="carEth">1000 ETH</div>
                            <div className="carPrice">400 &#8364;</div>
                        </div>
                    </div>
                    <div className="carCon">

                        <div className="carcol">
                            {!this.state.eths && <div className="carTitle">"Click On Device"</div>}
                            {this.state.eth && <div className="carTitle">{this.state.eth}</div>}
                            {this.state.ethBal && <div className="carEth">{this.state.ethBal} ETH</div>}
                            <div className="carPrice">0xdf9...321e</div>
                            <div className="carPrice">5.320 ETH</div>
                            <div className="carPrice">1174 EVTokens</div>
                            <div className="carPrice">0.37 Claim ETH  <img onClick={() => { this.setState({ module: "Invoices" }) }} src={require('./assets/add.png')} alt="add" /></div>

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
                            <img hidden={Array.isArray(this.state.eths) ? true : false} onClick={this.connectLedger.bind(this)} src={require('./assets/ledgernanos.png')} alt="ledger" />
                        </div>
                    </div>
                    <div className="carCon active">

                        <div className="mtableLink">
                            <div className="mtableTokens">{this.state.clicked.tokens || ""} <p>{this.state.clicked.earned || ""}</p></div>
                            <div className="mtableUser">{this.state.clicked.fullname || this.state.clicked.fname || ""}</div>
                            <div className="mtableCar"><img src={this.state.clicked.carPic || ""} alt="carImage" /></div>
                        </div>


                        <div className="carcol img">
                            <img onClick={this.sendTransaction.bind(this)} src={require('./assets/add.png')} alt="add" />
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

    Invoices = () => {
        return (
            <div>
                <h1 id="header">Invoices</h1>
                <div className="mtableLink">
                    <div className="mtableInvoices">
                        <p>2017 Oktober</p>
                        <p>2500 km stand 550 Euro</p>
                    </div>
                    <div className="mtableInvoicesIcon">
                        <img src={require('./assets/Payed.png')} alt="Payed" />
                    </div>
                    <div className="carCon active">

                        <div className="mtableLink">
                            <div className="mtableTokens">1250 <p>150</p></div>
                            <div className="mtableUser">Yerontour, Monster</div>
                            <div className="mtableCar"><img src={require('./assets/tesla-models/model_3--side_profile.png')} alt="carImage" /></div>
                        </div>


                        <div className="carcol img">
                            <img onClick={this.sendTransaction.bind(this)} src={require('./assets/add.png')} alt="add" />
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
                        <img src={require('./assets/Payed.png')} alt="Payed" />
                    </div>
                </div>

                <div className="mtableLink">
                    <div className="mtableInvoices">
                        <p>2017 December</p>
                        <p>7501 km stand 550.10 Euro</p>
                    </div>
                    <div className="mtableInvoicesIcon">
                        <img src={require('./assets/Ether.png')} alt="Ether" />
                    </div>
                </div>
                <div className="mtableLink">
                    <div className="mtableInvoices">
                        <p>2018 January</p>
                        <p>7501 km stand 380 Euro</p>
                    </div>
                    <div className="mtableInvoicesIcon">
                        <img src={require('./assets/Ether.png')} alt="Ether" />
                    </div>
                </div>
                <div className="mtableLink">
                    <div className="mtableInvoices">
                        <p>2018 February</p>
                        <p>8301 km stand 300 Euro</p>
                    </div>
                    <div className="mtableInvoicesIcon">
                        <img src={require('./assets/Ether.png')} alt="Ether" />
                    </div>
                </div>

                <div className="contentBtn">
                    <input className="searchBtn" type="" name="" placeholder="Search"></input>

                </div>


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

    renderComponent = () => {
        const module = this.state.module
        switch (module) {
            case "Main":
                return this.Main()

            case "Home":
                return this.Home()

            case "Members":
                return this.Members()

            case "AddCar":
                return this.AddCar()

            case "AddMember":
                return this.AddMember()

            case "Invest":
                return this.Invest()

            case "Invoices":
                return this.Invoices()

            default:
                break;
        }
    }

    render() {
        console.log("Render State: ", this.state)
        console.log("Render Props: ", this.props)
        return (
            <div className="main-body">
                <div className="content-wrapper">
                    <div className="mainContentCon">
                        <div className="navCon">
                            {(["AddMember", "Invest"].indexOf(this.state.module) !== -1) && <i className="flaticon-left-arrow" onClick={() => this.setState({ module: "Members" })}></i>}
                            {(["AddCar"].indexOf(this.state.module) !== -1) && <i className="flaticon-left-arrow" onClick={() => this.setState({ module: "AddMember" })}></i>}
                            {(["Invoices"].indexOf(this.state.module) !== -1) && <i className="flaticon-left-arrow" onClick={() => this.setState({ module: "Invest" })}></i>}
                            <div className="float-right">
                                {(this.state.progress || this.props.progress) && <ReactLoading type="bubbles" color="#444" />}
                                <i onClick={() => this.setState({ module: "Main" })} className="flaticon-user"></i>
                            </div>
                        </div>
                        <div className="contentCon">
                            {this.renderComponent()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => state
const mapActionsToProps = (dispatch) => { return bindActionCreators(Actions, dispatch) }
export default connect(mapStateToProps, mapActionsToProps)(CarLease)
