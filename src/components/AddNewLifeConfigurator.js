import React, { Component } from 'react'
import md5 from 'md5';
import BlockUi from 'react-block-ui';

import Coverflow from 'react-coverflow';
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import Swiper from 'react-id-swiper';

class AddNewLifeConfigurator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: false,
            lobjprice: '',
            lobjMileage: ''
            // active: 0
        }

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

    createAccount = (leasetype, price, months, monthlycapcost, monthlyopcost) => {
        this.setState({ progress: true })

        const leaseobject = this.props.leaseobjects && this.props.leaseobjects[this.state.active]

        const member = this.props.usernames && this.props.usernames.find(userO => userO["_id"] === this.props.registered)

        const townSelected = this.props.towns[this.props.town]

        var crypto = require('crypto');

        const objectHash = '0x' + md5(member.username + member.town + member["_id"] + crypto.randomBytes(20).toString('hex'))
        // let newLifeObj = {
        //     id: member["_id"],
        //     image: leaseobject["image"],
        //     price: leasetype.price,
        //     hash: objectHash,
        //     months: months,
        //     dealer: leaseobject["dealer"],
        //     monthlycapcost: monthlycapcost,
        //     monthlyopcost: monthlyopcost,
        //     municipalityID: townSelected ? townSelected["municipalityID"] : ""
        // }

        let newLifeObj = {
            member: member["_id"],
            objectType: leaseobject["objecttype"],
            leaseType: leasetype.type,
            objectPic: leaseobject["image"],
            objectPrice: price,
            objectHash: objectHash,
            months: months,
            objectDealer: leaseobject["dealer"],
            objectMonthlyCapitalCost: monthlycapcost,
            objectMonthlyOperatingCost: monthlyopcost,
            municipalityID: townSelected ? townSelected["municipalityID"] : ""
        }

        let data = {
            module: "membersobj",
            result: "members",
            data: newLifeObj
        }

        cc.log(data)

        // this.props._writeNewContractData(this.props, data)
        this.props._updateSocketProps(this.props)

        this.props._setObject({ newLifeObj, progress: true })

        this.state.lobjectSelected && this.props.account && this.props._lcCreateNewLeaseTokenObject(this.props, data, this.props.account)

        this.props.history.goBack()

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
        let months = this.state.lobjmonths || (leasetype && leasetype.months)
        let price = this.state.lobjprice || (leasetype && leasetype.price)
        let monthlycapcost = ""
        let monthlyopcost = 0.00



        if (leasetype) {
            if ((this.state.active === 0) && (leasetype && (leasetype.type === "Operational")) && this.state.lobjMileage) {
                monthlyopcost = (parseInt(this.state.lobjMileage, 10) / 12) * 0.1
            }

            switch (this.state.active) {
                case 0:
                    {
                        switch (leasetype.type) {
                            case "Per Dag":
                                monthlycapcost = parseFloat(price) / 2000
                                break;
                            // case "Per uur":
                            //     monthlycapcost = parseFloat(leasetype.price) / 20000
                            //     break;
                            case "Financial":
                            case "Operational":
                                // case "Private":
                                monthlycapcost = (parseFloat(price) / 100) + (60 - parseInt(months, 10)) * 2
                                break;

                            default:
                                break;
                        }
                        break;
                    }

                // case 1:
                // {
                //     switch (leasetype.type) {
                //         case "Financial":
                //         case "Operational":
                //         case "Private":
                //             monthlycapcost = (parseFloat(leasetype.price) / 100) + (60 - parseInt(months, 10)) * 2
                //             break;

                //         default:
                //             break;
                //     }

                //     break;
                // }

                case 1:
                    {
                        monthlycapcost = parseFloat(price) / 100
                        break;
                    }
                case 2:
                    {
                        monthlycapcost = parseFloat(price) / 150
                        break;
                    }
                case 3:
                    {
                        switch (leasetype.type) {
                            case "Financial":
                                monthlycapcost = parseFloat(price) / 150
                                break;
                            case "Operational":
                                monthlycapcost = parseFloat(price) / 100
                                break;
                            default:
                                break;
                        }
                        break;
                    }

                // case 4:
                //     {
                //         switch (leasetype.type) {
                //             case "Financial":
                //             case "Private":
                //                 monthlycapcost = parseFloat(leasetype.price) / 150
                //                 break;

                //             default:
                //                 break;
                //         }
                //         break;
                //     }

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

        const params = {
            shouldSwiperUpdate: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },

        }


        return (
            <div className="content-border">
                <div className="mainContentCon">

                    <div hidden className="navCon">
                        <h1 id="header"><div className="fl"><i className="flaticon-back" onClick={() => this.props.history.goBack()}></i></div>New Life Configurator<div className="fr"><i onClick={() => this.props.history.push("/")} className="flaticon-home"></i></div></h1>
                    </div>
                    <BlockUi tag="div" blocking={this.props.progress}>

                        <div style={{ height: "auto" }} className="contentCon overflow bg-none padding-none"> {/* */}
                            <div className="newLifeCon">

                                <Swiper {...params}>
                                    {
                                        leaseobjects.map((lobject, i) => {
                                            let mileageLabel = ""
                                            switch (lobject.objecttype) {
                                                case "Car":
                                                    mileageLabel = "KM p/j"
                                                    break;
                                                case "Heatpump/SolarPanel":
                                                case "WindMill":
                                                case "SolarPark":
                                                    mileageLabel = "Onderhoud p/m"
                                                    break;
                                                default:
                                                    break;
                                            }
                                            // if (lobject.active) {
                                            return (
                                                <div>
                                                    <div style={{ display: !lobject.active ? "none" : "" }} key={i} className="newLifeItem" onWheel={() => cc.log("KEY DOWN: ", i)} onClick={() => this.setState({ active: i, lobjectSelected: true })} tabIndex="0">
                                                        <div className="col-9">
                                                            <span className="newLifeItem-title">{lobject.name.toUpperCase()}</span>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="text-right">
                                                                <img className="infoImg" src={require('../assets/info.png')} alt="info" />
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="newlifeImage" style={{ backgroundImage: `url(${lobject.image})` }}>
                                                                {/* <img src={lobject.image} alt={lobject.name} /> */}
                                                            </div>
                                                        </div>
                                                        <div hidden={lobject.objecttype !== "Car"} className="col-12 mb-15" style={{ height: "46px" }}>
                                                            <div className="col-7">
                                                                <div>
                                                                    <span className="c-type opacity03">S</span>
                                                                    <span className="c-type">3</span>
                                                                    <span className="c-type opacity03">X</span>
                                                                    <span className="c-type opacity03">Y</span>
                                                                </div>
                                                                <div>
                                                                    <span className="c-type opacity03">ROADSTER</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-5">
                                                                <span className="color-default color-red"></span>
                                                                <span className="color-default color-white"></span>
                                                                <span className="color-default color-blue"></span>
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 d-ib">
                                                            <div className="col-7">
                                                                <label className="nl-label">Lease type</label>
                                                            </div>
                                                            <div className="col-5">
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
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 d-ib opacity03">
                                                            <div className="col-7">
                                                                <label className="nl-label">Euro per Dag</label>
                                                            </div>
                                                            <div className="col-5">
                                                                <div className="nl-inp">
                                                                    {/*<input className="nl-inp" value={this.state.carFee || car.fee} onChange={(e) => this.setState({ carFee: e.target.value })} type="text" />*/}
                                                                    {formatNumber(parseInt(monthlycapcost, 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 d-ib opacity03">
                                                            <div className="col-7">
                                                                <label className="nl-label">Maanden</label>
                                                            </div>
                                                            <div className="col-5">
                                                                {
                                                                    (leasetype && leasetype.months === "60") ?
                                                                        <div className="nl-inp"><input value={this.state.lobjmonths || leasetype && leasetype.months} onChange={(e) => this.setState({ lobjmonths: e.target.value })} type="text" /></div>
                                                                        : <div className="nl-inp">{leasetype && leasetype.months}</div>
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="mb-5 d-ib">
                                                            <div className="col-7">
                                                                <label className="nl-label">Prijs</label>
                                                            </div>
                                                            <div className="col-5">
                                                                <div className="nl-inp">
                                                                    <input value={price} onChange={(e) => this.setState({ lobjprice: e.target.value })} type="text" />
                                                                </div>
                                                                {/*<div className="nl-inp">{}</div>*/ /*formatNumber(parseInt(price, 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })*/}
                                                            </div>
                                                        </div>

                                                        <div className="mb-5 d-ib opacity03">
                                                            <div className="col-7">
                                                                <label className="nl-label">{mileageLabel}</label>
                                                            </div>
                                                            <div className="col-5">
                                                                <div className="nl-inp">
                                                                    <input value={this.state.lobjMileage} onChange={(e) => this.setState({ lobjMileage: e.target.value })} type="text" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mb-5 d-ib opacity03">
                                                            <div className="col-7">
                                                                <label className="nl-label">Upload contract</label>
                                                            </div>
                                                            <div className="col-5">
                                                                <div className="nl-inp">&nbsp;
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="infoPop" style={{ display: 'none' }}>
                                                            Vandaag 20 euro,
                                                            morgen 19.99,
                                                            overmorgen 19.98,
                                                            over 3 jaar 10
                                                            ...of 1 euro per uur
                                                        </div>
                                                    </div>

                                                </div>
                                            )
                                            // }
                                            // else return <div key={i} />
                                        })
                                    }
                                </Swiper>

                            </div>


                            {/* <div className="contentBtn">
                                <button onClick={this.createAccount.bind(this)}>Confirm & Publish</button>
                            </div> */}
                        </div>

                        <div className="footCon">
                            {this.state.lobjectSelected && this.props.account && <div>
                                <span>Creëer mijn Coin</span>
                                <button title={!this.state.lobjectSelected ? "Select an Object" : "Confirm"} disabled={!this.state.lobjectSelected} className="arrowBtn" onClick={() => this.createAccount(leasetype, price, months, monthlycapcost, monthlyopcost)}>
                                    <img src={require('../assets/add.jpg')} alt="addM" />
                                </button>
                                <img style={img} src={(this.props.leaseobjects && this.props.leaseobjects[this.state.active || "0"]["image"])} alt="objectImage" />
                            </div>}
                        </div>
                    </BlockUi>
                </div>
                <div className="footBtn roadBg container">
                    {/* roadBg / seaBg / grassBg */}
                    <div className="container text-center">
                        <div className="beforeFooter">
                            <div className="col-5">
                                &nbsp;
                            </div>
                            <div className="col-2">
                                <button className="arrowBtn" onClick={() => this.props.history.push("/", { path: "home" })}>
                                    <span className="flaticon-euro"></span>
                                </button>
                            </div>
                            <div className="col-5 text-left padding-10-0">
                                <span>Creeer Crowdfunding</span>
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
                            <span className="flaticon-youtube-logo"></span>
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

export default AddNewLifeConfigurator