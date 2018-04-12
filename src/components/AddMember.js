import React, { Component } from 'react'
import md5 from 'md5';
import BlockUi from 'react-block-ui';

class AddMember extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: false
        }
        this.mandatory = [
            "username",
            "town"
        ]
        this.carType = 1
    }


    componentWillMount() {
        console.log("ADD MEMBER:", this.props);
        let data = {
            module: "cars",
            query: {
                module: this.props.location.state.module
            },
            filter: {
                _id: 0
            }
        }

        let data2 = {
            module: "membersdev",
            result: "usernames",
            query: {
                module: this.props.location.state.module
            },
            filter: {
                _id: 0,
                username: 1
            }
        }

        if (!this.props.cars && this.props.socket) this.props._fetchContractData(this.props.account, data)
        if (!this.props.membersdev && this.props.socket) this.props._fetchContractData(this.props.account, data2)

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
            //         console.log("Resized Image Base64: ", resizeImage);
            //         this.setState({ [name]: resizeImage })
            //     });
            this.setState({ [name]: reader.result })
        }
    }

    checkMandatory = () => this.mandatory.every(item => this.state[item])

    createAccount = () => {
        this.setState({ progress: true })
        const self = this.state
        // let membersList = this.props.membersdev

        const carHash = '0x' + md5(self.username + self.town)

        let newMember = {
            username: self.username || '',
            fullname: self.fullname || '',
            address: self.address || '',
            town: self.town || '',
            zip: self.zip || '',
            iban: self.iban || '',
            email: self.email || '',
            message: self.message || '',
            // carPic: self.carPic || '',
            // carPrice: self.carPrice || '',
            account: self.account || this.props.account,
            profilePic: self.profilePic || '',
            // carMonRedemption: self.carMonRedemption || '',
            // carMonths: self.carMonths || '',
            module: this.props.location.state.module || 'westland'
        }

        let data = {
            module: "membersdev",
            data: newMember
        }
        // this.props._setNewContractData(data)
        // this.props._lcAddNewObject(self.carPrice, carHash, this.carType, self.carDealer, self.carMonRedemption, this.props.account, this.props.location.state.module)

        this.props._writeNewContractData(data)
    }


    render() {
        if (this.props.membersdev_new) this.props.history.push("/", { module: this.props.location.state.module, path: "members" })
        const cars = this.props.cars || []
        console.log("CARS: ", cars);
        const img = { "maxHeight": "50px", "maxWidth": "118px", "display": "block", "width": "auto", "height": "auto" }
        console.log("Add Member State: ", this.state);
        const usernames = this.props.usernames ? this.props.usernames.map(user => user.username) : []
        return (
            this.state.seeCars ?
                <div className="content-border">
                    <div className="mainContentCon">
                        {/* <i className="flaticon-back" onClick={() => this.setState({ seeCars: false })}></i>
                        <div className="float-right">
                            <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                        </div> */}
                        <div className="navCon">
                            <h1 id="header"><div className="fl"><i className="flaticon-back" onClick={() => this.setState({ seeCars: false })}></i></div>Select Car<div className="fr"><i onClick={() => this.props.history.push("/")} className="flaticon-home"></i></div></h1>
                            {/*  */}
                        </div>
                        <div className="contentCon overflow bg-none">
                            <BlockUi tag="div" blocking={this.props.progress}>

                                {/* <table style={{ borderSpacing: "0px", borderCollapse: "collapse" }}>
                                <tbody className="membersCon">
                                    {
                                        cars.map((car, i) => {
                                            return (
                                                <tr style={{ padding: "0px 0px" }} key={i} id="center-btn-container" onClick={() => { this.setState({ carModel: car.model, carPic: car.image, carPrice: car.price, carDealer: car.dealer, carMonRedemption: car.monRedemption, carMonths: car.months }) }}>
                                                    <td style={{ padding: "10px 5px" }}><img src={car.image || ""} style={img} alt={"car-" + i} /></td>
                                                    <td><span title="Model">{car.model || ""}</span></td>
                                                    <td><span title="speed">{car.speed || ""}kwh</span></td>
                                                    <td><span title="monred">{car.monRedemption || ""} Per maand</span></td>
                                                    <td><span title="months">OBV {car.months || ""} MND</span></td>
                                                    <td><span title="Price">{car.price || ""} Euro</span></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table> */}

                                <table style={{ borderSpacing: "0px", borderCollapse: "collapse" }}>
                                    <tbody className="membersCon">
                                        {
                                            cars.map((car, i) => {
                                                return (
                                                    <tr style={{ padding: "0px 0px" }} key={i} id="center-btn-container" onClick={() => { this.setState({ carModel: car.model, carPic: car.image, carPrice: car.price, carDealer: car.dealer, carMonRedemption: car.monRedemption, carMonths: car.months, carSelected: i }) }}>
                                                        <td>
                                                            <div className={this.state.carSelected === i ? "b-member-con active" : "b-member-con"}>
                                                                <div className="b-member-left">
                                                                    <span className="model" title="Model">{car.model || ""}</span>
                                                                    <span className="speed" title="speed">{car.speed || ""}kwh</span>
                                                                    <img src={car.image || ""} alt={"car-" + i} />
                                                                </div>
                                                                <div className="b-member-right">
                                                                    <span className="monred" title="monred">{car.monRedemption || ""} <span className="per">Per maand</span></span>
                                                                    <span className="months" title="months">OBV {car.months || ""} MND</span>
                                                                    <span className="price" title="Price">{car.price || ""} Euro</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                                {/* <div className="contentBtn">
                                <button onClick={this.createAccount.bind(this)}>Confirm & Publish</button>
                            </div> */}
                            </BlockUi>
                        </div>
                        <div className="footCon">
                            <div>
                                <span>Confirm & Publish</span>
                                <button className="arrowBtn" onClick={this.createAccount.bind(this)}>
                                    <img src={require('../assets/add.jpg')} alt="addM" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="content-border">
                    <div className="mainContentCon">
                        {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i> */}
                        {/* <div className="float-right">
                            <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                        </div> */}
                        <div className="navCon">
                            <h1 id="header"> <i className="flaticon-back fl" onClick={() => this.props.history.goBack()}></i>Become Member<i onClick={() => this.props.history.push("/")} className="flaticon-home fr"></i></h1>
                            {/*  */}
                        </div>
                        <div className="contentCon overflow">
                            <BlockUi tag="div" blocking={this.props.progress}>
                                <div className="form-row-container bmemberCon">
                                    <span className="form-input-containers">
                                        <input className="membership-input" maxLength="20" value={this.state.username || ""} onChange={(e) => this.setState({ username: e.target.value })} type="text" id="username" name="username" placeholder="Username *" />
                                    </span>
                                    <span className="form-input-containers">
                                        <input className="membership-input" maxLength="20" value={this.state.fullname || ""} onChange={(e) => this.setState({ fullname: e.target.value })} type="text" id="fullname" name="fullname" placeholder="Full Name" />
                                    </span>
                                    <span className="form-input-containers">
                                        <input className="membership-input" maxLength="20" value={this.state.address || ""} onChange={(e) => this.setState({ address: e.target.value })} type="text" id="address" name="address" placeholder="Address" />
                                    </span>
                                    <span className="form-input-containers">
                                        <input maxLength="30" className="membership-input" value={this.state.town || ""} onChange={(e) => this.setState({ town: e.target.value })} type="text" id="town" name="town" placeholder="Town *" />
                                    </span>
                                    <span className="form-input-containers">
                                        <input maxLength="30" className="membership-input m-b-10" value={this.state.zip || ""} onChange={(e) => this.setState({ zip: e.target.value })} type="text" placeholder="Zip Code" />
                                    </span>
                                    <span className="form-input-containers">
                                        <input pattern="\d*" maxLength="30" className="membership-input m-b-10" value={this.state.iban || ""} onChange={(e) => this.setState({ iban: e.target.value })} type="text" placeholder="IBAN" />
                                    </span>
                                    <span className="form-input-containers">
                                        <input pattern="\d*" maxLength="30" className="membership-input m-b-10" value={this.state.account || this.props.account || ""} onChange={(e) => this.setState({ account: e.target.value || this.props.account })} type="text" placeholder="Ether address" />
                                    </span>
                                    <span className="form-input-containers">
                                        <input pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" maxLength="30" className="membership-input m-b-10" value={this.state.email || ""} onChange={(e) => this.setState({ email: e.target.value })} type="text" placeholder="Email" />
                                    </span>
                                    <span className="form-input-containers marginBttm inputAddbtn">
                                        <div className="image-upload" htmlFor="imageUpload">
                                            <label style={{ "textAlign": "center", }} htmlFor="prPicIn">
                                                <img src={require('../assets/add.png')} alt="prPic" />
                                            </label>
                                            <input type="file" id="prPicIn" onChange={(e) => { this.fileUploadHandler(e.target.files[0], "profilePic") }} />
                                        </div>
                                        <label >Upload Selfie</label>

                                        {this.state.profilePic && <img className="inputImg" src={this.state.profilePic} alt="intI" />}
                                    </span>
                                    <span className="form-input-containers">
                                        <textarea className="membership-input" rows="5" value={this.state.message || ""} onChange={(e) => this.setState({ message: e.target.value })} name="message" placeholder="Your message"></textarea>
                                    </span>

                                    {/* <span className="form-input-containers marginBttm inputAddbtn">
                                    <div style={{ "textAlign": "right" }} htmlFor="imageUpload">
                                        <button style={{ "backgroundColor": "Transparent", "outline": "none", "border": "none", "padding": "0" }}
                                            onClick={() => { this.setState({ seeCars: true }) }}>
                                            <img src={require('../assets/add.png')} alt="addM" />
                                        </button>
                                    </div>
                                    <label>Select Car</label>
                                    {(this.state.carPic && !this.state.seeCars) && <img className="inputImg" src={this.state.carPic || ""} alt="CarImage" />}
                                </span> */}
                                    {
                                        /*  (this.state.carPic && !this.state.seeCars) &&
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
                        <div className="footCon">
                            <div>
                                <span>Confirm & Publish</span>
                                {console.log(`Usernames: ${usernames}, ${usernames.indexOf(this.state.username)}`)}
                                <button disabled={!this.checkMandatory() || (usernames.indexOf(this.state.username) !== -1)} title={!this.checkMandatory() ? "Please fill mandatory fields" : (usernames.indexOf(this.state.username) !== -1 ? "Username already exists" : "Select Car")} className="arrowBtn" onClick={this.createAccount.bind(this)}>
                                    <img src={require('../assets/arrow.jpg')} alt="addM" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default AddMember