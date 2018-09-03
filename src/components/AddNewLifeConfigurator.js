import React, { Component } from 'react'
import md5 from 'md5';
import BlockUi from 'react-block-ui';

// import Coverflow from 'react-coverflow';
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom'

// import Slider from "react-slick";

import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

import Swiper from 'react-id-swiper';

class AddNewLifeConfigurator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: false,
            coinName: '',
            lobjprice: '',
            lobjMileage: '',
            modalCondition: false,
            active: 0
        }
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
    }


    modalClick() {
        this.setState({
            modalCondition: !this.state.modalCondition
        });
    }

    resetValues = () => {
        // this.setState({
        //     coinName: '',
        //     leasetypeid: '',
        //     lobjectSelected: '',
        //     lobjmonths: '',
        //     lobjprice: '',
        //     lobjMileage: '',
        //     monthlycapcost: '',
        // })

        console.log("RESET: ", this.state.active);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ active: 0 })
        }, 1500);
    }


    componentWillMount() {
        // cc.log("ADD OBJECT:", this.props);
        let data = {
            module: "duurzamobjects"
        }

        if (!this.props.duurzamobjects && this.props.socket) this.props._fetchContractData(this.props, data, this.props.account)

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newObject && (nextProps.newObject !== this.props.newObject))
            this.setState({ pending: true })

        if (nextProps.newObject && nextProps.event && (nextProps.event !== this.props.event) && (nextProps.event.transactionHash === nextProps.newObject.txID)) {
            this.setState({ pending: false })
            setTimeout(() => {
                // this.props._resetTxIds()
                this.props.history.push("/", { path: "members" })
            }, 5000);
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

    createAccount = (leasetype, price, months, monthlycapcost, monthlyopcost, restWaarde) => {
        this.setState({ progress: true })

        const ltypeId = this.state.leasetypeid || 0

        const leaseobject = this.props.duurzamobjects && this.props.duurzamobjects[this.state.active]

        const member = this.props.usernames && this.props.usernames.find(userO => userO["_id"] === this.props.registered)

        // const townSelected = this.props.towns[this.props.town]

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
            objectName: this.state.coinName,
            objectRest: this.state.rest,
            objectInterest: restWaarde ? restWaarde.toFixed(1) : 0,
            objectType: leaseobject["objecttype"],
            // leaseType: leasetype.type,
            objectPic: leaseobject["objects"][ltypeId]["image"],
            objectPrice: price,
            objectHash: objectHash,
            months: months,
            objectDealer: leaseobject["objects"][ltypeId]["dealer"],
            objectMonthlyCapitalCost: monthlycapcost,
            objectMonthlyOperatingCost: monthlyopcost,
            // municipalityID: townSelected ? townSelected["municipalityID"] : ""
            municipalityID: "1"
        }

        // let data = {
        //     module: "crowdfundobj",
        //     result: "members",
        //     data: newLifeObj
        // }

        // cc.log(data)

        // this.props._writeNewContractData(this.props, data)
        // this.props._updateSocketProps(this.props) //change

        this.props._setObject({ newLifeObj, progress: true })

        // this.state.lobjectSelected && this.props.account && this.props._lcCreateNewCrowdFundToken(this.props, data, this.props.account) // change
        this.state.lobjectSelected && this.props.account && this.props._lcCreateObject(this.props, this.state.coinName, months, "1", price, objectHash, 0, this.props.account, (parseFloat(monthlycapcost) * 100), (parseFloat(monthlyopcost) * 100), this.props.account)
        // this.props.history.goBack()

        // this.props._writeNewContractData(data)
    }


    render() {
        // if (this.props.members_new) this.props.history.goBack()
        cc.log("Add new life state, props: ", this.state, this.props)
        cc.log(this.props.member, `ACTIVE: ${this.state.active}`);
        const duurzamobjects = this.props.duurzamobjects || []
        cc.log("LEASE OBJECTS: ", duurzamobjects);
        const img = { "maxHeight": "25px", "maxWidth": "59px", "marginLeft": "60%", "display": "block", "width": "auto", "height": "auto" }
        const ltypeId = this.state.leasetypeid || 0
        let leaseobject = this.props.duurzamobjects && this.props.duurzamobjects[this.state.active]
        let leasetype = leaseobject && leaseobject["objects"][ltypeId]
        let months = this.state.lobjmonths || (leasetype && leasetype.months)
        let price = this.state.lobjprice || (leasetype && leasetype.price) || 0
        let monthlycapcost = ""
        let monthlyopcost = parseFloat("0.00")

        const { valKm, valEuroPer, valMaanden, valCar, valEuro } = this.state

        if (!leasetype)
            leasetype = leaseobject && leaseobject["objects"][0]

        if ((this.state.active === 0) && (leasetype) && this.state.lobjMileage) {   // && leasetype.type === "Operational"
            monthlyopcost = (parseInt(this.state.lobjMileage, 10) / 12) * 0.1
        }

        if (leasetype)
            switch (this.state.active) {
                case 0:
                    {
                        // switch (leasetype.type) {
                        //     case "Per Dag":
                        //         monthlycapcost = parseFloat(price) / 2000
                        //         break;
                        //     // case "Per uur":
                        //     //     monthlycapcost = parseFloat(leasetype.price) / 20000
                        //     //     break;
                        //     case "Financial":
                        //     case "Operational":
                        //         // case "Private":
                        //         monthlycapcost = (parseFloat(price) / 100) + (60 - parseInt(months, 10)) * 2
                        //         break;

                        //     default:
                        monthlycapcost = (parseFloat(price) / 100) + (60 - parseInt(months, 10)) * 2
                        //         break;
                        // }
                        // break;
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
                        if (!price) price = leaseobject["objects"][0]["price"]
                        monthlycapcost = parseFloat(price) / 100
                        break;
                    }
                case 2:
                    {
                        monthlycapcost = parseFloat(price) / 150
                        // if (leasetype.type === "Operational")
                        //     monthlyopcost = parseFloat("2500.00")
                        break;
                    }
                case 3:
                    {
                        // switch (leasetype.type) {
                        //     case "Financial":
                        //         monthlycapcost = parseFloat(price) / 150
                        //         break;
                        //     case "Operational":
                        //         {
                        //             monthlycapcost = parseFloat(price) / 100
                        //             monthlyopcost = parseFloat("250.00")
                        //             break;
                        //         }
                        //     default:
                        monthlycapcost = parseFloat(price) / 150
                        //         break;
                        // }
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
        // }


        //Restwaarde = (((Months x PayPerMonth) - (Total - Rest)) / (Months/12))
        //                       /
        //              ((Total - Rest /2)/100)

        cc.log(`(((${months} * (${this.state.monthlycapcost || parseInt(monthlycapcost, 10)})) - (${price} - (${this.state.rest || 0}))) / (${months} / 12)) / ((${price} - (${this.state.rest || 0}) / 2) / 100)`);
        const restWaarde = (((months * (this.state.monthlycapcost || parseInt(monthlycapcost, 10))) - (price - (this.state.rest || 0))) / (months / 12)) / ((price - (this.state.rest || 0) / 2) / 100)

        cc.log("LO: ", leaseobject, "LT: ", leasetype)
        cc.log("MON: ", months, "MCAP: ", monthlycapcost, "MOP: ", monthlyopcost.toString(), "RESTWARDEE: ", restWaarde);

        // const sliderOpts = {
        //     dots: true,
        //     infinite: true,
        //     speed: 500,
        //     slidesToShow: 1,
        //     slidesToScroll: 1,
        //     adaptiveHeight: true,
        //     swipeToSlide: true,
        //     focusOnSelect: true,


        // };

        const params = {
            shouldSwiperUpdate: true,
            // rebuildOnUpdate: true,
            noSwiping: true,
            navigation: {
                nextEl: this.state.pending ? undefined : '.swiper-button-next',
                prevEl: this.state.pending ? undefined : '.swiper-button-prev'
            },
            on: {
                'slideChange': () => {
                    if (this.swiper && this.state.active !== this.swiper.activeIndex)
                        this.setState({
                            active: this.swiper.activeIndex,
                            coinName: '',
                            leasetypeid: '',
                            lobjectSelected: '',
                            lobjmonths: '',
                            lobjprice: '',
                            lobjMileage: '',
                            monthlycapcost: '',
                            rest: 0,
                            leasetypeid: 0
                        })
                }
            }

        }


        return (
            <div className="content-border" >
                <div className="border-bottom-1  fix-small-dev">
                    <div className="container">
                        <span className="lh-40">RENDEMENT INVESTEERDER: <strong className={restWaarde > 0 ? "fs-20 color-green" : "fs-20 color-red"}>{restWaarde ? restWaarde.toFixed(1) : 0}%</strong></span>
                    </div>
                </div>
                <div className="mainContentCon foot">

                    <div hidden className="navCon">
                        <h1 id="header"><div className="fl"><i className="flaticon-back" onClick={() => this.props.history.goBack()}></i></div>New Life Configurator<div className="fr"><i onClick={() => this.props.history.push("/")} className="flaticon-home"></i></div></h1>
                    </div>
                    <BlockUi tag="div" blocking={this.props.progress}>

                        <div style={{ height: "auto" }} className="contentCon overflow bg-none padding-none"> {/* */}
                            <div className="newLifeCon">

                                <Swiper {...params} ref={node => this.swiper = node ? node.swiper : null}>
                                    {
                                        duurzamobjects.map((lobject, i) => {
                                            let mileageLabel = ""
                                            switch (lobject.objecttype) {
                                                case "Car":
                                                    mileageLabel = "KM p/j"
                                                    break;
                                                case "Heatpump":
                                                case "WindMill":
                                                case "SolarPark":
                                                    mileageLabel = "Onderhoud p/m"
                                                    break;
                                                default:
                                                    break;
                                            }
                                            // if (lobject.active) {
                                            return (
                                                <div key={i}>
                                                    <div className="newLifeItem" onWheel={() => cc.log("KEY DOWN: ", i)} onClick={() => this.setState({ active: i, lobjectSelected: true })} tabIndex="0"> {/*style={{ display: !leasetype.active ? "none" : "" }}*/}
                                                        <div className="col-9">                                                          
                                                            {/*<span className="newLifeItem-title">{leasetype.model.toUpperCase()}</span>*/}
                                                           
                                                            {/*this.props.newObject && this.props.newObject.txID && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newObject.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.newObject.txID)) ? <p className="p-euro" style={{ color: "green", fontSize: "18px", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Confirmed</p> : <p className="p-euro" style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Pending</p>}</Link>)*/}
                                                            {/*<p className="p-euro" style={{ color: "green", fontSize: "18px", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Confirmed</p>*/}
                                                            {/* <p className="p-euro " style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600", marginLeft: "0", marginTop: "0" }}>Pending</p> */}
                                                        </div>
                                                        <div className="col-3" style={{ height: '29px' }}>
                                                            <div hidden={lobject.objecttype !== "Car"} className="text-right" >
                                                                <span onClick={() => this.modalClick()}>
                                                                    <img className="infoImg" src={require('../assets/info.png')} alt="info" />
                                                                </span>
                                                            </div>
                                                        </div>


                                                        <div className="col-12">
                                                            <div className="newlifeImage" style={{ backgroundImage: `url(${leasetype.image})` }}>
                                                                {/* <img src={lobject.image} alt={lobject.name} /> */}
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 d-ib fs-13">
                                                            <div className="col-12">
                                                                {/* <div className="nl-inp">
                                                                    {leasetype && <input value={price} onChange={(e) => this.setState({ lobjprice: e.target.value })} type="text" />}
                                                                </div> */}
                                                                {/*<div className="nl-inp">{}</div>*/ /*formatNumber(parseInt(price, 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })*/}
                                                                <Slider
                                                                    disabled={this.state.pending}
                                                                    min={0}
                                                                    max={this.state.active === 0 ? 100000 : this.state.active === 1 ? 10000 : this.state.active === 2 ? 10000000 : 5000000}
                                                                    step={500}
                                                                    value={parseInt(price, 10)}
                                                                    orientation='horizontal'
                                                                    onChange={(value) => this.setState({ lobjprice: value })}
                                                                />
                                                            </div>
                                                            <div className="col-12">
                                                                <span className="target fs-13">
                                                                    <strong className="fs-15">Target:</strong>
                                                                    <span className="color-green"> {formatNumber(parseInt(price, 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} </span>
                                                                    EUR</span>
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-12 mb-15" style={{ height: "46px" }}>
                                                            <div hidden={lobject.objecttype !== "Car"} className="col-12" >
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
                                                        </div> */}

                                                        <div className="mb-5 d-ib fs-13">
                                                            <div className="col-12">
                                                                <div className='value'>
                                                                    <div className="col-3 text-right"></div>
                                                                    <div className="col-9 text-left ti-5">Kies &nbsp;
                                                                        <strong className="fs-15">{leasetype.model}</strong>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 slider-style2">
                                                                <Slider
                                                                    disabled={this.state.pending}
                                                                    min={0}
                                                                    max={(leaseobject["objects"].length - 1)}
                                                                    value={this.state.leasetypeid}
                                                                    disabled={this.state.pending}
                                                                    orientation='horizontal'
                                                                    onChange={(value) => this.setState({ leasetypeid: value })}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mb-5 d-ib fs-13">
                                                            <div className="col-12">
                                                                <div className='value'>
                                                                    <div className="col-3 text-right">{formatNumber(this.state.monthlycapcost || 0, { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}</div>
                                                                    <div className="col-9 text-left ti-5">Euro per Maand</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                {/* <div className="nl-inp"> */}
                                                                {/*<input className="nl-inp" value={this.state.carFee || car.fee} onChange={(e) => this.setState({ carFee: e.target.value })} type="text" />*/}
                                                                {/* {formatNumber(parseInt(monthlycapcost, 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}
                                                                </div> */}
                                                                <Slider
                                                                    disabled={this.state.pending}
                                                                    min={0}
                                                                    max={5000}
                                                                    step={10}
                                                                    value={this.state.monthlycapcost || 0}
                                                                    orientation='horizontal'
                                                                    onChange={(value) => this.setState({ monthlycapcost: value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={
                                                            "mb-5 d-ib fs-13"
                                                            // (leasetype && leasetype.months === "60") ? "mb-5 d-ib fs-13" : "fs-13 mb-5 d-ib opacity03"
                                                        }>
                                                            {/* <div className="col-7">
                                                                <label className="nl-label">Maanden</label>
                                                            </div>
                                                            <div className="col-5">
                                                                {
                                                                    (leasetype && leasetype.months === "60") ?
                                                                        <div className="nl-inp"><input value={this.state.lobjmonths || (leasetype && leasetype.months)} onChange={(e) => this.setState({ lobjmonths: e.target.value })} type="text" /></div>
                                                                        : <div className="nl-inp">{leasetype && leasetype.months}</div>
                                                                }
                                                            </div> */}
                                                            <div className="col-12">
                                                                <div className='value'>
                                                                    <div className="col-3 text-right">{this.state.lobjmonths || (leasetype && leasetype.months)}</div>
                                                                    <div className="col-9 text-left ti-5">Maanden</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <Slider
                                                                    disabled={this.state.pending}
                                                                    min={0}
                                                                    max={120}
                                                                    step={3}
                                                                    value={this.state.lobjmonths || (leasetype && parseInt(leasetype.months, 10))}
                                                                    orientation='horizontal'
                                                                    onChange={(value) => this.setState({ lobjmonths: value })}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className={
                                                            "mb-5 d-ib fs-13"
                                                            // (leasetype && leasetype.type === "Operational") ? "mb-5 d-ib fs-13" : "mb-5 d-ib fs-13 opacity03"
                                                        }>
                                                            {/* <div className="col-7">
                                                                <label className="nl-label">{mileageLabel || " KM per Jaar"}</label>
                                                            </div>
                                                            <div className="col-5">
                                                                {
                                                                    (leasetype && leasetype.type === "Operational") ?
                                                                        <div className="nl-inp">
                                                                            <input value={this.state.lobjMileage || monthlyopcost} onChange={(e) => this.setState({ lobjMileage: e.target.value })} type="text" />
                                                                        </div>
                                                                        : <div className="nl-inp">{formatNumber(monthlyopcost, { precision: 2, thousand: ".", decimal: ",", stripZeros: true })}</div>
                                                                }

                                                            </div> */}

                                                            <div className="col-12">
                                                                <div className='value'>
                                                                    <div className="col-3 text-right">{this.state.lobjMileage || monthlyopcost}</div>
                                                                    <div className="col-9 text-left ti-5">{mileageLabel}<span className="fs-9">{this.state.active === 0 && "(10 cent per km)"}</span></div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <Slider
                                                                    disabled={this.state.pending}
                                                                    min={0}
                                                                    max={this.state.active === 0 ? 100000 : 2000}
                                                                    step={this.state.active === 0 ?1000 : 100}
                                                                    value={this.state.lobjMileage || monthlyopcost}
                                                                    orientation='horizontal'
                                                                    onChange={(value) => this.setState({ lobjMileage: value })}
                                                                />
                                                            </div>


                                                        </div>
                                                        <div className={"mb-5 d-ib fs-13"}>
                                                            <div className="col-12">
                                                                <div className='value'>
                                                                    <div className="col-3 text-right">{this.state.rest || 0}</div>
                                                                    <div className="col-9 text-left ti-15">{"Restwaarde"}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <Slider
                                                                    disabled={this.state.pending}
                                                                    min={0}
                                                                    max={parseInt(price, 10)}
                                                                    step={1000}
                                                                    value={this.state.rest || 0}
                                                                    orientation='horizontal'
                                                                    onChange={(value) => this.setState({ rest: value })}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* <div className="mb-5 d-ib opacity03">
                                                            <div className="col-7">
                                                                <label className="nl-label">Upload contract</label>
                                                            </div>
                                                            <div className="col-5">
                                                                <div className="nl-inp">&nbsp;
                                                                </div>
                                                            </div>
                                                        </div> */}

                                                        <div className={this.state.modalCondition ? "infoPop is-open" : "infoPop is-close"} >
                                                            <span className="modalCloseBtn" onClick={() => this.modalClick()}>x</span>
                                                            Vandaag 20 euro,
                                                            morgen 19.99,
                                                            overmorgen 19.98,
                                                            over 3 jaar 10
                                                            ...of 1 euro per uur
                                                        </div>

                                                    </div>
                                                    <div className="footCon">
                                                        {this.state.lobjectSelected && this.props.account && this.props.registered && <div className={lobject.objecttype === "Car" ? "roadBg container" : "container"}>
                                                            {/* <div className="container text-center">
                                                                    <span>Creëer mijn Coin</span>
                                                                    <button title={!this.state.lobjectSelected ? "Select an Object" : "Confirm"} disabled={!this.state.lobjectSelected} className="arrowBtn" onClick={() => this.createAccount(leasetype, price, months, monthlycapcost, monthlyopcost)}>
                                                                        <img src={require('../assets/add.jpg')} alt="addM" />
                                                                    </button>
                                                                    <img style={img} src={(this.props.duurzamobjects && this.props.duurzamobjects[this.state.active || "0"]["image"])} alt="objectImage" />
                                                                </div> */}
                                                            <div className="container text-center">
                                                                <div className="beforeFooter">
                                                                    {/* <div className="col-12 text-right">  <img style={img} src={(this.props.duurzamobjects && this.props.duurzamobjects[this.state.active || "0"]["image"])} alt="objectImage" /></div> */}
                                                                    <div className="col-4">
                                                                    </div>
                                                                    <div className="col-4 arrowHover-s2">
                                                                        <button className="arrowBtn" title={!this.state.lobjectSelected ? "Select an Object" : "Confirm"} disabled={!this.state.lobjectSelected || this.state.pending} onClick={() => this.createAccount(leasetype, price, months, (this.state.monthlycapcost || monthlycapcost), monthlyopcost, restWaarde)}>
                                                                            <span className="flaticon-euro white-arrowBtn"></span>
                                                                        </button>
                                                                    </div>

                                                                     {this.props.newObject && (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newObject.txID}>{this.state.pending ? <p  style={{ fontSize: "18px", color: "#FF9800", fontWeight: "600"}}>Pending</p> : <p  style={{ color: "green", fontSize: "18px", fontWeight: "600" }}>Confirmed</p>}</Link>)}

                                                                    <div className="col-4 text-left pv-5-18 cname-input">
                                                                    
                                                                        <input disabled={this.state.pending} className="ml-5 nl-inp" placeholder="Coin Naam" value={this.state.coinName} onChange={(e) => this.setState({ coinName: e.target.value })} type="text" />

                                                                        {/*<span>Start Crowdfunding en verkoop je eigen coin</span>*/}  {/* Change this text and edit css style to display entire line*/}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>}
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

                    </BlockUi>
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
                <div className={this.state.modalCondition ? "modalOverlay is-open" : "modalOverlay is-close"} onClick={() => this.modalClick()}></div>
            </div>

        )
    }
}

export default AddNewLifeConfigurator