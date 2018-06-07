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
                fontWeight: "800",
                background: "none",
                border: "0",
                fontSize: "16px",
                WebkitAppearance: "none",
                textAlign: "center",
                textAlignLast: "center"
            }
        }
        const townId = this.props.town || this.state.town
        const town = this.props.towns && this.props.towns[townId]
        // const municipality = town && town.municipality


        let inhabitants = town && town["inhabitants"]
        inhabitants = formatNumber(parseInt(inhabitants, 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true });

        return (
            <div className="content-border">
                <div className="mainContentCon">
                    <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">

                    </div>
                    <div className="contentCon overflow">
                        <div className="contentText">
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
                            <span>{" "}wordt</span>
                            <p>100% Duurzaam...</p>
                            <div>
                                <img src={require('../assets/Crowd.png')} alt={"crowd"} />
                            </div>
                            <p>
                                <span>voor</span>{" "}
                                <span><strong>{inhabitants}</strong></span>{" "}
                                <span>{town && town["name"]}</span>
                            </p>
                            <span><strong>Crowdfunding {" "}</strong>{" met 3-10% Rente"}</span>
                            <p>elk moment Opstapbaar</p>
                        </div>
                    </div>
                    <div className="footCon">
                        <div>
                            <span>Verder</span>
                            <button className="arrowBtn" onClick={() => this.props.history.push("/", { path: "objectlist" })}>
                                <img src={require('../assets/arrow.jpg')} alt="addM" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}

export default Home