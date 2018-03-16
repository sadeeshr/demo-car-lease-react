import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

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
            console.log("######## SORTED MEMBERS ###########", this.sortMembers());
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

        // if (this.props.addNewCarTxID || this.props.raiseFundsForCarTxID) this.fetchMembers()
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
        // if (!(this.props.evTokens && this.props.evTokens[member.carID]) || this.props.addNewCarTxID || this.props.raiseFundsForCarTxID) this.props._evMyTokens(this.props.account, member.carID)
        // this.evTokenMyTokens(member.carID)
        const selected = this.props.member ? (this.props.member.username === member.username ? true : false) : false
        let memberRows = [
            <div className="mtableLink" key={i} onClick={() => this.props._memberSelected(member)}>
                <div className="mtableTokens">{member.carID || ""} <p>{member.evTokens}</p></div>
                <div className="mtableUser">{member.username || ""}, {member.state || ""}</div>
                <div className="mtableCar"><span title="Car Raised" style={{ fontSize: "12px" }}>{member.car ? member.car.carRaised.toNumber() : "0"}</span><img style={img} src={member.carPic || ""} alt="carImage" /></div>
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
                else if ((a.car && a.car.carRaised) && (b.car && b.car.carRaised)) {
                    console.log(`Car Raised-${b.carID}=> ${b.car.carRaised.toNumber()} - Car Raised-${a.carID}=> ${a.car.carRaised.toNumber()}`);
                    return b.car.carRaised.toNumber() - a.car.carRaised.toNumber()
                } else
                    return 0
            })
            console.log("$$$$$$$$$ sorted members: $$$$$$$$$$$$$", members);
            return members
        } else
            return []
    }

    render() {
        
        window.onload = function() {
            var el = document.getElementById('mtableLink:nth-child(4)');
            el.scrollIntoView(true);
        }
        
        const members = this.props.members ? this.props.members.filter(member => (member.username.startsWith(this.state.filter) || member.carID === parseInt(this.state.filter, 10))) : []
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

                        <h1 id="header">Members</h1>
                        {
                            this.props.location.state && this.props.location.state.AddNewCarTxID &&
                            <div className="carCon">
                                <div className="carcol">
                                    <div className="carTitle">Transaction ID:</div>
                                    <div className="carEth">{this.props.location.state.AddNewCarTxID}</div>
                                    <div className="carPrice"><a target="_blank" href={"https://rinkbey.etherscan.io/tx/" + this.props.location.state.AddNewCarTxID}>Check Transaction </a></div>
                                </div>
                            </div>
                        }
                        <div className="mtableCon">
                            <div className="mtableTitle">
                                <div className="mtableTokens">EVTokens</div>
                                <div className="mtableUser">User Town</div>
                                <div className="mtableCar">Car</div>
                            </div>
                        </div>
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
                        <div className="contentBtn addMe" >
                            <a role="button" onClick={() => this.props.history.push("/", { module: this.props.module, path: "addmember" })}>
                                <img src={require('../assets/add.png')} alt="addM" />
                                <p>Add Me</p></a>
                        </div>
                    </BlockUi>

                </div>

            </div>
        )
    }
}

export default Members