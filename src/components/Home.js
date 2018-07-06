import React, { Component } from 'react'
import formatNumber from 'accounting-js/lib/formatNumber.js'

import cc from '../lib/utils';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            town: 0
        }
    }


    componentWillMount() {
        if (!this.props.towns) this.fetchMunicipalityData()
    }

    fetchMunicipalityData = () => {
        let data = {
            module: "municipality",
            result: "towns",
        }
        if (this.props.socket) this.props._fetchContractData(this.props, data, this.props.account)
    }

    componentDidMount() {
        // if (!this.props.socketConnection) this.props._connectSocket(this.props)
        if (!this.props.town) this.props._setObject({ town: this.state.town })
    }

    render() {

        const style = {
            towndropdown: {
                fontWeight: "700",
                background: "none",
                border: "0",
                fontSize: "20px",
                WebkitAppearance: "none",
                textAlign: "center",
                textAlignLast: "center",
                width: "95px"
            }
        }
        const townId = this.props.town || this.state.town
        const town = this.props.towns && this.props.towns[townId]
        // const municipality = town && town.municipality


        let inhabitants = (town && town["inhabitants"]) || 0
        inhabitants = formatNumber(parseInt(inhabitants, 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true });

        return (
            <div className="content-border">
                <div className="mainContentCon">
                    {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i> */}
                    {/* <div className="float-right">

                    </div> */}
                    <div className="contentCon overflow">
                        <div className="contentText">
                            <div className="text-center fs-20 mb-50">
                                <span>Het{" "}</span>
                                {<select style={style.towndropdown} value={townId}
                                    onChange={e => this.setState({ town: e.target.value },
                                        () => this.props._setObject({ town: this.state.town })
                                    )}>
                                    {
                                        this.props.towns && this.props.towns.map((town, i) => {
                                            return <option key={i} value={i}>{town.municipality}</option>
                                        })
                                    }
                                </select>}
                                <span>{" "}wordt</span><br></br>
                                <span>100% Duurzaam...</span>
                                <div>
                                    <img src={require('../assets/Crowd.png')} alt={"crowd"} />
                                </div>
                                <div className="text-center fs-20 mb-50">
                                    <span>voor</span>{" "}
                                    <span><strong>{inhabitants}</strong></span>{" "}
                                    <span>{(town && town["name"]) || ""}</span>
                                </div>
                                <div className="text-center fs-20">
                                    <span><strong>Crowdfunding {" "}</strong>{" met 3-10% Rente"}</span><br></br>
                                    <span>elk moment Opstapbaar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footBtn">
                    <div className="container text-center">
                        <div className="beforeFooter">
                            <div className="col-5">
                                &nbsp;
                            </div>
                            <div className="col-2">
                                <button className="arrowBtn" onClick={() => this.props.history.push("/", { path: "objectlist" })}>
                                    <span className="flaticon-right-arrow"></span>
                                </button>
                            </div>
                            <div className="col-5 lh-54 text-left">
                                <span>Verder</span>
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

export default Home