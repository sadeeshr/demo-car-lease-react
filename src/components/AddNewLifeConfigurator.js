import React, { Component } from 'react'
import md5 from 'md5';
import BlockUi from 'react-block-ui';

import Coverflow from 'react-coverflow';
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

class AddNewLifeConfigurator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: false
        }

        this.carType = 1
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ active: 0 })
        }, 1500);
    }


    componentWillMount() {
        // cc.log("ADD OBJECT:", this.props);
        let data = {
            module: "leaseobjects"
        }

        if (!this.props.leaseobjects && this.props.socket) this.props._fetchContractData(this.props, data, this.props.account)

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newLeaseTokenAddress) {
            let leaseobject = this.props.newLifeObj
            this.props._lcCreateObject(this.props, leaseobject.id, leaseobject.image, leaseobject.price, leaseobject.hash, nextProps.newLeaseTokenAddress, leaseobject.dealer, leaseobject.monthlycapcost, leaseobject.monthlyopcost, this.props.account)
        }
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

    createAccount = (leasetype, months, monthlycapcost, monthlyopcost) => {
        this.setState({ progress: true })
        // const car = this.props.cars[this.state.active]
        const leaseobject = this.props.leaseobjects && this.props.leaseobjects[this.state.active]

        const member = this.props.member
        // let membersList = this.props.members

        const objectHash = '0x' + md5(member.username + member.town + member["_id"])
        let newLifeObj = {
            id: member["_id"],
            image: leaseobject["image"],
            price: leasetype.price,
            hash: objectHash,
            dealer: leaseobject["dealer"],
            monthlycapcost: monthlycapcost,
            monthlyopcost: monthlyopcost
        }

        this.props._setObject({ newLifeObj, progress: true })
        this.state.lobjectSelected && this.props._lcCreateNewLeaseTokenObject(this.props.account)

        // this.state.lobjectSelected && this.props._lcCreateObject(member["_id"], car.image, car.price, carHash, this.carType, car.dealer, (this.state.carFee || car.fee), (this.state.carTerm || car.term), Math.round((this.state.carMileage || car.mileage) / 12), member.account, this.props.location.state.module)

        // this.props._writeNewContractData(data)
    }


    render() {
        // if (this.props.members_new) this.props.history.goBack()
        cc.log("Add new life state, props: ", this.state, this.props)
        cc.log(this.props.member, `ACTIVE: ${this.state.active}`);
        const leaseobjects = this.props.leaseobjects || []
        cc.log("LEASE OBJECTS: ", leaseobjects);
        const img = { "maxHeight": "25px", "maxWidth": "59px", "marginLeft": "60%", "display": "block", "width": "auto", "height": "auto" }
        const ltypeId = this.state.leasetypeid || 0
        let leaseobject = this.props.leaseobjects && this.props.leaseobjects[this.state.active]
        let leasetype = leaseobject && leaseobject["leasetypes"][ltypeId]
        let months = this.state.lobjmonths || leasetype && leasetype.months
        let monthlycapcost = ""
        let monthlyopcost = 0.00

        if ((this.state.active === 0 || this.state.active === 1) && (leasetype.type === "Operational" || leasetype.type === "Private") && this.state.lobjMileage) {
            monthlyopcost = (parseInt(this.state.lobjMileage, 10) / 12) * 0.1
        }

        if (leasetype) {
            switch (this.state.active) {
                case 0:
                    {
                        switch (leasetype.type) {
                            case "Per day":
                                monthlycapcost = parseFloat(leasetype.price) / 2000
                                break;
                            case "Per uur":
                                monthlycapcost = parseFloat(leasetype.price) / 20000
                                break;
                            case "Financial":
                            case "Operational":
                            case "Private":
                                monthlycapcost = (parseFloat(leasetype.price) / 100) + (60 - parseInt(months, 10)) * 2
                                break;

                            default:
                                break;
                        }
                        break;
                    }

                case 1:
                    {
                        switch (leasetype.type) {
                            case "Financial":
                            case "Operational":
                            case "Private":
                                monthlycapcost = (parseFloat(leasetype.price) / 100) + (60 - parseInt(months, 10)) * 2
                                break;

                            default:
                                break;
                        }

                        break;
                    }

                case 2:
                case 3:
                case 5:
                    {
                        switch (leasetype.type) {
                            case "Financial":
                            case "Private":
                                monthlycapcost = parseFloat(leasetype.price) / 100
                                break;

                            default:
                                break;
                        }
                        break;
                    }

                case 4:
                    {
                        switch (leasetype.type) {
                            case "Financial":
                            case "Private":
                                monthlycapcost = parseFloat(leasetype.price) / 150
                                break;

                            default:
                                break;
                        }
                        break;
                    }

                default:
                    break;
            }
        }

        cc.log(leaseobject, leasetype, months, monthlycapcost);

        const sliderOpts = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            swipeToSlide: true,
            focusOnSelect: true,


        };


        return (
            <div className="content-border">
                <div className="mainContentCon">

                    <div hidden className="navCon">
                        <h1 id="header"><div className="fl"><i className="flaticon-back" onClick={() => this.props.history.goBack()}></i></div>New Life Configurator<div className="fr"><i onClick={() => this.props.history.push("/")} className="flaticon-home"></i></div></h1>
                    </div>

                    <div style={{ height: "auto" }} className="contentCon overflow bg-none"> {/* */}
                        <BlockUi tag="div" blocking={this.props.progress}>
                            <div className="newLifeCon"> {/**/}
                                <Coverflow
                                    width={'auto'}
                                    height={500}
                                    displayQuantityOfSide={0}
                                    navigation={false}
                                    enableHeading={false}
                                    active={this.state.active}
                                >
                                    {/*<Slider {...sliderOpts}>*/}
                                    {
                                        leaseobjects.map((lobject, i) => {
                                            let mileageLabel = ""
                                            switch (lobject.objecttype) {
                                                case "1":
                                                case "2":
                                                    mileageLabel = "KM p/j"
                                                    break;
                                                case "3":
                                                case "4":
                                                case "6":
                                                    mileageLabel = "Onderhoud p/m"
                                                    break;
                                                case "5":
                                                    mileageLabel = "Kosten p/m"
                                                    break;
                                                default:
                                                    break;
                                            }
                                            // if (lobject.active) {
                                            return (
                                                <div style={{ display: !lobject.active ? "none" : "" }} key={i} className="newLifeItem" onWheel={() => cc.log("KEY DOWN: ", i)} onClick={() => this.setState({ active: i, lobjectSelected: true })} tabIndex="0">
                                                    <span>{lobject.name.toUpperCase()}</span>
                                                    <div className="newlifeImage">
                                                        <img src={lobject.image} alt={lobject.name} />
                                                    </div>
                                                    <div className="newLifeDetails">
                                                        <span className="nl-con">
                                                            <label className="nl-label">Lease type</label>
                                                            <div className="nl-inp">
                                                                <select value={ltypeId}
                                                                    onChange={e => {

                                                                        this.setState({ leasetypeid: e.target.value })
                                                                    }}>
                                                                    {
                                                                        lobject.leasetypes.map((lobj, j) => {
                                                                            return <option key={j} value={j}>{lobj.type}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </span>
                                                        <span className="nl-con">
                                                            <label className="nl-label">Euro per maand</label>
                                                            {/*<input className="nl-inp" value={this.state.carFee || car.fee} onChange={(e) => this.setState({ carFee: e.target.value })} type="text" />*/}
                                                            <div className="nl-inp">{formatNumber(parseInt(monthlycapcost, 10), { precision: 0, thousand: "." })}</div>
                                                        </span>
                                                        <span className="nl-con">
                                                            <label className="nl-label">Maanden</label>
                                                            {/*<div className="nl-inp">{leasetype.months}</div>*/}
                                                            <input className="nl-inp" value={this.state.lobjmonths || leasetype && leasetype.months} onChange={(e) => this.setState({ lobjmonths: e.target.value })} type="text" />
                                                        </span>
                                                        <span className="nl-con">
                                                            <label className="nl-label">Prijs</label>
                                                            <div className="nl-inp">{formatNumber(parseInt(leasetype && leasetype.price, 10), { precision: 0, thousand: "." })}</div>
                                                        </span>
                                                        <span className="nl-con">
                                                            <label className="nl-label">{mileageLabel}</label>
                                                            <input className="nl-inp" value={this.state.lobjMileage} onChange={(e) => this.setState({ lobjMileage: e.target.value })} type="text" />
                                                        </span>
                                                        <span className="nl-con">
                                                            <label className="nl-label">Upload contract</label>
                                                            <div className="nl-inp"></div>
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                            // }
                                            // else return <div key={i} />
                                        })
                                    }
                                </Coverflow>
                                {/*</Slider>*/}
                            </div>





                            {/* <div className="contentBtn">
                                <button onClick={this.createAccount.bind(this)}>Confirm & Publish</button>
                            </div> */}
                        </BlockUi>
                    </div>

                    <div className="footCon">
                        {this.state.lobjectSelected && <div>
                            <span>Confirm & Publish</span>
                            <button title={!this.state.lobjectSelected ? "Select an Object" : "Confirm"} disabled={!this.state.lobjectSelected} className="arrowBtn" onClick={() => this.createAccount(leasetype, months, monthlycapcost, monthlyopcost)}>
                                <img src={require('../assets/add.jpg')} alt="addM" />
                            </button>
                            <img style={img} src={this.props.leaseobjects[this.state.active || "0"]["image"] || require('../assets/ninja.png')} alt="objectImage" />
                        </div>}
                    </div>
                </div>
            </div>

        )
    }
}

export default AddNewLifeConfigurator