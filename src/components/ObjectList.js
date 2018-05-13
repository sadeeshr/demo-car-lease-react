import React, { Component } from 'react'
import formatNumber from 'accounting-js/lib/formatNumber.js'

class ObjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {

    }

    render() {

        const style = {
            towndropdown: {
                fontWeight: "800",
                background: "none",
                border: "0",
                fontSize: "16px",
                WebkitAppearance: "none",
                textAlign: "center",
                textAlignLast: "center"
            },
            p: {
                textAlign: "center",
                fontSize: "12px",
                lineHeight: "10px"
            }
        }

        const town = this.props.towns[this.props.town];
        let evs = town && town["inhabitants"]
        evs = formatNumber((parseInt(evs, 10) / 10), { precision: 0, thousand: "." });
        let neutral = town && town["households"]
        neutral = formatNumber(parseInt(neutral, 10), { precision: 0, thousand: "." });
        let solar = town && town["inhabitants"]
        solar = formatNumber((parseInt(solar, 10) / 1000), { precision: 0, thousand: "." });
        let wind = town && town["inhabitants"]
        wind = formatNumber((parseInt(wind, 10) / 10000), { precision: 0, thousand: "." });
        return (
            <div className="content-border">
                <div className="mainContentCon">
                    <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">

                    </div>
                    <div className="contentCon overflow">
                        <div className="contentText">
                            <span>Het{" "}</span>
                            <span style={style.towndropdown}>
                                {town && town["municipality"]}
                            </span>
                            <span>{" "}wil</span>
                            <div>
                                <p style={style.p}>{evs + " "} Electrisch</p>
                                <p style={style.p}>Zelfrijdende Taxi's</p>
                                <p style={style.p}><strong>Nu 25</strong></p>
                            </div>
                            <br />
                            <div>
                                <p style={style.p}>{neutral + " "} Energie</p>
                                <p style={style.p}>Neutrale Huishoudens</p>
                                <p style={style.p}><strong>Nu 39</strong></p>
                            </div>
                            <br />
                            <div>
                                <p style={style.p}>{solar + " "} Zonnedaken</p>
                                <p style={style.p}><strong>Nu 2</strong></p>
                            </div>
                            <br />
                            <div>
                                <p style={style.p}>{wind + " "} Noordzee</p>
                                <p style={style.p}>Windmolens</p>
                                <p style={style.p}><strong>Nu 0</strong></p>
                            </div>
                        </div>
                    </div>
                    <div className="footCon">
                        <div>
                            <span>Verder</span>
                            <button className="arrowBtn" onClick={() => this.props.history.push("/", { module: this.props.location.state.module, path: "addmember" })}>
                                <img src={require('../assets/arrow.jpg')} alt="addM" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}

export default ObjectList