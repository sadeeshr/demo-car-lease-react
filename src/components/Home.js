import React, { Component } from 'react'
// import cc from '../lib/utils';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            town: 0
        }
    }


    componentWillMount() {
        this.fetchMunicipalityData()
    }

    fetchMunicipalityData = () => {
        let data = {
            module: "municipality",
            result: "towns",
        }
        if (this.props.socket) this.props._fetchContractData(this.props.account, data)
    }

    componentDidMount() {
        if (!this.props.socketConnection) this.props._connectSocket(this.props)
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

        return (
            <div className="content-border">
                <div className="mainContentCon">
                    <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">

                    </div>
                    <div className="contentCon overflow">
                        <div className="contentText">
                            <span>Het{" "}</span>
                            <select style={style.towndropdown} value={this.props.town && this.props.town[this.state.town]["municipality"]} onChange={e => this.setState({ town: e.target.value })}>
                                {
                                    this.props.towns && this.props.towns.map((town, i) => {
                                        return <option key={i} value={i}>{town.municipality}</option>
                                    })
                                }
                            </select>
                            <span>{" "}wordt</span>
                            <p>100% Duurzaam...</p>
                            <div className="contentBtn bg-none">

                            </div>
                            <p>
                                <span>voor</span>{" "}
                                <span><strong>{this.props.towns && this.props.towns[this.state.town]["inhabitants"]}</strong></span>{" "}
                                <span>{this.props.towns && this.props.towns[this.state.town]["name"]}</span>
                            </p>
                        </div>
                    </div>
                    <div className="footCon">
                        <div>
                            <span>Subscribe</span>
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

export default Home