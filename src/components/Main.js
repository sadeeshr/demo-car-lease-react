import React, { Component } from 'react'

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: "Please Unlock Your Metamask"
        }
    }

    componentWillMount() {
        console.log(this.props);
    }

    componentDidMount() {
        const { web3 } = window
        // Check if Web3 has been injected by the browser:
        if (typeof web3 !== 'undefined') {
            // You have a web3 browser! Initiate Contract Object!
            if (!this.props.LeaseContract) this.props._initContract(this.props, web3)
            // if (!this.props.account) this.props._getAccount();
        } else {
            // Warn the user that they need to get a web3 browser
            // Or install MetaMask, maybe with a nice graphic.
            console.log("NO WEB3");
            this.setState({ alert: "Please Install Metamask plugin" })
        }

    }

    render() {
        const img = { "maxHeight": "95px", "maxWidth": "180px", "display": "block", "width": "auto", "height": "auto" }
        const thumbImg = { "maxHeight": "40px", "maxWidth": "40px", "display": "block", "width": "auto", "height": "auto" }
        const disabled = this.props.account ? false : true
        const cursor = this.props.account ? "pointer" : "not-allowed"
        return (
            <div className="mainContentCon">
                <div className="navCon">
                </div>
                <div className="contentCon">
                    <h1 id="header">Car Lease</h1>

                    <table>
                        <tbody>
                            <tr>
                                <td><img style={img} src={require('../assets/TeslaRoadster.png')} alt="logo" /></td>
                                <td>
                                    <img className="flagMargin" style={thumbImg} src={require('../assets/india_flag.jpg')} alt="logo" />
                                    <img style={thumbImg} src={require('../assets/netherlands_flag.png')} alt="logo" />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="contentBtn ">
                        <span hidden={!disabled}>{this.state.alert}</span>
                        <button style={{ cursor: cursor }} disabled={disabled} onClick={() => this.props.history.push("/home", { module: "westland" })} >Westland</button>
                        <button style={{ cursor: cursor }} disabled={disabled} onClick={() => this.props.history.push("/home", { module: "middendelftland" })}>Midden Delftland</button>
                        <button style={{ cursor: cursor }} disabled={disabled} onClick={() => this.props.history.push("/home", { module: "AddMember" })}>Jouw gemeente hier<img src={require('../assets/add.png')} alt="addM" /></button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Main