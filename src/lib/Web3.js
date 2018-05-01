const Web3 = require('web3');
// const RINKEBY_NODE_URL = "wss://rinkeby.infura.io/_ws" //infura for testing websockets, can use our socket also
const RINKEBY_NODE_URL = "ws://localhost:8546"

const web3 = new Web3(new Web3.providers.WebsocketProvider(RINKEBY_NODE_URL));

// console.log("WSS WEB3: ", web3)

const spender = "0x4ad12Ef400a68Fa431F3908e8df2E51E95BAb113" // Lease Token Contract address as spender for Approve / Allowance methods
const contracts = {
    euroToken: {
        address: "0xa7aa26880AE3F2201779953f2d92e5ebA78C86Dd",
        abi: [{ "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }]
    },
    LeaseTokenContract: {
        address: spender,
        abi: [{ "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "investInObject", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "claimInvestment", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "updateFeeInLifecycle", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leasecbjectcycle", "outputs": [{ "name": "crowdsaleClosed", "type": "bool", "value": false }, { "name": "objectActive", "type": "bool", "value": false }, { "name": "objectActiveTime", "type": "uint256", "value": "0" }, { "name": "objectDeactiveTime", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newUser", "type": "address" }], "name": "addUser", "outputs": [{ "name": "", "type": "bool" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leaseobject", "outputs": [{ "name": "objectDealerAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectDriverAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectPrice", "type": "uint256", "value": "0" }, { "name": "objectType", "type": "uint256", "value": "0" }, { "name": "objectFee", "type": "uint256", "value": "0" }, { "name": "objectTerm", "type": "uint256", "value": "0" }, { "name": "objectContractHash", "type": "bytes", "value": "0x" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "giveMe", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_objectPrice", "type": "uint256" }, { "name": "_objectHash", "type": "bytes" }, { "name": "_objectType", "type": "uint256" }, { "name": "_objectDealerAddr", "type": "address" }, { "name": "_objectFee", "type": "uint256" }, { "name": "_objectTerm", "type": "uint256" }, { "name": "_mileagesAvg", "type": "uint256" }], "name": "createObject", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "autoPayFee", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "closeCrowdsale", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "sumBalanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_driver", "type": "address" }], "name": "updateDriverAddress", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "toClaimTotal", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "buyObjectWhenFundsRaised", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_owner", "type": "address" }], "name": "toClaimPerObject", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leaseobjectredemption", "outputs": [{ "name": "totalRaised", "type": "uint256", "value": "0" }, { "name": "totalDividends", "type": "uint256", "value": "0" }, { "name": "mileagesTotal", "type": "uint256", "value": "0" }, { "name": "mileagesAverage", "type": "uint256", "value": "0" }, { "name": "paymonth", "type": "uint256", "value": "0" }, { "name": "autoPay", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "payFee", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "activateDeactivateObject", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_objectId", "type": "uint256" }], "name": "objectBalanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "Euro", "outputs": [{ "name": "", "type": "address", "value": "0xa7aa26880ae3f2201779953f2d92e5eba78c86dd" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferLeaseToken", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "updateFeeDuringCrowedsale", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_mileagesAvg", "type": "uint256" }], "name": "updateMileages", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_type", "type": "uint256" }], "name": "sumObjectTypes", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_addressOfEuroToken", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Euro Token", "template": "elements_input_address", "value": "0xa7aa26880AE3F2201779953f2d92e5ebA78C86Dd" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "AddNewObject", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "claimed", "type": "bool" }], "name": "Claim", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "objectId", "type": "uint256" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "objectId", "type": "uint256" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }]
    }
}

//const euroToken = new web3.eth.Contract(contracts.euroToken.abi).at(contracts.euroToken.address) // old web3 connection
// const LeaseTokenContract = contract(contracts.LeaseTokenContract.abi).at(contracts.LeaseTokenContract.address) // old web3 connection

const euroToken = new web3.eth.Contract(contracts.euroToken.abi, contracts.euroToken.address)
const LeaseTokenContract = new web3.eth.Contract(contracts.LeaseTokenContract.abi, contracts.LeaseTokenContract.address)

// console.log("Euro Token: ", euroToken);
// console.log("Lease Token Contract: ", LeaseTokenContract);

// euroToken.methods.balanceOf("0x423b7b8da5ec685130670a978a1a680dfa27c879")
//     // .on('transactionHash', function (hash) {

//     // })
//     .on('receipt', function (receipt) {
//         console.log("receipt", receipt);
//     })
//     .on('confirmation', function (confirmationNumber, receipt) {
//         console.log("confirmation", confirmationNumber, receipt);
//     })
//     .on('error', console.error);



// test = () => LeaseTokenContract.methods.investInObject(8, 10).send()
//     .on('transactionHash', function (hash) {
//         console.log(`Invest In Object hash: ${hash}`);
//     })
//     .on('receipt', function (receipt) {
//         console.log(`Invest In Object receipt: ${receipt}`);
//     })
//     .on('confirmation', function (confirmationNumber, receipt) {
//         console.log(`Invest In Object confirmation: ${confirmationNumber}, ${receipt}`);
//     })
//     .on('error', console.error);

subscribeEvents = (io) => {
    console.log("!!! Subscribing to all events !!!");
    // euroToken.events.allEvents("latest", (error, event) => error ? console.error("euroToken EVENT ERROR: ", error) : console.log("euroToken EVENT: ", event))
    LeaseTokenContract.events.allEvents("latest", (error, event) => error ? console.error("LeaseTokenContract EVENT ERROR: ", error) : handleEvent(io, event))

    // setTimeout(() => {
    //     getConfirmationsHash("0xbc624a81a059d0a412961e8867d1e8bec1e0d50a0edf15073ecd3cd9123a81b4", res => console.log(res))
    // }, 2000);
}

handleEvent = (io, event) => {
    console.log("LeaseTokenContract EVENT: ", event)
    // console.log(event.event);
    // switch (event.event) {
    //     case value:

    //         break;

    //     default:
    //         break;
    // }
    getConfirmationsHash(event, resEvent => io.sockets.emit('event', resEvent))
}

getConfirmationsHash = (event, cb) => {
    let hash = event["transactionHash"]
    console.log("HASH: ", hash);
    let blockStart, blockEnd;
    let timer = setInterval(() => {
        console.log("CHECKING HASH CONFIRMATIONS:");

        web3.eth.getTransactionReceipt(hash)
            .then(res => {
                if (res && res.blockNumber) {
                    console.log("START BLOCK: ", res.blockNumber)
                    blockStart = res.blockNumber
                }
            })
            .then(
                blockStart && web3.eth.getBlockNumber()
                    .then(res => {
                        blockEnd = res
                        let confirmations = (blockEnd - blockStart)
                        console.log("CURRENT BLOCK: ", res)
                        console.log("No. CONFs: ", confirmations, (confirmations > 0))

                        if (confirmations > 0) {
                            // this.props._hashConfirmations({ hashConfirmations: confirmations })
                            clearInterval(timer)
                            cb(event)
                        }
                    })
            )
    }, 5000)

}


module.exports = {
    subscribeEvents: subscribeEvents
}