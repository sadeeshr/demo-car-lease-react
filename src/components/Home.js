import React, { Component } from 'react'
// import cc from '../lib/utils';

class Home extends Component {

    componentWillMount() {
        // cc.log(this.props);
    }

    componentDidMount() {
        if (!this.props.socketConnection) this.props._connectSocket(this.props)
    }

    render() {
        const img = { "maxHeight": "40px", "maxWidth": "80px", "display": "block", "width": "auto", "height": "auto" }

        return (
            <div className="content-border">
                <div className="mainContentCon">
                    <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">
                        <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                    </div>
                    <div className="navCon">
                        <h1 id="header">WESTLAND ENERGY NEUTRAL</h1>
                        {/*  */}
                    </div>
                    <div className="contentCon overflow">
                        <div className="contentText">
                            <p>Westland Energy Neutral is your local energy cooperation that helps you to quit your fossil fuel addiction  by giving you an alternative.</p>
                            <p>We not only offer you renewable energy but provides you a solution to finance your transition to a sustainable future.</p>
                            <div className="contentBtn bg-none">
                                <table className="tablepadBot" style={{ borderSpacing: "0px", borderCollapse: "collapse" }}>

                                    <tbody>
                                        <tr className="htableTitle">
                                            <td>Now available</td>
                                            <td>Expected</td>
                                            <td>Expected</td>
                                        </tr>
                                        <tr className="htablecar">
                                            <td><button onClick={() => this.props.history.push("/", { module: this.props.location.state.module, path: "members" })}><img src={require('../assets/TeslaRoadster.png')} style={img} alt="addM1" /></button></td>
                                            <td disabled><button ><img src={require('../assets/solar.png')} style={img} alt="addM2" /></button></td>
                                            <td disabled><button ><img src={require('../assets/ac.png')} style={img} alt="addM3" /></button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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