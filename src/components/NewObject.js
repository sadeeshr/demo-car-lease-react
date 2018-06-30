import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import { Link } from 'react-router-dom'
import Slide from 'react-reveal/Slide';
import cc from '../lib/utils';
import formatNumber from 'accounting-js/lib/formatNumber.js'
import { Calendar } from 'primereact/components/calendar/Calendar';

class NewObject extends Component {

    constructor(props) {
        super(props)
        this.state = { reveal: false }
        // this.confTimer = null
        this.rinkebyStatsURL = "https://rinkeby.etherscan.io/tx/"
    }


    componentWillMount() {

    }

    componentWillUnmount() {
        this.props._resetTxIds()
    }

    componentDidMount() {
        this.setState({ reveal: true })
    }

    componentWillReceiveProps(nextProps) {

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
            <div className="mainContentCon">
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
                    <div className="contentCon bg-none overflow">
                        <BlockUi tag="div" blocking={this.props.progress}>
                            <div className="carIntestCon">
                                <div className="membersCon">
                                    <div className="leaseCarCon invest">
                                        <div className="balance">
                                            <div className="balanceName">{user.username}</div>
                                            <div className="balanceNum">{user.town}</div>
                                        </div>
                                        <div className="mtableLink">
                                            <div className="mtableCar">
                                                <img style={{ maxWidth: "200px" }} src={member.objectPic} alt="carImage" />
                                            </div>
                                            <div className="mtableTokens">{member.totalRaised}
                                                <p>{member.evTokens}</p>
                                            </div>
                                            <div className="mtableMnd">{"Monthly Capital Cost: "} {formatNumber((member.leaseType === "Per Dag" ? member.objectMonthlyCapitalCost : member.objectMonthlyCapitalCost / 100), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} EUR</div>
                                            <div className="mtableMnd">{"Monthly Operating Cost: "} {formatNumber((member.leaseType === "Per Dag" ? member.objectMonthlyOperatingCost : member.objectMonthlyOperatingCost / 100), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} EUR</div>
                                            <br />
                                            <div className="mtableUser">{member.objectType}
                                                <p>{member.leaseType}</p>
                                            </div>
                                            <div className="mtableMnd">{formatNumber(parseInt((member.objectPrice), 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })} EUR
                                                        <p>{member.months} MND</p>
                                            </div>
                                        </div>
                                        <div className="investAddCon">
                                            <div className="arrowBtn">
                                                <img onClick={() => {
                                                    this.props.account && this.props._lcCreateObject(this.props, member["_id"], member.months, member.municipalityID, member.objectPrice, member.objectHash, member.leaseTokenAddress, member.objectDealer, (parseFloat(member.objectMonthlyCapitalCost) * 100), (parseFloat(member.objectMonthlyOperatingCost) * 100), this.props.account)
                                                }} src={require('../assets/add.jpg')} alt="add2" />
                                            </div>
                                            <div className="investAddStatus">
                                                <p>{"Activeer mijn Coin"}</p>
                                                {(this.props.newObject && this.props.newObject["id"] === member["_id"]) &&
                                                    (<Link target="_blank" to={this.rinkebyStatsURL + this.props.newObject.txID}>{(this.props.event && (this.props.event.transactionHash === this.props.newObject.txID)) ? <p className="p-euro" style={{ color: "green", marginLeft: "0px", marginTop: "15px" }}><i>Confirmed</i></p> : <p className="p-euro" style={{ color: "red", marginLeft: "0px", marginTop: "15px" }}>pending</p>}</Link>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BlockUi>
                    </div>
                </Slide>
                <div className="footCon">
                    <div>
                        <span>Ga Terug</span>
                        <div style={{ top: "-30px", left: "10px", position: "relative" }} className="arrowBtn back">
                            <img src={require('../assets/back.jpg')} onClick={this.doExit.bind(this)} alt="back" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default NewObject