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
        // const town = this.props.towns[this.props.town];

        let data = {
            module: "membersdev4",
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
        if (this.props.account && this.props.usernames) this.checkRegistered(this.props.account)
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
                fontWeight: "700",
                background: "none",
                border: "0",
                fontSize: "20px",
                WebkitAppearance: "none",
                textAlign: "center",
                textAlignLast: "center"
            },
            p: {
                textAlign: "center",
                fontSize: "16px",
                lineHeight: "24px"
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

        const nextScreen = ((this.props.usernames && this.props.registered) || !this.props.account) ? "objects" : "addmember"

        cc.log("MEMBER ID: ", this.props.registered)

        const imageStyle = {
            // float: "left",
            width: "120px",
            // display: "block",
            height: "auto"
        }
        return (
            <div className="content-border">
                <div className="mainContentCon">
                    {/* <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">

                    </div> */}
                    <div className="contentCon overflow">
                        <div className="contentText">
                            <div className="text-center fs-20">
                                <span>Het{" "}</span>
                                <span style={style.towndropdown}>
                                    {town && town["municipality"]}
                                </span>
                                <span>{" "}wil</span>
                            </div>
                            <div className="container dp-block">
                                <div className="col-5 text-center">
                                    {/*<img style={imageStyle} src={require('../assets/carwhite.png')} alt={"car"} />*/}
                                </div>
                                <div className="col-7 mt-30">
                                    <p style={style.p}>{evs + " "} Electrisch</p>
                                    <p style={style.p}>Zelfrijdende Taxi's</p>
                                    <p style={style.p}><strong>Nu 25</strong></p>
                                </div>
                            </div>
                            <div className="container dp-block">
                                <div className="col-5 text-center">
                                    {/*<img style={imageStyle} src={require('../assets/energy.png')} alt={"energy"} />*/}
                                </div>
                                <div className="col-7 mt-30">
                                    <p style={style.p}>{neutral + " "} Energie</p>
                                    <p style={style.p}>Neutrale Huishoudens</p>
                                    <p style={style.p}><strong>Nu 39</strong></p>
                                </div>
                            </div>
                            <div className="container dp-block">
                                <div className="col-5 text-center">
                                    {/*<img style={imageStyle} src={require('../assets/solar.png')} alt={"solar"} />*/}
                                </div>
                                <div className="col-7 mt-30">
                                    <p style={style.p}>{solar + " "} Zonnedaken</p>
                                    <p style={style.p}><strong>Nu 2</strong></p>
                                </div>
                            </div>
                            <div className="container dp-block">
                                <div className="col-5 text-center">
                                    {/*<img style={imageStyle} src={require('../assets/wind.png')} alt={"wind"} />*/}
                                </div>
                                <div className="col-7 mt-30">
                                    <p style={style.p}>{wind + " "} Noordzee</p>
                                    <p style={style.p}>Windmolens</p>
                                    <p style={style.p}><strong>Nu 0</strong></p>
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
                                <button className="arrowBtn" onClick={() => this.props.history.push("/", { path: nextScreen })}>
                                    <span className="flaticon-right-arrow"></span>
                                </button>
                            </div>
                            <div className="col-5 lh-54 text-left">
                                <span>Wordt lid</span>
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
                            <span className="flaticon-social-media"></span>
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

export default ObjectList