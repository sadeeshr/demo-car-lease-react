import React, { Component } from 'react'
import ledgerApi from './lib/Ledger';
import BigNumber from 'bignumber.js';
import ReactLoading from 'react-loading';
import util from 'ethereumjs-util';
import * as Actions from './actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FileBase64 from 'react-file-base64';
import FileProcessor from 'react-file-processor';

class CarLease extends Component {
    constructor(props) {
        super(props)
        this.state = {
            clicked: {
                fname: ""
            },
            progress: false
        }
    }



    componentWillMount() {
        this.props._connectSocket(this.props);
    }

    componentDidMount() {
        this.setState({ module: "Main" })
    }

    fetchContractData(module) {
        this.props._fetchContractData(module)
        this.setState({ module: "Home" })
    }

    fileUploadHandler = (file, name) => {
        // Make new FileReader
        let reader = new FileReader();

        // Convert the file to base64 text
        reader.readAsDataURL(file);

        // on reader load somthing...
        reader.onload = () => {

            // Make a fileInfo Object
            // let fileInfo = {
            //     name: file.name,
            //     type: file.type,
            //     size: Math.round(file.size / 1000) + ' kB',
            //     base64: reader.result,
            //     file: file,
            // };

            // Push it to the state
            this.setState({ [name]: reader.result })
        }
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
            carTitle: self.carTitle || '',
            id: self.carId || '',
            profileID: self.profileID || '',
            profilePic: self.profilePic || ''
        }
        let membersList = this.props[this.props.module].members
        console.log(membersList)
        membersList.push(newMember)
        console.log(membersList);
        this.setState({ module: "Members" })
        let dbVar = this.props.module + '.' + "members"
        this.props._updateContractData({ [dbVar]: membersList })
        console.log(self);
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
                            <button onClick={() => this.setState({ module: "Members" })}><img src={require('./assets/add.png')} alt="" /></button>
                        </div>
                    </div>
                    {/* <div className="contentBtn">
                        <button onClick={() => this.setState({ module: "Members" })}>Members</button>
                    </div> */}
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
                        <button onClick={() => this.setState({ module: "AddMember" })}>Jouw gemeente hier<img src={require('./assets/add.png')} alt="" /></button>
                    </div>
                </div>
            </div>
        )
    }

    renderMember = (member, i) => {
        const img = { "display": "block" }
        const selected = this.state.clicked.fname === member.fname ? true : false
        let memberRows = [
            // <tr key={i} onClick={() => this.state.clicked !== member ? this.setState({ clicked: member }) : this.setState({ clicked: { fname: "" } })}>
            //     <td> {member.tokens} <p>{member.earned && "\n" + member.earned}</p></td>
            //     <td colspan="2"> {member.fname}, {member.lname}</td>
            //     <td > <img style={img} src={member.car} alt="carImage" /></td>
            // </tr>


            <div className="mtableLink" key={i} onClick={() => this.state.clicked !== member ? this.setState({ clicked: member }) : this.setState({ clicked: { fname: "" } })}>
                <div className="mtableTokens">{member.tokens} <p>{member.earned && "\n" + member.earned}</p></div>
                <div className="mtableUser">{member.fname}, {member.lname}</div>
                <div className="mtableCar"><img style={img} src={member.car} alt="carImage" /></div>
            </div>

        ]
        // carImage
        // if (member.earned) {
        //     memberRows.push(
        //         <tr key={'earnings-' + i}>
        //             <td>{member.earned}
        //             </td>
        //         </tr>
        //     )
        // }

        if (selected) {
            memberRows.push(

                // <tr className="rowSelect" key={'invest-' + i}>
                //     <td colspan="3" className="memberMesCon">{member.message}</td>

                //     <td colspan="1">
                //         <div className="membersBtn">
                //             <a href="#" onClick={() => this.setState({ module: "Invest" })}>

                //                 <p><img src={require('./assets/add.png')} alt="test" /> Vote</p>
                //             </a>
                //         </div>
                //         <div className="membersBtn">
                //             <a href="#" onClick={() => this.setState({ module: "Invest" })}>

                //                 <p><img src={require('./assets/add.png')} alt="test" /> Invest</p>
                //             </a>
                //         </div>
                //     </td>
                // </tr>


                <div className="rowSelect" key={'invest-' + i}>
                    <div className="memberMesCon">{member.message}</div>
                    <div className="memberMesBtns">
                        <div className="membersBtn">
                            <a href="#" onClick={() => this.setState({ module: "Invest" })}>

                                <p><img src={require('./assets/add.png')} alt="test" /> Vote</p>
                            </a>
                        </div>
                        <div className="membersBtn">
                            <a href="#" onClick={() => this.setState({ module: "Invest" })}>

                                <p><img src={require('./assets/add.png')} alt="test" /> Invest</p>
                            </a>
                        </div>
                    </div>
                </div>




            )
        }

        return memberRows
    }

    AddMember = () => {
        const cars = this.props[this.props.module] ? this.props[this.props.module].cars : []
        const img = { "maxHeight": "95px", "maxWidth": "230px", "display": "block", "width": "auto", "height": "auto" }
        
        return (
            <div>
                <div>
                    <h1 id="header">become member</h1>
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
                            <div htmlFor="imageUpload">
                                <button style={{ "background-color": "Transparent", "outline" : "none", "border" : "none" }} onClick={() => { console.log("I m clicked") }}><img src={require('./assets/add.png')} /></button>


                            </div>
                            <label>Select Car</label>

                            {this.state.profilePic && <img className="inputImg" src={this.state.profilePic} />}
                        </span>

                        <span className="form-input-containers marginBttm inputAddbtn">
                            <div className="image-upload" htmlFor="imageUpload">
                                <label styel={{ "top": "0", "left": "100%" }} htmlFor="prPicIn">
                                    <img src={require('./assets/add.png')} />
                                </label>
                                <input type="file" id="prPicIn" onChange={(e) => { this.fileUploadHandler(e.target.files[0], "profilePic") }} />
                            </div>
                            <label >Profile Pic</label>

                            {this.state.profilePic && <img className="inputImg" src={this.state.profilePic} />}
                        </span>

                        <span className="form-input-containers marginBttm inputAddbtn">
                            <div className="image-upload" htmlFor="imageUpload">
                                <label styel={{ "top": "0", "left": "100%" }} htmlFor="prID">
                                    <img src={require('./assets/add.png')} />
                                </label>
                                <input type="file" id="prID" onChange={(e) => { this.fileUploadHandler(e.target.files[0], "profileID") }} />
                            </div>
                            <label >Profile ID</label>

                            {this.state.profileID && <img className="inputImg" src={this.state.profileID} />}
                        </span>



                        {/* <div id="center-btn-container" className="btn-container-member contentBtn">
                                <button type="button" className="btnwithAdd" onClick={() => { this.setState({ seeCars: true }) }}>
                                    <img className="addBtn" src={require('./assets/add.png')} alt="test" />
                                    <div className="btnName">{this.state.carTitle || "Select Car"}</div>
                                </button>
                            </div> */}

                        <div className="contentBtn selectCar" >
                            <a href="#" onClick={() => { this.setState({ seeCars: true }) }}>
                                <img src={require('./assets/add.png')} />
                            </a>
                            <p>{this.state.carTitle || "Select Car"}</p>

                        </div>



                        {
                            this.state.seeCars &&
                            cars.map((car, i) => {
                                return (
                                    <div key={i} id="center-btn-container" onClick={() => { this.setState({ carTitle: car.title, seeCars: false, carId: car.id, car: car.image }) }}>
                                        <img src={car.image || ""} style={img} alt={car.title} />
                                    </div>
                                )
                            })
                        }
                        {(this.state.car && !this.state.seeCars) && <img src={this.state.car || ""} alt="CarImage" />}


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


                {/* <table className="tableCon members">
                    <thead>
                        <tr>
                            <th>EVTokens </th><th colspan="2">User Town</th><th>Car</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (this.props.module && this.props[this.props.module]) ? this.props[this.props.module].members.map((member, i) => {
                                return this.renderMember(member, i)
                            }) : []
                        }
                    </tbody>
                </table> */}
                <div className="contentBtn">
                    <input className="searchBtn" type="" name="" placeholder="Search"></input>

                </div>
                <div className="contentBtn addMe" >
                    {/* <button type="button" onClick={() => this.setState({ module: "AddMember" })} className="btnwithAdd">
                        <img className="addBtn" src={require('./assets/add.png')} alt="test" />
                        <div className="btnName">Add Me</div>
                    </button> */}

                    <a href="#" onClick={() => this.setState({ module: "AddMember" })}>
                        <img src={require('./assets/add.png')} />
                        <p>Add Me</p></a>
                </div>
            </div>)
    }

    Invest = () => {
        const cars = this.props[this.props.module].cars
        return (
            <div>
                <h1 id="header">Invest</h1>
                <div className="carIntestCon">
                    <div className="carCon">
                        <div className="carcol">
                            <div className="carTitle">Total raised: {cars[this.state.clicked.id - 1].label}</div>
                            <div className="carEth">{cars[this.state.clicked.id - 1].raised} ETH</div>
                            <div className="carPrice">{cars[this.state.clicked.id - 1].price} &#8364;</div>
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

            </div>
        )
    }

    Invoices = () => {
        return (
            <div>
                <h1 id="header">Invoices</h1>
                <div class="mtableLink">
                    <div class="mtableInvoices">
                        <p>2017 Oktober</p>
                        <p>2500 km stand 550 Euro</p>
                    </div>
                    <div class="mtableInvoicesIcon">
                        <img src={require('./assets/Payed.png')} alt="Payed" />
                    </div>
                </div>
                <div class="mtableLink">
                    <div class="mtableInvoices">
                        <p>2017 November</p>
                        <p>5000 km stand 550 Euro</p>
                    </div>
                    <div class="mtableInvoicesIcon">
                        <img src={require('./assets/Payed.png')} alt="Payed" />
                    </div>
                </div>

                <div class="mtableLink">
                    <div class="mtableInvoices">
                        <p>2017 December</p>
                        <p>7501 km stand 550.10 Euro</p>
                    </div>
                    <div class="mtableInvoicesIcon">
                        <img src={require('./assets/Ether.png')} alt="Ether" />
                    </div>
                </div>
                <div class="mtableLink">
                    <div class="mtableInvoices">
                        <p>2018 January</p>
                        <p>7501 km stand 380 Euro</p>
                    </div>
                    <div class="mtableInvoicesIcon">
                        <img src={require('./assets/Ether.png')} alt="Ether" />
                    </div>
                </div>
                <div class="mtableLink">
                    <div class="mtableInvoices">
                        <p>2018 February</p>
                        <p>8301 km stand 300 Euro</p>
                    </div>
                    <div class="mtableInvoicesIcon">
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
                            <div className="float-right">
                                {this.state.progress && <ReactLoading type="bubbles" color="#444" />}
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


//     <span className = "form-input-containers marginBttm" >
//         <label className="textbtn" htmlFor="imageUpload">{"Profile Pic"}</label>
//         <FileBase64 multiple={false} onDone={(file) => this.setState({ profilePic: file.base64 })} />
//     </span >
//     <span className="form-input-containers marginBttm">
//         {this.state.profilePic && <img style={img} src={this.state.profilePic} alt="prPic" />}
//     </span>
//     <span className="form-input-containers marginBttm">
//         <label className="textbtn" htmlFor="imageUpload2">{"Upload ID"}</label>
//         <FileBase64 multiple={false} onDone={(file) => this.setState({ profileID: file.base64 })} />
//     </span>
//     <span className="form-input-containers marginBttm">
//         {this.state.profileID && <img style={img} src={this.state.profileID} alt="prId" />}
//     </span>
