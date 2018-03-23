import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import scrollToComponent from 'react-scroll-to-component';

class Members extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: ''
        }
    }



    componentWillMount() {
        console.log("Members Props", this.props);
        if (this.props.reloadTokens) this.fetchMembers()
    }

    componentDidMount() {
        if (!this.props.members) {
            this.fetchMembers()
        }
    }

    fetchMembers = () => {
        let data = {
            module: "members",
            query: {
                module: this.props.location.state.module
            },
            filter: {
                _id: 0,
                username: 1,
                state: 1,
                message: 1,
                carID: 1,
                carPic: 1,
                carPrice: 1,
                module: 1
            }
        }
        this.props._fetchContractData(this.props.account, data)
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps
        console.log("Members Update Props", nextProps);
        // if (this.props.members && ) this.props._reloadTokens()
        if (this.props.reloadTokens) this.fetchMembers()
        if (this.props.members) {
            let members = this.sortMembers()
            console.log("######## SORTED MEMBERS ###########", members);
            if (members.length >= 3) {
                members[0].car ? members[0].car.crowdsaleClosed = true : ""
                // members[1].car ? members[1].car.crowdsaleClosed = true : ""
                //     // members[2].car ? members[2].car.crowdsaleClosed = true : ""
            }
            this.setState({ members })
            // if (!this.props.lcCars)
            // for (let i = 1; i <= this.props.members.length; i++) {
            //     // this.fetchCar(i)
            //     this.props._lcCars(i)
            //     this.props._evMyTokens(this.props.account, i)
            // }
            // this.props.members.map(member => {
            //     if (!member.car) this.props._lcCars(member.carID)
            //     if (!member.evTokens) this.props._evMyTokens(this.props.account, member.carID)

            // })
            // if (!this.props.evTokens) this.props._reloadTokens()
        }

        // if (this.props.addNewObjectTxID || this.props.raiseFundsForCarTxID) this.fetchMembers()
    }

    // evTokenMyTokens = (carID) => {
    //     this.props.evToken.myTokens(this.props.account, carID)
    //         .then(result => {
    //             this.setState({ ["evToken_" + carID]: result[0].toString() })
    //         })
    // }

    fetchEvTokens = () => {
        for (let i = 1; i <= this.props.members.length; i++) {
            this.props._evMyTokens(this.props.account, i)
        }
    }

    renderMember = (member, i) => {

        const img = { "display": "block" }
        // if (this.props.account)
        // if (!(this.props.evTokens && this.props.evTokens[member.carID]) || this.props.addNewObjectTxID || this.props.raiseFundsForCarTxID) this.props._evMyTokens(this.props.account, member.carID)
        // this.evTokenMyTokens(member.carID)
        const selected = (this.props.member && !this.props.member.car.crowdsaleClosed) ? (this.props.member.username === member.username ? true : false) : false
        let memberRows = [
            <div className="mtableLink" ref={divRef => this[member.carID] = divRef} key={i} onClick={() => this.props._memberSelected(member)}>
                <div className="mtableTokens">{member.car ? (member.car.crowdsaleClosed ? <span style={{ color: "green", fontSize: "10px" }}>Closed</span> : member.car.totalRaised.toNumber()) : "0" || ""} <p>{member.evTokens}</p></div>
                <div className="mtableUser">{member.username || ""} <p>{member.state || ""}</p></div>
                <div className="mtableCar"><img style={img} src={member.carPic || ""} alt="carImage" /><span title="Car Raised" style={{ fontSize: "10px" }}>Euro {member.carPrice}</span></div>
            </div>
        ]

        if (selected) {
            memberRows.push(

                <div className="rowSelect" key={'invest-' + i}>
                    <div className="memberMesCon">{member.message}</div>
                    <div className="memberMesBtns">
                        <div className="membersBtn">
                            <a role="button" onClick={() => { this.props.history.push("/", { module: this.props.module, path: "invest" }) }}>
                                <p><img src={require('../assets/add.png')} alt="test" /> Invest</p>
                            </a>
                        </div>
                    </div>
                </div>
            )
        }

        return memberRows
    }

    sortMembers = () => {
        if (this.props.members) {
            const members = this.props.members.sort((a, b) => {
                if (a.car && a.car.crowdsaleClosed)
                    return 0
                else if ((a.car && a.car.totalRaised) && (b.car && b.car.totalRaised)) {
                    console.log(`Car Raised-${b.carID}=> ${b.car.totalRaised.toNumber()} - Car Raised-${a.carID}=> ${a.car.totalRaised.toNumber()}`);
                    return b.car.totalRaised.toNumber() - a.car.totalRaised.toNumber()
                } else
                    return 0
            })
            console.log("$$$$$$$$$ sorted members: $$$$$$$$$$$$$", members);
            return members
        } else
            return []
    }

    render() {

        // const members = this.state.members ? this.state.members.filter(member => (member.username.startsWith(this.state.filter) || member.carID === parseInt(this.state.filter, 10))) : []
        const members = this.props.members ? this.props.members.filter(member => (member.username.startsWith(this.state.filter) || member.carID === parseInt(this.state.filter, 10))) : []

        // TESTING DIV FOCUS
        // if (members && members[4] && members[4].car) members[4].car.crowdsaleClosed = true
        // const divFocus = members.length > 0 ? members.find(member => { console.log(member, member.car && !member.car.crowdsaleClosed); if (member.car && !member.car.crowdsaleClosed) return member }) : 1
        // divFocus && console.log("div Focus: ", divFocus.carID, this[divFocus.carID]);
        // if (divFocus) setTimeout(() => {
        //     scrollToComponent(this[divFocus.carID], {
        //         offset: 1000,
        //         align: 'top',
        //         duration: 1500
        //     })
        // }, 1000);

        return (
            <div className="mainContentCon">
                <div className="navCon">
                    <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">
                        <i onClick={() => this.fetchMembers()} className="flaticon-rotate"></i>
                        <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                    </div>
                </div>
                <div className="contentCon">
                    <BlockUi tag="div" blocking={this.props.progress}>

                        <h1 id="header">Leasecars</h1>
                        {
                            this.props.location.state && this.props.location.state.addNewObjectTxID &&
                            <div className="carCon">
                                <div className="carcol">
                                    <div className="carTitle">Transaction ID:</div>
                                    <div className="carEth">{this.props.location.state.addNewObjectTxID}</div>
                                    <div className="carPrice"><a target="_blank" href={"https://rinkbey.etherscan.io/tx/" + this.props.location.state.addNewObjectTxID}>Check Transaction </a></div>
                                </div>
                            </div>
                        }
                        {
                            /*
                                <div className="mtableCon">
                                    <div className="mtableTitle">
                                        <div className="mtableTokens">EVTokens</div>
                                        <div className="mtableUser">User Town</div>
                                        <div className="mtableCar">Car</div>
                                    </div>
                                </div>
                            */
                        }
                        <div className="membersCon overflow">
                            {
                                members && members.map((member, i) => {
                                    return this.renderMember(member, i)
                                })
                            }
                        </div>
                        <div className="contentBtn">
                            <input className="searchBtn" type="text" name="filterMembers" value={this.state.filter || ""} placeholder="Search" onChange={(e) => { console.log("SEARCH: ", e.target.value); this.setState({ filter: e.target.value }) }} />

                        </div>

                    </BlockUi>

                </div>

            </div>
        )
    }
}

export default Members