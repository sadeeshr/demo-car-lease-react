import React, { Component } from 'react'
import md5 from 'md5';

class AddMember extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }


    componentWillMount() {
        console.log(this.props);
    }

    fileUploadHandler = (file, name) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => this.setState({ [name]: reader.result })
    }

    createAccount = () => {
        const self = this.state
        const module = this.props[this.props.module]
        let membersList = module.members

        //get Max Car ID from members list
        let itemArray = membersList ? membersList.map(item => item["carID"]) : []
        let max = itemArray.length > 0 ? Math.max(...itemArray) : 0
        let incValue = max + 1
        console.log("Car ID: Incremented Value: ", incValue)
        const carID = incValue
        const carHash = '0x' + md5(this.state.carModel + carID)

        let newMember = {
            username: self.username || '',
            fullname: self.fullname || '',
            address: self.address || '',
            city: self.city || '',
            county: self.county || '',
            message: self.message || '',
            carID: carID || '',
            carPic: self.carPic || '',
            profileID: self.profileID || '',
            profilePic: self.profilePic || ''
        }
        membersList.push(newMember)
        console.log(membersList);
        this.setState({ module: "Members" })
        let dbVar = this.props.module + ".members"
        this.props._updateContractData({ [dbVar]: membersList })
        this.AddNewCar(carID, carHash) // push to blockchain
    }

    AddNewCar = (carID, carHash) => {
        this.props.contract.AddNewCar(carID, carHash, this.state.carDealer, this.state.carDriver, this.state.monRedemption, { from: this.props.account })
            .then(result => {
                console.log("ADD NEW CAR RESULT: ", result)
            })
    }

    render() {
        const cars = this.props[this.props.module] ? this.props[this.props.module].cars : []
        console.log("CARS: ", cars);
        const img = { "maxHeight": "95px", "maxWidth": "230px", "display": "block", "width": "auto", "height": "auto" }
        console.log("Add Member State: ", this.state);
        return (
            <div>
                <div>
                    <h1 id="header">Become Member</h1>
                    <div className="form-row-container">
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
                            <input maxLength="30" className="membership-input" value={this.state.state || ""} onChange={(e) => this.setState({ state: e.target.value })} type="text" id="state" name="state" placeholder="State" />
                        </span>
                        <span className="form-input-containers">
                            <input maxLength="30" className="membership-input" value={this.state.county || ""} onChange={(e) => this.setState({ county: e.target.value })} type="text" placeholder="County" />
                        </span>

                        <span className="form-input-containers">
                            <textarea className="membership-input" rows="5" value={this.state.message || ""} onChange={(e) => this.setState({ message: e.target.value })} name="message" placeholder="Your message"></textarea>
                        </span>

                        <span className="form-input-containers marginBttm inputAddbtn">
                            <div style={{ "textAlign": "right" }} htmlFor="imageUpload">

                                {/*   <button style={{ "backgroundColor": "Transparent", "outline": "none", "border": "none", "padding": "0" }} onClick={() => { this.setState({ module: "AddCar" }) }}><img src={require('../assets/add.png')} alt="addM" /></button>
                            </div>
                            <label>Add Car</label>
                            {this.state.carPic && <img className="inputImg" src={this.state.carPic} alt="ncintI" />}
                        </span>*/}

                                <button style={{ "backgroundColor": "Transparent", "outline": "none", "border": "none", "padding": "0" }}
                                    onClick={() => { this.setState({ seeCars: true }) }}>
                                    <img src={require('../assets/add.png')} alt="addM" />
                                </button>
                            </div>
                            <label>Select Car</label>
                            {(this.state.carPic && !this.state.seeCars) && <img className="inputImg" src={this.state.carPic || ""} alt="CarImage" />}
                        </span>
                        {
                            (this.state.carPic && !this.state.seeCars) &&
                            <div>
                                <span className="form-input-containers">
                                    <input className="membership-input" id="carDriver" value={this.state.carDriver || ""} onChange={(e) => this.setState({ carDriver: e.target.value })} type="text" placeholder="Car Driver Address" />
                                </span>
                                <span className="form-input-containers">
                                    <input className="membership-input" id="monCons" value={this.state.monRedemption || ""} onChange={(e) => this.setState({ monRedemption: e.target.value })} type="text" placeholder="Monthly Redemption" />
                                </span>
                            </div>
                        }
                        {
                            this.state.seeCars &&
                            cars.map((car, i) => {
                                return (
                                    <div key={i} id="center-btn-container" onClick={() => { this.setState({ carModel: car.model, seeCars: false, carPic: car.image, carDealer: car.dealer }) }}>
                                        <img src={car.image || ""} style={img} alt={car.model} />
                                    </div>
                                )
                            })
                        }
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

                        {!this.props.account ? <div className="carTitle">Please Unlock Your Metamask Account.</div> :
                            <div className="contentBtn">
                                <button onClick={this.createAccount.bind(this)}>Create Account</button>
                            </div>}
                    </div>
                </div>
            </div >
        )
    }
}

export default AddMember