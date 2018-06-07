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
            },
            filter: {
                _id: 1,
                username: 1,
                account: 1,
                town: 1,
                message: 1,
                profilePic: 1
            }
        }
        if (!this.props.usernames && this.props.socket) this.props._fetchContractData(this.props, data, this.props.account)
        if (this.props.account) this.checkRegistered(this.props.account)
    }

    checkRegistered = (account) => {
        // console.log("REG check: ", account, this.props);
        if (this.props.usernames) {

            const member = this.props.usernames ? this.props.usernames.find(user => user.account === account) : null

            if (member) {
                this.props._setObject({ registered: member["_id"] })
            } else
                cc.log("USER NOT REGISTERED YET")
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
        evs = formatNumber((parseInt(evs, 10) / 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true });
        let neutral = town && town["households"]
        neutral = formatNumber(parseInt(neutral, 10), { precision: 2, thousand: ".", decimal: ",", stripZeros: true });
        let solar = town && town["inhabitants"]
        solar = formatNumber((parseInt(solar, 10) / 1000), { precision: 2, thousand: ".", decimal: ",", stripZeros: true });
        let wind = town && town["inhabitants"]
        wind = formatNumber((parseInt(wind, 10) / 10000), { precision: 2, thousand: ".", decimal: ",", stripZeros: true });

        const nextScreen = (this.props.registered || !this.props.account) ? "members" : "addmember"

        cc.log("MEMBER ID: ", this.props.registered)

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