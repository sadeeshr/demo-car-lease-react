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
    }

    componentDidMount() {
        if (!this.props.members) {
            this.fetchMembers()
        } else this.setState({ members: this.props.members })
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
        this.props._fetchContractData(data)
    }

    componentWillReceiveProps(nextProps) {
        console.log("Members Update Props", nextProps);
        if (nextProps.members) this.setState({ members: nextProps.members })
    }

    // evTokenMyTokens = (carID) => {
    //     this.props.evToken.myTokens(this.props.account, carID)
    //         .then(result => {
    //             this.setState({ ["evToken_" + carID]: result[0].toString() })
    //         })
    // }

    renderMember = (member, i) => {
        const img = { "display": "block" }
        // if (this.props.account)
        if (!(this.props.evTokens && this.props.evTokens[member.carID])) this.props._evMyTokens(this.props.account, member.carID)
        // this.evTokenMyTokens(member.carID)
        const selected = this.props.member ? (this.props.member.username === member.username ? true : false) : false
        let memberRows = [
            <div className="mtableLink" key={i} onClick={() => this.props._memberSelected(member)}>
                <div className="mtableTokens">{member.carID || ""} <p>{this.props.evTokens ? this.props.evTokens[member.carID] || "" : ""}</p></div>
                <div className="mtableUser">{member.username || ""}, {member.state || ""}</div>
                <div className="mtableCar"><img style={img} src={member.carPic || ""} alt="carImage" /></div>
            </div>
        ]

        if (selected) {
            memberRows.push(

                <div className="rowSelect" key={'invest-' + i}>
                    <div className="memberMesCon">{member.message}</div>
                    <div className="memberMesBtns">
                        <div className="membersBtn">
                            <a role="button" onClick={() => this.props.history.push("/invest")}>
                                <p><img src={require('../assets/add.png')} alt="test" /> Invest</p>
                            </a>
                        </div>
                    </div>
                </div>
            )
        }

        return memberRows
    }

    render() {
        // if (this.props.members_new) this.fetchMembers()

        const members = this.props.members ? this.props.members.filter(member => (member.username.startsWith(this.state.filter) || member.carID === parseInt(this.state.filter))) : []
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

                        {
                            members && members.map((member, i) => {
                                return this.renderMember(member, i)
                            })
                        }

                        <div className="contentBtn">
                            <input className="searchBtn" type="text" name="filterMembers" value={this.state.filter || ""} placeholder="Search" onChange={(e) => { console.log("SEARCH: ", e.target.value); this.setState({ filter: e.target.value }) }} />

                        </div>
                        <div className="contentBtn addMe" >
                            <a role="button" onClick={() => this.props.history.push("/addMember", { module: this.props.module })}>
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