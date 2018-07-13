import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import { Link } from 'react-router-dom'
import Slide from 'react-reveal/Slide';
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'
// import { Calendar } from 'primereact/components/calendar/Calendar';

class NewObject extends Component {

    constructor(props) {
        super(props)
        this.state = {
            reveal: false,
            modalCondition: false,
        }
        // this.confTimer = null
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
    }

    modalClick() {
        this.setState({
            modalCondition: !this.state.modalCondition
        });
    }

    componentWillMount() {

        let data = {
            module: "membersobj",
            result: "member",
            findone: true,
            query: {
                _id: this.props.member["_id"]
            }
        }
        this.props._fetchContractData(this.props, data, this.props.account)
    }

    componentWillUnmount() {
        this.props._resetTxIds()
    }

    componentDidMount() {
        this.setState({ reveal: true })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newObject && (nextProps.newObject !== this.props.newObject)) this.setState({ pending: true })
        if (nextProps.event && (nextProps.event !== this.props.event) && (nextProps.event.transactionHash === nextProps.newObject.txID)) {
            this.setState({ pending: false })
            setTimeout(() => {
                this.props._resetTxIds()
            }, 5000);
        }
    }

    doExit = () => {
        this.setState({ reveal: false })
        setTimeout(() => {
            this.props.history.goBack()
        }, 500);
    }

    render() {
        cc.log("New Object State Props", this.state, this.props);
        const member = this.props.member
        const user = this.props.usernames && this.props.usernames.find(userO => userO["_id"] === member["member"])
        return (<div className="content-border">
            <div className="border-bottom-1">
                <div className="container">
                    <span className="lh-40">MIJN SALDO: <strong className="fs-20">99.99</strong> Euro</span>
                    <span className="fr pt-8"><img className="infoImg" src={require('../assets/deal.png')} alt="deal" /></span>
                </div>
            </div>
            <div className="mainContentCon mainContentCon-43">
                <div hidden className="navCon">
                    <h1 id="header">
                        <div hidden className="fl">
                            <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                        </div>
                        Create Object
                        <div hidden className="fr">
                            <i title="Invoices" className="flaticon-invoice marIcon" onClick={() => this.props.history.push("/", { path: "invoices" })}></i>
                            <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                        </div></h1>
                </div>
                <Slide right opposite when={this.state.reveal}>
                    <div className="contentCon bg-none overflow contentCon-8 pt-8">
                        <BlockUi tag="div" blocking={this.props.progress}>
                            <div className="carIntestCon">
                                <div className="membersCon">
                                    <div className="leaseCarCon main-i invest">
                                        <div className="col-12 mtableLink">
                                            <div className="mtableCar" style={{ backgroundImage: `url(${member.objectPic})` }} alt="carImage">
                                                {/* <img src={this.props.member.objectPic} alt="carImage" /> */}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="col-3 text-right mtableTokens fs-16">&nbsp;
                                                {member.totalRaised}
                                                <p style={{ color: 'green' }}>{member.evTokens}</p>
                                            </div>
                                            <div className="col-5 mtableUser text-center">{user.username}
                                                <p>{user.town}</p>
                                            </div>
                                            <div className="col-4 mtableMnd">{formatNumber(parseInt((member.objectPrice), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} EUR
                                                <p>{this.props.member.months} MND</p>
                                            </div>
                                        </div>
                                        <div className="col-12 investAddCon border-2">
                                            <div className="col-12 text-center">
                                                <p className="fw-700">   {member.objectType}</p>
                                                <p><span style={{ fontSize: '11px' }}>{member.leaseType}</span></p>
                                            </div>
                                            <div className="col-12 investAddCon">
                                                <div className="col-7 text-right">
                                                    <span style={{ padding: '0 5px', lineHeight: '30px' }}>Monthly Capital Cost :</span>
                                                </div>
                                                <div className="col-5" style={{ lineHeight: '30px' }}>
                                                    {formatNumber(member.objectMonthlyCapitalCost, { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} EUR
                                                </div>

                                                <div className="col-7 text-right">
                                                    <span style={{ padding: '0 5px', lineHeight: '30px' }}>Monthly Operating Cost :</span>
                                                </div>
                                                <div className="col-5" style={{ lineHeight: '30px' }}>
                                                    {formatNumber(member.objectMonthlyOperatingCost, { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} EUR
                                                </div>
                                            </div>
                                            <div className="col-12 text-center">
                                                {/* <p>{"Activeer mijn Coin"}</p> */}
                                                {(this.props.newObject && this.props.newObject["id"] === member["_id"]) &&
                                                    (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newObject.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.newObject.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Confirmed</p> : <p className="p-euro" style={{ color: "#FF9800", marginLeft: "0px", marginTop: "15px", textAlign: 'center', fontWeight: "600" }}>Pending</p>}</Link>)}

                                                {!this.state.pending && <span className="flaticon-padlock-1 unlock" onClick={() => {
                                                    this.props.account && this.props._lcCreateObject(this.props, member["_id"], member.months, member.municipalityID, member.objectPrice, member.objectHash, member.leaseTokenAddress, member.objectDealer, (parseFloat(member.objectMonthlyCapitalCost) * 100), (parseFloat(member.objectMonthlyOperatingCost) * 100), this.props.account)
                                                }} ></span>}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BlockUi>
                    </div>
                </Slide>
            </div>
            <div className={this.state.modalCondition ? "infoPop is-open" : "infoPop is-close"} >
                <span className="modalCloseBtn" onClick={() => this.modalClick()}>x</span>
                Vandaag 20 euro,
                morgen 19.99,
                overmorgen 19.98,
                over 3 jaar 10
                ...of 1 euro per uur
                    </div>

            <div className="footBtn container">
                <div className="container text-center">
                    <div className="beforeFooter">
                        <div className="col-2 text-left">
                            <button className="arrowBtn" onClick={this.doExit.bind(this)}>
                                <span className="flaticon-left-arrow"></span>
                            </button>
                        </div>
                        <div className="col-8 lh-54 text-left">
                            Ga Terug
                        </div>
                        <div className="col-2 text-left padding-10-0">
                            <div className="text-right" style={{ float: 'right' }}>
                                <span onClick={() => this.modalClick()}>
                                    <img className="infoImg" src={require('../assets/info.png')} alt="info" />
                                </span>
                            </div>
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
            <div className={this.state.modalCondition ? "modalOverlay is-open" : "modalOverlay is-close"} onClick={() => this.modalClick()}></div>
        </div >
        )
    }
}

export default NewObject