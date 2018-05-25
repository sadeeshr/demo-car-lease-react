import React, { Component } from 'react'
import formatNumber from 'accounting-js/lib/formatNumber.js'
import cc from '../lib/utils';

class ObjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {
        // if (nextProps.account) this.checkRegistered(nextProps.account)
        this.fetchUserData()
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        this.props = nextProps
        if (nextProps.account && nextProps.socket && !nextProps.usernames) this.fetchUserData()
        if (nextProps.account && nextProps.usernames) this.checkRegistered(nextProps.account)
    }

    fetchUserData = () => {
        const town = this.props.towns[this.props.town];

        let data = {
            module: "membersdev2",
            result: "usernames",
            query: {
                municipalityID: town["municipalityID"]
            },
            filter: {
                _id: 0,
                username: 1,
                account: 1
            }
        }
        if (!this.props.usernames && this.props.socket) this.props._fetchContractData(this.props, data, this.props.account)
        if (this.props.account) this.checkRegistered(this.props.account)
    }

    checkRegistered = (account) => {
        // console.log("REG check: ", account, this.props);
        if (this.props.usernames) {
            const accounts = this.props.usernames ? this.props.usernames.map(user => user.account) : []
            // console.log(accounts, account, accounts.indexOf(account));
            this.setState({
                registered: (accounts.indexOf(account) !== -1) ? true : false
            })

        }
    }

    render() {

        cc.log("Object List state, props: ", this.state, this.props);
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

        const nextScreen = (this.state.registered || !this.props.account) ? "members" : "addmember"

        const imageStyle = {
            float: "left",
            width: "119px",
            display: "block",
            height: "auto"
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
                            <span style={style.towndropdown}>
                                {town && town["municipality"]}
                            </span>
                            <span>{" "}wil</span>
                            <div>
                                <img style={imageStyle} src={require('../assets/carwhite.png')} alt={"car"} />
                                <p style={style.p}>{evs + " "} Electrisch</p>
                                <p style={style.p}>Zelfrijdende Taxi's</p>
                                <p style={style.p}><strong>Nu 25</strong></p>
                            </div>
                            <br />
                            <div>
                                <img style={imageStyle} src={require('../assets/energy.png')} alt={"energy"} />
                                <p style={style.p}>{neutral + " "} Energie</p>
                                <p style={style.p}>Neutrale Huishoudens</p>
                                <p style={style.p}><strong>Nu 39</strong></p>
                            </div>
                            <br />
                            <div>
                                <img style={imageStyle} src={require('../assets/solar.png')} alt={"solar"} />
                                <p style={style.p}>{solar + " "} Zonnedaken</p>
                                <p style={style.p}><strong>Nu 2</strong></p>
                            </div>
                            <br />
                            <div>
                                <img style={imageStyle} src={require('../assets/wind.png')} alt={"wind"} />
                                <p style={style.p}>{wind + " "} Noordzee</p>
                                <p style={style.p}>Windmolens</p>
                                <p style={style.p}><strong>Nu 0</strong></p>
                            </div>
                        </div>
                    </div>
                    <div className="footCon">
                        <div>
                            <span>Verder</span>
                            <button className="arrowBtn" onClick={() => this.props.history.push("/", { path: nextScreen })}>
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