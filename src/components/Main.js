import React, { Component } from 'react'
import Home from '../containers/Home';
import Members from '../containers/Members';
import AddMember from '../containers/AddMember';
import Invest from '../containers/Invest';
import Invoices from '../containers/Invoices';
import ModelViewer from 'metamask-logo'

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: "Please Unlock Your Metamask"
        }
        this.viewer = ModelViewer({

            // Dictates whether width & height are px or multiplied
            pxNotRatio: true,
            width: 100,
            height: 100,
            // pxNotRatio: false,
            // width: 0.9,
            // height: 0.9,

            // To make the face follow the mouse.
            followMouse: true,

            // head should slowly drift (overrides lookAt)
            slowDrift: false,

        })
    }

    componentWillMount() {
        console.log("MAIN: ", this.props);
        // if (this.props.initRoute)
        //     this.props.history.replace("/", {})
    }

    componentDidMount() {
        const { web3 } = window
        // Check if Web3 has been injected by the browser:
        if (typeof web3 !== 'undefined') {
            // You have a web3 browser! Initiate Contract Object!
            if (!this.props.LeaseContract) this.props._initContract(this.props, web3)
            // this.setState({ alert: "Please Install Metamask plugin", url: "https://metamask.io/" })

            // if (!this.props.account) this.props._getAccount();
        } else {
            // Warn the user that they need to get a web3 browser
            // Or install MetaMask, maybe with a nice graphic.
            console.log("NO WEB3");
            this.setState({ alert: "Please Install Metamask plugin", url: "https://metamask.io/" })
        }

        // window.addEventListener("beforeunload", this.onUnload.bind(this))

        // add viewer to DOM
        let container = document.getElementById('metamask-logo')
        if (container) container.appendChild(this.viewer.container)
    }

    onUnload(event) { // the method that will be used for both add and remove event
        console.log("hellooww")
        event.returnValue = "Hellooww"
        return event
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps
        if (nextProps.location.state) this.renderComponent()
    }

    componentWillUnmount() {
        // window.removeEventListener("beforeunload", this.onUnload.bind(this))

        // window.onbeforeunload = (e) => {
        //     console.log("################AM I HERE######################");
        //     console.log(e);
        //     alert("No!!")
        //     return 'Stop this event';
        // };
    }

    renderMain = () => {
        const img = { "maxHeight": "95px", "maxWidth": "180px", "display": "block", "width": "auto", "height": "auto" }
        // const thumbImg = { "maxHeight": "40px", "maxWidth": "40px", "display": "block", "width": "auto", "height": "auto" }
        const disabled = this.props.account ? false : true
        const cursor = this.props.account ? "pointer" : "not-allowed"

        return <div className="content-border">
            <div className="mainContentCon">
                <div className="navCon">
                    <h1 id="header">ENERGY NEUTRAL 2030</h1>
                </div>
                <div className="contentCon overflow bg-none">


                    <table>
                        <tbody>
                            <tr>
                                <td><img src={require('../assets/car-solar.png')} alt="logo" /></td>
                                {/* <td>
                                <img className="flagMargin" style={thumbImg} src={require('../assets/india_flag.jpg')} alt="logo" />
                                <img style={thumbImg} src={require('../assets/netherlands_flag.png')} alt="logo" />
                            </td> */}
                            </tr>
                        </tbody>
                    </table>
                    <div className="contentBtn ">
                        <div hidden={!disabled} id="metamask-logo" style={{ textAlign: "center" }}><span hidden={!disabled} style={{ cursor: this.state.url ? "pointer" : "default" }} onClick={() => this.state.url ? window.open(this.state.url, "_blank") : ""}>{this.state.alert}</span></div>
                        <button style={{ cursor: cursor }} disabled={disabled} onClick={() => this.props.history.push("/", { module: "westland", path: "home" })} >Westland</button>
                        <button style={{ cursor: cursor }} disabled={disabled} onClick={() => this.props.history.push("/", { module: "middendelftland", path: "home" })}>Midden Delftland</button>

                    </div>
                </div>
                <div className="footCon">
                    <div><span>Your town here</span><button className="arrowBtn" hidden={disabled} disabled={disabled} onClick={() => this.props.history.push("/", { module: "AddMember", path: "home" })}><img src={require('../assets/arrow.jpg')} alt="addM" /></button></div>
                </div>
            </div>
        </div>
    }

    renderComponent = () => {
        if (this.props.location && this.props.location.state) {
            const historyState = this.props.location.state
            switch (historyState.path) {
                case "home":
                    return <Home />
                case "members":
                    return <Members />
                case "addmember":
                    return <AddMember />
                case "invest":
                    return <Invest />
                case "invoices":
                    return <Invoices />
                default:
                    return this.renderMain()
            }
        } else
            return this.renderMain()
    }

    render() {

        return (
            <div>
                {this.renderComponent()}
            </div>
        )
    }
}

export default Main