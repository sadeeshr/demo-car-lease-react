import React, { Component } from 'react'

class Main extends Component {

    componentWillMount() {
        console.log(this.props);
    }

    componentDidMount() {
        const { web3 } = window
        // Check if Web3 has been injected by the browser:
        if (typeof web3 !== 'undefined') {
            // You have a web3 browser! Initiate Contract Object!
            if (!this.props.contract) this.props._initContract(this.props, web3)

        } else {
            // Warn the user that they need to get a web3 browser
            // Or install MetaMask, maybe with a nice graphic.
            console.log("NO WEB3");
        }
    }

    render() {
        const img = { "maxHeight": "95px", "maxWidth": "180px", "display": "block", "width": "auto", "height": "auto" }
        const thumbImg = { "maxHeight": "40px", "maxWidth": "40px", "display": "block", "width": "auto", "height": "auto" }
        return (
            <div>
                <div>
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
                        <button onClick={() => this.props.history.push("/home", { module: "westland" })} >Westland</button>
                        <button onClick={() => this.props.history.push("/home", { module: "middendelftland" })}>Midden Delftland</button>
                        <button onClick={() => this.props.history.push("/home", { module: "AddMember" })}>Jouw gemeente hier<img src={require('../assets/add.png')} alt="addM" /></button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Main