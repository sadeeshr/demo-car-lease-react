import React, { Component } from 'react'
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

class Members extends Component {

    constructor(props) {
        super(props);
        this.state = {
            progress: false,
            clicked: {
                fullname: ""
            }
        }
    }

    componentWillMount() {
        console.log("Members Props", this.props);
    }

    componentWillUnmount() {
        // this.props._resetMemberSelection()
    }

    componentDidMount() {
        if (!this.props[this.props.module]) this.props._fetchContractData(this.props.location.state.module)
    }

    componentWillReceiveProps(nextProps) {
        console.log("Members Update Props", nextProps);
    }

    renderMember = (member, i) => {
        const img = { "display": "block" }
        const selected = this.props.member ? (this.props.member.fullname === member.fullname ? true : false) : false
        let memberRows = [
            <div className="mtableLink" key={i} onClick={() => this.props._memberSelected(member)}>
                <div className="mtableTokens">{member.tokens || ""} <p>{(member.earned || "") && ("\n" + (member.earned || ""))}</p></div>
                <div className="mtableUser">{member.fullname || ""}, {member.county || member.city || ""}</div>
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
        if (!this.props.account) this.props._getAccount();

        return (
            <div>

                <h1 id="header">Members</h1>
                <div className="mtableCon">
                    <div className="mtableTitle">
                        <div className="mtableTokens">EVTokens</div>
                        <div className="mtableUser">User Town</div>
                        <div className="mtableCar">Car</div>
                    </div>
                </div>
                <BlockUi tag="div" blocking={this.props.progress}>
                    {
                        (this.props[this.props.location.state.module]) ? this.props[this.props.location.state.module].members.map((member, i) => {
                            return this.renderMember(member, i)
                        }) : []
                    }

                </BlockUi>
                <div className="contentBtn">
                    <input className="searchBtn" type="" name="" placeholder="Search"></input>

                </div>
                <div className="contentBtn addMe" >
                    <a role="button" onClick={() => this.props.history.push("/addMember", { module: this.props.location.state.module })}>
                        <img src={require('../assets/add.png')} alt="addM" />
                        <p>Add Me</p></a>
                </div>
            </div>)
    }
}

export default Members