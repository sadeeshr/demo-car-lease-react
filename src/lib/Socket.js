import io from 'socket.io-client';
import https from 'https';


// let agent = new https.Agent();

const SOCKET_URL = "https://blockchain.techiearea.com:3456";
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
    }

    connectSocket = (props) => {
        this.socket = io.connect(SOCKET_URL, SOCKET_OPTIONS);
        this.props = props
        this.bindSocket(this.socket)
    }

    fetchData = (module) => {
        this.socket.emit("fetch", module)
        return module
    }

    updateData = (data) => {
        this.socket.emit("update", data)
        return module
    }

    bindSocket = (socket) => {
        this.socket.on('response', (data) => console.log(data))
        this.socket.on('connect', () => { console.log("Online now, Socket ID: ", socket.id); })
        this.socket.on('disconnect', () => console.log("Offline now"))
        this.socket.on('data', data => {
            this.props._contractDataResponse(data);
        })
    }

    disconnectSocket = () => this.socket.disconnect()
}

const socApi = new Socket();
export default socApi;