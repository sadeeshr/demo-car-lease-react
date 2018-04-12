import React, { Component } from 'react'
import md5 from 'md5';
import BlockUi from 'react-block-ui';

import ReactDOM from 'react-dom';
import Coverflow from 'react-coverflow';


const fn = function () {
    /* do your action */
}

class AddNewLifeConfigurator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: false
        }

        this.carType = 1
    }


    componentWillMount() {
        console.log("ADD OBJECT:", this.props);
        let data = {
            module: "carsdev",
            result: "cars",
            query: {
                module: this.props.location.state.module
            },
            filter: {
                _id: 0
            }
        }

        if (!this.props.cars && this.props.socket) this.props._fetchContractData(this.props.account, data)

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
        // let membersList = this.props.members

        const carHash = '0x' + md5(self.username + self.town)

        // let newMember = {
        //     username: self.username || '',
        //     fullname: self.fullname || '',
        //     address: self.address || '',
        //     town: self.town || '',
        //     zip: self.zip || '',
        //     iban: self.iban || '',
        //     email: self.email || '',
        //     message: self.message || '',
        //     // carPic: self.carPic || '',
        //     // carPrice: self.carPrice || '',
        //     account: self.account || this.props.account,
        //     profilePic: self.profilePic || '',
        //     // carFee: self.carFee || '',
        //     // carMonths: self.carMonths || '',
        //     module: this.props.location.state.module || 'westland'
        // }

        // let data = {
        //     module: "members",
        //     data: newMember
        // }
        // this.props._setNewContractData(data)
        this.props._lcAddNewObject(self.carPrice, carHash, this.carType, self.carDealer, self.carFee, self.carTerm, self.carMileage, this.props.account, this.props.location.state.module)

        // this.props._writeNewContractData(data)
    }


    render() {
        // if (this.props.members_new) this.props.history.goBack()
        console.log(this.props.member);
        const cars = this.props.cars || []
        console.log("CARS: ", cars);
        const img = { "maxHeight": "50px", "maxWidth": "118px", "display": "block", "width": "auto", "height": "auto" }
        return (
            <div className="content-border">
                <div className="mainContentCon">

                    <div className="navCon">
                        <h1 id="header"><div className="fl"><i className="flaticon-back" onClick={() => this.props.history.goBack()}></i></div>Select Car<div className="fr"><i onClick={() => this.props.history.push("/")} className="flaticon-home"></i></div></h1>
                    </div>

                    <div className="contentCon overflow bg-none">
                        <BlockUi tag="div" blocking={this.props.progress}>
                            {/*
                            <table style={{ borderSpacing: "0px", borderCollapse: "collapse" }}>
                                <tbody className="membersCon">
                                    {
                                        cars.map((car, i) => {
                                            return (
                                                <tr style={{ padding: "0px 0px" }} key={i} id="center-btn-container" onClick={() => { this.setState({ carModel: car.model, carPic: car.image, carPrice: car.price, carDealer: car.dealer, carFee: car.fee, carTerm: car.term, carMileage: car.mileage, carSelected: i }) }}>
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
                            </table>  */}


                            <div className="newLifeCon">
                                <Coverflow
                                    width={'auto'}
                                    height={430}
                                    displayQuantityOfSide={0}
                                    navigation={false}
                                    enableHeading={false}
                                    active={0}
                                >
                                    {
                                        cars.map((car, i) => {
                                            return (
                                                <div key={i} className="newLifeItem">
                                                    <div className="newlifeImage">
                                                        <img src={car.image} alt={car.model} />
                                                    </div>
                                                    <div className="newLifeDetails">
                                                        <span className="nl-con">
                                                            <label className="nl-label">Color</label>
                                                            <div className="nl-inp">{car.color}</div>
                                                        </span>
                                                        <span className="nl-con">
                                                            <label className="nl-label">Fee</label>
                                                            <div className="nl-inp">{car.fee}</div>
                                                        </span>
                                                        <span className="nl-con">
                                                            <label className="nl-label">Mnd</label>
                                                            <div className="nl-inp">{car.term}</div>
                                                        </span>
                                                        <span className="nl-con">
                                                            <label className="nl-label">Price</label>
                                                            <div className="nl-inp">{car.price}</div>
                                                        </span>
                                                        <span className="nl-con">
                                                            <label className="nl-label">Price</label>
                                                            <div className="nl-inp">Reservation</div>
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </Coverflow>
                            </div>





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

        )
    }
}

export default AddNewLifeConfigurator


//     < div
// onClick = {() => fn()}
// onKeyDown = {() => fn()}
// role = "menuitem"
// tabIndex = "0"
//     >
//     <div className="newLifeItem">
//         <div className="newlifeImage">
//             <img src={require('../assets/NotNeeded/car.png')} alt="" />
//         </div>
//         <div className="newLifeDetails">
//             <span className="nl-con">
//                 <label className="nl-label">Color</label>
//                 <div className="nl-inp">red</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Fee</label>
//                 <div className="nl-inp">300</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Mnd</label>
//                 <div className="nl-inp">60</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Price</label>
//                 <div className="nl-inp">25000</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Price</label>
//                 <div className="nl-inp">Reservation</div>
//             </span>
//         </div>
//     </div>
// </div >
//     <div className="newLifeItem">
//         <div className="newlifeImage">
//             <img src={require('../assets/NotNeeded/car.png')} alt="" />
//         </div>
//         <div className="newLifeDetails">
//             <span className="nl-con">
//                 <label className="nl-label">Color</label>
//                 <div className="nl-inp">Blue</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Fee</label>
//                 <div className="nl-inp">300</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Mnd</label>
//                 <div className="nl-inp">60</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Price</label>
//                 <div className="nl-inp">25000</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Price</label>
//                 <div className="nl-inp">Reservation</div>
//             </span>
//         </div>
//     </div>
//     <div className="newLifeItem">
//         <div className="newlifeImage">
//             <img src={require('../assets/NotNeeded/car.png')} alt="" />
//         </div>
//         <div className="newLifeDetails">
//             <span className="nl-con">
//                 <label className="nl-label">Color</label>
//                 <div className="nl-inp">green</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Fee</label>
//                 <div className="nl-inp">300</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Mnd</label>
//                 <div className="nl-inp">60</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Price</label>
//                 <div className="nl-inp">25000</div>
//             </span>
//             <span className="nl-con">
//                 <label className="nl-label">Price</label>
//                 <div className="nl-inp">Reservation</div>
//             </span>
//         </div>
//     </div>
