import io from 'socket.io-client';
import cc from './utils';

// let agent = new https.Agent();

// const SOCKET_URL = "https://blockchain.techiearea.com:3456"; // for development
const SOCKET_URL = "https://smartjuice.apayaa.com:3456";
const SOCKET_OPTIONS = {
    // secure: true,
    // rejectUnauthorized: false
    // agent: https.globalAgent
    reconnect: true, secure: true, rejectUnauthorized: false
}

class Socket {

    constructor() {
        this.socket = null;
        this.props = null;
        this.account = null;
    }

    connectSocket = (props, DOMAIN) => {
        // let SOCKET_URL = "https://" + DOMAIN + ":3456"
        this.socket = io.connect(SOCKET_URL, SOCKET_OPTIONS);
        this.props = props
        this.bindSocket(this.socket)
    }

    newData = (data) => {
        if (this.socket) {
            this.socket.emit("new", data)
            return data
        }
    }

    fetchData = (data, account) => {
        if (account) this.account = account
        if (this.socket) {
            this.socket.emit("fetch", data)
            return data.module
        }

    }

    updateData = (data) => {
        if (this.socket) {
            this.socket.emit("update", data)
            return data
        }
    }

    bindSocket = (socket) => {
        this.socket.on('response', (data) => cc.log(data))
        this.socket.on('connect', () => { cc.log("Online now, Socket ID: ", socket.id); this.props._socketStatus(true) })
        this.socket.on('disconnect', () => { cc.log("Offline now"); this.props._socketStatus(true) })
        this.socket.on('data', data => {
            cc.log("DATA: ", data, this.account);
            if (data) this.props._contractDataResponse(this.account, { [data.module]: data.result });
        })
        this.socket.on('event', (data) => {
            cc.log("EVENT: ", data, this.props.module, this.account)
            if (data) {
                // if (data.event === "Transfer" || data.event === "Claim" || data.event) 
                this.props._fetchMembers(this.props.module, this.account)
                this.props._setEvent(data)
            }
        })
    }

    disconnectSocket = () => this.socket.disconnect()
}

const socApi = new Socket();
export default socApi;