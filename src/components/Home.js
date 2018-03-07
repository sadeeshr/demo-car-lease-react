import React, { Component } from 'react'
import ReactLoading from 'react-loading';

class Home extends Component {

    componentWillMount() {
        console.log(this.props);
    }

    componentDidMount() {
        if (!this.props.socketConnection) this.props._connectSocket(this.props)
    }

    render() {
        return (
            <div className="mainContentCon">
                <div className="navCon">
                    <i className="flaticon-back" onClick={() => this.props.history.goBack()}></i>
                    <div className="float-right">
                        <i onClick={() => this.props.history.push("/")} className="flaticon-home"></i>
                    </div>
                </div>
                <div className="contentCon">
                    <h1 id="header">Westland1000x</h1>
                    <div className="contentText">
                        <p>The cooperative that always takes care of one electric autonomous car in front of your door and you only pay if you use it. From 10 euros per day, 1 euro per hour, 10 cents per km,  1 cent per ride for this fantastic app</p>
                        <p>You can opt for a (private) lease, full time user or prepaid account.</p>
                        <p>An ICO in which 1000+ cars become financed and money for the first 100 has been picked up. It’s a competition, the potential preparer with the most voting is at the top of the list to use a Tesla.</p>
                        <div className="contentBtn bg-none">
                            <button onClick={() => this.props.history.push("/members", { module: this.props.location.state.module })}><img src={require('../assets/add.png')} alt="addM" /></button>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}

export default Home