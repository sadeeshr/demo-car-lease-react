import React, { Component } from 'react'
// import md5 from 'md5';
import { Link } from 'react-router-dom'
import BlockUi from 'react-block-ui';
import cc from '../lib/utils';
import Switch from "react-switch";
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

class AddMember extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: false,
            invest: false,
            invoice: false
        }
        this.mandatory = [
            "username",
            "town"
        ]
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
        // this.carType = 1
    }


    componentWillMount() {
        // cc.log("ADD MEMBER:", this.props);
        // let data = {
        //     module: "cars",
        //     query: {
        //         module: this.props.location.state.module
        //     },
        //     filter: {
        //         _id: 0
        //     }
        // }

        // if (!this.props.cars && this.props.socket) this.props._fetchContractData(data, this.props.account)
        const path = (this.props.location && this.props.location.state) ? this.props.location.state.path : ""
        if (path && path === "profile") {
            const user = this.props.usernames && this.props.usernames.find(userO => userO["account"] === this.props.account)
            // console.log(user);
            this.setState({ profile: true, ...user })
        }
    }
    componentDidMount() {
        this.props._euroAllowance(this.props.account, "invest")
        this.props._euroAllowance(this.props.account, "invoice")
    }

    fileUploadHandler = (file, name) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // sharp(new Buffer(reader.result, 'base64'))
            //     .resize(200, 200)
            //     .max()
            //     .toFormat('jpeg')
            //     .toBuffer()
            //     .then(function (outputBuffer) {
            //         // outputBuffer contains JPEG image data no wider than 200 pixels and no higher
            //         // than 200 pixels regardless of the inputBuffer image dimensions
            //         let resizeImage = outputBuffer.toString('base64')
            //         cc.log("Resized Image Base64: ", resizeImage);
            //         this.setState({ [name]: resizeImage })
            //     });
            this.setState({ [name]: reader.result })
        }
    }

    checkMandatory = () => this.mandatory.every(item => this.state[item])

    createAccount = () => {
        this.setState({ progress: true })
        const self = this.state

        if (this.state.profile) {
            // console.log("UPDATE Profile here")
            let updateMember = {
                address: self.address || '',
                town: self.town || '',
                zip: self.zip || '',
                email: self.email || '',
                message: self.message || '',
                profilePic: self.profilePic || ''
            }

            let data = {
                module: "membersdev4",
                result: "usernames",
                query: {
                    "_id": this.state["_id"]
                },
                data: updateMember
            }

            this.props._updateContractData(this.props, data)

        } else {

            // let membersList = this.props.members

            // const objectHash = '0x' + md5(self.username + self.town)

            let newMember = {
                username: self.username || '',
                fullname: self.fullname || '',
                address: self.address || '',
                town: self.town || '',
                zip: self.zip || '',
                iban: self.iban || '',
                email: self.email || '',
                message: self.message || '',
                currency: self.currency || 'EUR',
                // objectPic: self.objectPic || '',
                // objectPrice: self.objectPrice || '',
                account: self.account || this.props.account,
                profilePic: self.profilePic || '',
                coins: []
                // carMonRedemption: self.carMonRedemption || '',
                // carMonths: self.carMonths || '',
                // municipalityID: townSelected ? townSelected["municipalityID"] : ""
            }

            let data = {
                module: "membersdev4",
                result: "usernames",
                data: newMember
            }
            // this.props._setNewContractData(data)

            this.props._writeNewContractData(this.props, data)

        }

    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.investallowance && (nextProps.investallowance !== this.props.investallowance)) || (nextProps.invoiceallowance && (nextProps.invoiceallowance !== this.props.invoiceallowance))) {
            this.setState({
                invest: (nextProps.investallowance && nextProps.investallowance > 0) ? true : false,
                invoice: (nextProps.invoiceallowance && nextProps.invoiceallowance > 0) ? true : false
            })
        }
        if (nextProps.approveTxID && (nextProps.approveTxID !== this.props.approveTxID)) {
            // console.log("### PENDING ###");
            this.setState({ pending: true })
        }
        if (nextProps.event && (nextProps.event !== this.props.event) && (nextProps.event.event === "Approve") && (nextProps.event.transactionHash === nextProps.approveTxID))
            this.setState({ pending: false },
                () =>
                    setTimeout(() => {
                        this.props._resetTxIds()
                    }, 5000))

        if (nextProps.usernames_new || nextProps.usernames_edit) {
            this.props._fetchUsers(nextProps, nextProps.account)
            // if (nextProps.usernames_new)
            this.props.history.push("/", { path: "members" })
        }
    }

    render() {
        const currencies = [
            { label: 'Euro', value: 'EUR' },
            // { label: 'Dollars', value: 'USD' },
            // { label: 'Rupees', value: 'INR' },
            // { label: 'Pesos', value: 'Peso' }
        ];
        const img = { "maxHeight": "100px", "maxWidth": "118px", "display": "block", "marginLeft": "auto", "marginRight": "auto" }
        const cursor = { cursor: this.state.profile ? "not-allowed" : "pointer" }
        cc.log("Add Member State: ", this.state, this.props);
        const usernames = this.props.usernames ? this.props.usernames.map(user => user.username) : []
        return (
            <div className="content-border no-border-r-mobile">
                <div >
                    <div hidden className="container">
                        <span className="lh-40"><strong>MIJN > PROFIEL</strong></span>
                    </div>
                </div>
                <div className="mainContentCon">
                    {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i> */}
                    {/* <div className="float-right">
                            <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                        </div> */}
                    <div hidden className="navCon">
                        <h1 id="header"> <i className="flaticon-back fl" onClick={() => this.props.history.goBack()}></i>Become Member<i onClick={() => this.props.history.push("/")} className="flaticon-home fr"></i></h1>
                        {/*  */}
                    </div>
                    <div className="contentCon overflow contentCon-8 pt-8" style={{ height: "auto" }}>
                        <BlockUi tag="div" blocking={this.props.progress}>
                            <div className="form-row-container bmemberCon">
                                <span className="form-input-containers">
                                    <input style={cursor} readOnly={this.state.profile} className="membership-input" maxLength="20" value={this.state.username || ""} onChange={(e) => this.setState({ username: e.target.value })} type="text" id="username" name="username" placeholder="User Name *" />
                                </span>
                                <span className="form-input-containers">
                                    <input pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" maxLength="30" className="membership-input mb-15" value={this.state.email || ""} onChange={(e) => this.setState({ email: e.target.value })} type="text" placeholder="Email" />
                                </span>
                                {/*{!this.state.profile && <span className="form-input-containers">
                                    <input style={cursor} readOnly={this.state.profile} className="membership-input" maxLength="20" value={this.state.fullname || ""} onChange={(e) => this.setState({ fullname: e.target.value })} type="text" id="fullname" name="fullname" placeholder="Full Name" />
                                </span>}
                                {!this.state.profile && <span className="form-input-containers">
                                    <input className="membership-input" maxLength="20" value={this.state.address || ""} onChange={(e) => this.setState({ address: e.target.value })} type="text" id="address" name="address" placeholder="Address" />
                                </span>}*/}
                                <span className="form-input-containers">
                                    <input maxLength="30" className="membership-input" value={this.state.town || ""} onChange={(e) => this.setState({ town: e.target.value })} type="text" id="town" name="town" placeholder="Town *" />
                                </span>
                                {/*{!this.state.profile && <span className="form-input-containers">
                                    <input maxLength="30" className="membership-input mb-15" value={this.state.zip || ""} onChange={(e) => this.setState({ zip: e.target.value })} type="text" placeholder="Zip Code" />
                                </span>}
                                {!this.state.profile && <span className="form-input-containers">
                                    <input style={cursor} readOnly={this.state.profile} pattern="\d*" maxLength="30" className="membership-input mb-15" value={this.state.iban || ""} onChange={(e) => this.setState({ iban: e.target.value })} type="text" placeholder="IBAN" />
                                </span>}*/}

                                <span className="form-input-containers marginBttm inputAddbtn">
                                    <div className="upload-selfieCon">
                                        <div className="image-upload" htmlFor="imageUpload">
                                            <label className="image-upload-selfieCon" style={{ "textAlign": "center", }} htmlFor="prPicIn">
                                                <img className="image-upload-selfie" src={require('../assets/upload.jpg')} alt="prPic" />
                                            </label>
                                            <input type="file" id="prPicIn" onChange={(e) => { this.fileUploadHandler(e.target.files[0], "profilePic") }} />
                                        </div>
                                        <label >Upload Selfie</label>
                                    </div>
                                </span>

                                <span className="form-input-containers ">
                                    <input style={cursor} readOnly={this.state.profile} pattern="\d*" maxLength="30" className="membership-input mb-15" value={this.state.account || this.props.account || ""} onChange={(e) => this.setState({ account: e.target.value || this.props.account })} type="text" placeholder="Ether address" />
                                </span>

                                <Dropdown className="form-input-containers" value={this.state.currency} options={currencies} onChange={(e) => { this.setState({ currency: e.value }) }} placeholder="Currency" />


                                <span className="form-input-containers ">
                                    {this.state.profilePic && <img style={img} className="inputImg" src={this.state.profilePic} alt="intI" />}
                                </span>

                                <span className="form-input-containers text-center">
                                    {this.props.approveTxID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.approveTxID}>{(this.props.event && (this.props.event.transactionHash === this.props.approveTxID)) ? <p style={{ color: "green", fontSize: "18px", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Confirmed</p> : <p style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Pending</p>}</Link>)}
                                    {/* <p style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", width: "100%" }}>Pending</p> */}
                                    {/* <p style={{ color: "green", fontSize: "18px", fontWeight: "600", width: "100%" }}>Confirmed</p> */}
                                </span>

                                <span className="form-input-containers">
                                    <div className="switch-container">
                                        <div className="col-6">
                                            <span className="switch-name">Investeren</span>
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="invest">
                                                <Switch
                                                    disabled={this.state.pending}
                                                    onChange={() => this.setState({ invest: !this.state.invest }, () => this.props.account && this.props._euroApprove(this.state.invest ? 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF : 0, this.props.account, "invest"))}
                                                    checked={this.state.invest}
                                                    id="invest"
                                                    onColor="#119f13"
                                                    offColor="#ff8000"
                                                    offHandleColor="#fff"
                                                    onHandleColor="#fff"
                                                    height={32}
                                                    width={90}
                                                    checkedIcon={
                                                        <div className="switchLabel">
                                                            aan
                                                    </div>
                                                    }
                                                    uncheckedIcon={
                                                        <div className="switchLabel">
                                                            uit
                                                        </div>
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </span>
                                <span className="form-input-containers">
                                    <div className="switch-container">
                                        <div className="col-6">
                                            <span className="switch-name">Betalen</span>
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="invoice">
                                                <Switch
                                                    disabled={this.state.pending}
                                                    onChange={() => this.setState({ invoice: !this.state.invoice }, () => this.props.account && this.props._euroApprove(this.state.invest ? 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF : 0, this.props.account, "invoice"))}
                                                    checked={this.state.invoice}
                                                    id="invoice"
                                                    onColor="#119f13"
                                                    offColor="#ff8000"
                                                    offHandleColor="#fff"
                                                    onHandleColor="#fff"
                                                    height={32}
                                                    width={90}
                                                    checkedIcon={
                                                        <div className="switchLabel">
                                                            aan
                                                    </div>
                                                    }
                                                    uncheckedIcon={
                                                        <div className="switchLabel">
                                                            uit
                                                        </div>
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </span>
                                {/*!this.state.profile && <span className="form-input-containers">
                                    <textarea className="membership-input" rows="5" value={this.state.message || ""} onChange={(e) => this.setState({ message: e.target.value })} name="message" placeholder="Your message"></textarea>
                            </span>*/}

                                {/* <span className="form-input-containers marginBttm inputAddbtn">
                                    <div style={{ "textAlign": "right" }} htmlFor="imageUpload">
                                        <button style={{ "backgroundColor": "Transparent", "outline": "none", "border": "none", "padding": "0" }}
                                            onClick={() => { this.setState({ seeCars: true }) }}>
                                            <img src={require('../assets/add.png')} alt="addM" />
                                        </button>
                                    </div>
                                    <label>Select Car</label>
                                    {(this.state.objectPic && !this.state.seeCars) && <img className="inputImg" src={this.state.objectPic || ""} alt="CarImage" />}
                                </span> */}
                                {
                                    /*  (this.state.objectPic && !this.state.seeCars) &&
                                      <div>
                                          <span className="form-input-containers">
                                              <input className="membership-input" id="carDriver" value={this.state.carDriver || ""} onChange={(e) => this.setState({ carDriver: e.target.value })} type="text" placeholder="Car Driver Address" />
                                          </span>
                                          <span className="form-input-containers">
                                              <input className="membership-input" id="monCons" value={this.state.monRedemption || ""} onChange={(e) => this.setState({ monRedemption: e.target.value })} type="text" placeholder="Monthly Redemption" />
                                          </span>
                                      </div>
                               
                                  
                                  <span className="form-input-containers marginBttm inputAddbtn">
                                      <div className="image-upload" htmlFor="imageUpload">
                                          <label style={{ "textAlign": "center", }} htmlFor="prPicIn">
                                              <img src={require('../assets/add.png')} alt="prPic" />
                                          </label>
                                          <input type="file" id="prPicIn" onChange={(e) => { this.fileUploadHandler(e.target.files[0], "profilePic") }} />
                                      </div>
                                      <label >Profile Pic</label>
      
                                      {this.state.profilePic && <img className="inputImg" src={this.state.profilePic} alt="intI" />}
                                  </span>
      
                                  <span className="form-input-containers marginBttm inputAddbtn">
                                      <div className="image-upload" htmlFor="imageUpload">
                                          <label style={{ "textAlign": "center" }} htmlFor="prID">
                                              <img src={require('../assets/add.png')} alt="intI" />
                                          </label>
                                          <input type="file" id="prID" onChange={(e) => { this.fileUploadHandler(e.target.files[0], "profileID") }} />
                                      </div>
                                      <label >Profile ID</label>
      
                                      {this.state.profileID && <img className="inputImg" src={this.state.profileID} alt="inputI" />}
                                  </span>
                                  */
                                }
                            </div>
                        </BlockUi>
                    </div>
                </div>
                <div className="footBtn container">
                    <div className="container text-center">
                        <div className="beforeFooter">
                            <div className="col-4">
                                &nbsp;
                            </div>
                            <div className="col-4 arrowHover-s2">
                                <button disabled={this.state.profile ? false : (!this.checkMandatory() || (usernames.indexOf(this.state.username) !== -1))} title={this.state.profile ? "Update" : (!this.checkMandatory() ? "Please fill mandatory fields" : (usernames.indexOf(this.state.username) !== -1 ? "Username already exists" : "New Life Configuration"))} className="arrowBtn" onClick={this.createAccount.bind(this)}>
                                    <span className="flaticon-right-arrow"></span>
                                </button>
                            </div>
                            <div className="col-4 text-left padding-10-0">
                                <span> &nbsp;</span>
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
            </div>



        )
    }
}

export default AddMember

// this.state.seeCars ?
// <div className="content-border">
//     <div className="mainContentCon">
//         {/* <i className="flaticon-back" onClick={() => this.setState({ seeCars: false })}></i>
//         <div className="float-right">
//             <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
//         </div> */}
//         <div className="navCon">
//             <h1 id="header"><div className="fl"><i className="flaticon-back" onClick={() => this.setState({ seeCars: false })}></i></div>Select Car<div className="fr"><i onClick={() => this.props.history.push("/")} className="flaticon-home"></i></div></h1>
//             {/*  */}
//         </div>
//         <div className="contentCon overflow bg-none">
//             <BlockUi tag="div" blocking={this.props.progress}>

//                 {/* <table style={{ borderSpacing: "0px", borderCollapse: "collapse" }}>
//                 <tbody className="membersCon">
//                     {
//                         cars.map((car, i) => {
//                             return (
//                                 <tr style={{ padding: "0px 0px" }} key={i} id="center-btn-container" onClick={() => { this.setState({ carModel: car.model, objectPic: car.image, objectPrice: car.price, objectDealer: car.dealer, carMonRedemption: car.monRedemption, carMonths: car.months }) }}>
//                                     <td style={{ padding: "10px 5px" }}><img src={car.image || ""} style={img} alt={"car-" + i} /></td>
//                                     <td><span title="Model">{car.model || ""}</span></td>
//                                     <td><span title="speed">{car.speed || ""}kwh</span></td>
//                                     <td><span title="monred">{car.monRedemption || ""} Per maand</span></td>
//                                     <td><span title="months">OBV {car.months || ""} MND</span></td>
//                                     <td><span title="Price">{car.price || ""} Euro</span></td>
//                                 </tr>
//                             )
//                         })
//                     }
//                 </tbody>
//             </table> */}

//                 <table style={{ borderSpacing: "0px", borderCollapse: "collapse" }}>
//                     <tbody className="membersCon">
//                         {
//                             cars.map((car, i) => {
//                                 return (
//                                     <tr style={{ padding: "0px 0px" }} key={i} id="center-btn-container" onClick={() => { this.setState({ carModel: car.model, objectPic: car.image, objectPrice: car.price, objectDealer: car.dealer, carMonRedemption: car.monRedemption, carMonths: car.months, carSelected: i }) }}>
//                                         <td>
//                                             <div className={this.state.carSelected === i ? "b-member-con active" : "b-member-con"}>
//                                                 <div className="b-member-left">
//                                                     <span className="model" title="Model">{car.model || ""}</span>
//                                                     <span className="speed" title="speed">{car.speed || ""}kwh</span>
//                                                     <img src={car.image || ""} alt={"car-" + i} />
//                                                 </div>
//                                                 <div className="b-member-right">
//                                                     <span className="monred" title="monred">{car.monRedemption || ""} <span className="per">Per maand</span></span>
//                                                     <span className="months" title="months">OBV {car.months || ""} MND</span>
//                                                     <span className="price" title="Price">{car.price || ""} Euro</span>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )
//                             })
//                         }
//                     </tbody>
//                 </table>

//                 {/* <div className="contentBtn">
//                 <button onClick={this.createAccount.bind(this)}>Confirm & Publish</button>
//             </div> */}
//             </BlockUi>
//         </div>
//         <div className="footCon">
//             <div>
//                 <span>Confirm & Publish</span>
//                 <button className="arrowBtn" onClick={this.createAccount.bind(this)}>
//                     <img src={require('../assets/add.jpg')} alt="addM" />
//                 </button>
//             </div>
//         </div>
//     </div>
// </div>
