const Web3 = require('web3');
// const RINKEBY_NODE_URL = "wss://rinkeby.infura.io/_ws" //infura for testing websockets, can use our socket also
const RINKEBY_NODE_URL = "ws://178.62.195.242:8546"
// const RINKEBY_NODE_URL = "ws://localhost:8546"
const mongo = require('./Mongo')

const web3 = new Web3(new Web3.providers.WebsocketProvider(RINKEBY_NODE_URL));
let txHash = "" // temporary variable to hold hash
let eventToSend = ""

// console.log("WSS WEB3: ", web3)


// this.spender =  // Lease Token Contract address as spender for Approve / Allowance methods
let startCrowdFunding = "0x5729e23e1a97a1ECf24B411035e72271DEda2bCe"
let afterCrowdFunding = "0xd585A7cE681a9B802901d763db9fE53D0478332B"
contracts = {
    euroToken: {
        address: "0xA1cC96dc74bfF3904DeC7400FA387fa4633b33D2",
        abi: [{ "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x095ea7b3" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x18160ddd" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x23b872dd" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x40c10f19" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x70a08231" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516AA74F455f642C66FA1eD1e77C553da4be17" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8da5cb5b" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xa9059cbb" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xdd62ed3e" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xf2fde38b" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event", "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event", "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925" }]
    },
    CrowdFundData: {
        address: "0xB304892e1B89D3325D9F00d15B5Beb912D6926eD",
        abi: [{ "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }], "name": "getBytes", "outputs": [{ "name": "", "type": "bytes", "value": null }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x0de25888" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "address" }], "name": "setAddr", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x29cec871" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x35b28153" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }], "name": "getAddr", "outputs": [{ "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x4b61a2cd" }, { "constant": false, "inputs": [], "name": "getObjectID", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x4cee261b" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "string" }], "name": "setString", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x6fdcd4a1" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "bytes" }], "name": "setBytes", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x7604ff7f" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_owner", "type": "address" }], "name": "getExtraInt", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x794e093c" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "bool" }], "name": "setBool", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x8519e0e5" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516AA74F455f642C66FA1eD1e77C553da4be17" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8da5cb5b" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x94f3f81d" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }], "name": "getString", "outputs": [{ "name": "", "type": "string", "value": "" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x95baf1cb" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }], "name": "getInt", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xa2578a06" }, { "constant": true, "inputs": [{ "name": "_cid", "type": "uint256" }], "name": "viewCurrencyType", "outputs": [{ "name": "", "type": "address", "value": "0xA1cC96dc74bfF3904DeC7400FA387fa4633b33D2" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xa66c1c41" }, { "constant": false, "inputs": [{ "name": "_cid", "type": "uint256" }, { "name": "_newCurrency", "type": "address" }], "name": "addCurrencyType", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xa67edbf4" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "uint256" }], "name": "setInt", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xb5957406" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xcbe12969" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_owner", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "setExtraInt", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xd0aaa306" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }], "name": "getBool", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xd89b8223" }, { "constant": true, "inputs": [], "name": "objectID_", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xdf1cbe21" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xf2fde38b" }, { "inputs": [{ "name": "_firstCurrency", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;first Currency", "template": "elements_input_address", "value": "0xA1cC96dc74bfF3904DeC7400FA387fa4633b33D2" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor", "signature": "constructor" }]
    },
    StartCrowdFunding: {
        address: startCrowdFunding,
        abi: [{ "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "investInObject", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x01890dc0" }, { "constant": false, "inputs": [{ "name": "_objectHash", "type": "bytes" }, { "name": "_currencyId", "type": "uint256" }, { "name": "_objectPrice", "type": "uint256" }, { "name": "_fundReceiver", "type": "address" }, { "name": "_serviceProvider", "type": "address" }, { "name": "_monthlyCapitalCost", "type": "uint256" }, { "name": "_monthlyOperatingCost", "type": "uint256" }, { "name": "_biddingTimeInDays", "type": "uint256" }], "name": "createObject", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x202f60d0" }, { "constant": true, "inputs": [], "name": "d", "outputs": [{ "name": "", "type": "address", "value": "0xB304892e1B89D3325D9F00d15B5Beb912D6926eD" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8a054ac2" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_deliveryDate", "type": "uint256" }], "name": "buyAndActivate", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xb1093f86" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "claimClosedCrowdsales", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xe05d4043" }, { "constant": true, "inputs": [], "name": "crowtok", "outputs": [{ "name": "", "type": "address", "value": "0xE1F7b46Cc7a228970d4024Ea8b4b6E3CEc848c97" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xf312c30e" }, { "inputs": [{ "name": "_addressOfCrowdfundData", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Crowdfund Data", "template": "elements_input_address", "value": "" }, { "name": "_addressOfCrowdfundToken", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Crowdfund Token", "template": "elements_input_address", "value": "" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor", "signature": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "AddNewObject", "type": "event", "signature": "0x56df994743bcee05ccae75be0a36b49f3d3f7aea8c3d0276197502ac51245904" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "InvestInObject", "type": "event", "signature": "0x5969224086838df23a04523b74c1042d424963b1b107339d918a6305921dbdf7" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "BoughtNewObject", "type": "event", "signature": "0xf485e704300928ba20c1f94d8a71fb6c9ae248db8de4d9398ea45b0e06dd3c9d" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "ClaimedCrowdsale", "type": "event", "signature": "0xdca00851e4f9c8856192c5cedc752e2a407ab086f64b901bed8b921169b640a7" }]
    },
    AfterCrowdFunding: {
        address: afterCrowdFunding,
        abi: [{ "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_owner", "type": "address" }], "name": "viewCapitalClaimPerObject", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x0cda7d0b" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transferCrowdfundToken", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x36302dc6" }, { "constant": false, "inputs": [{ "name": "_currencyId", "type": "uint256" }, { "name": "_idArray", "type": "uint256[]" }], "name": "claimMultipleOperation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x58d6683c" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_remainingValue", "type": "uint256" }], "name": "sellObject", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x6848f86b" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "payCapitalAndOperation", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x6afc0841" }, { "constant": true, "inputs": [], "name": "d", "outputs": [{ "name": "", "type": "address", "value": "0xB304892e1B89D3325D9F00d15B5Beb912D6926eD" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8a054ac2" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516AA74F455f642C66FA1eD1e77C553da4be17" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8da5cb5b" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "viewOperationClaimPerObject", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x97327b26" }, { "constant": false, "inputs": [{ "name": "_currencyId", "type": "uint256" }, { "name": "_idArray", "type": "uint256[]" }], "name": "claimMultipleCapital", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xcd17451b" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_capital", "type": "uint256" }, { "name": "_operation", "type": "uint256" }], "name": "payCapitalAndOperationFlex", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xe9cd1607" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xf2fde38b" }, { "constant": true, "inputs": [], "name": "crowtok", "outputs": [{ "name": "", "type": "address", "value": "0xE1F7b46Cc7a228970d4024Ea8b4b6E3CEc848c97" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xf312c30e" }, { "inputs": [{ "name": "_addressOfCrowdfundData", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Crowdfund Data", "template": "elements_input_address", "value": "0xB304892e1B89D3325D9F00d15B5Beb912D6926eD" }, { "name": "_addressOfCrowdfundToken", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Crowdfund Token", "template": "elements_input_address", "value": "0xE1F7b46Cc7a228970d4024Ea8b4b6E3CEc848c97" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor", "signature": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }, { "indexed": false, "name": "capital", "type": "uint256" }, { "indexed": false, "name": "operation", "type": "uint256" }], "name": "PayCapitalAndOperation", "type": "event", "signature": "0x51598632177e8c55da723d1e2eef974947d48f72152c1d5a8b96565b93d64c92" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }, { "indexed": false, "name": "capital", "type": "uint256" }], "name": "SellObject", "type": "event", "signature": "0x8370fb8120d81e7d3e6b08142226e8765ec173f8eb4c09d3867fcf3d1f0913e5" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "claimed", "type": "bool" }], "name": "Claim", "type": "event", "signature": "0xe60b3625a76448ea27f8bda2221b3b6a1794d1a837045675386bcdd6e3a875a3" }]
    },
    CrowdFundToken: {
        address: "0xE1F7b46Cc7a228970d4024Ea8b4b6E3CEc848c97",
        abi: [{ "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_objectId", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x156e29f6" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x35b28153" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8da5cb5b" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x94f3f81d" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xcbe12969" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_objectId", "type": "uint256" }], "name": "objectBalanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xd614398d" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xf2fde38b" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_objectId", "type": "uint256" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xfe99049a" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "objectId", "type": "uint256" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event", "signature": "0x9ed053bb818ff08b8353cd46f78db1f0799f31c9e4458fdb425c10eccd2efc44" }]
    }
}
//const euroToken = new web3.eth.Contract(contracts.euroToken.abi).at(contracts.euroToken.address) // old web3 connection
// const CrowdFundContract = contract(contracts.StartCrowdFunding.abi).at(contracts.StartCrowdFunding.address) // old web3 connection

const euroToken = new web3.eth.Contract(contracts.euroToken.abi, contracts.euroToken.address)
const CrowdFundContract = new web3.eth.Contract(contracts.StartCrowdFunding.abi, contracts.StartCrowdFunding.address)
const CrowdFundTokenContract = new web3.eth.Contract(contracts.CrowdFundToken.abi, contracts.CrowdFundToken.address);


// console.log("Euro Token: ", euroToken);
// console.log("Lease Token Contract: ", CrowdFundContract);

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



// test = () => CrowdFundContract.methods.investInObject(8, 10).send()
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

// createNewCrowdFundToken = (account) => {
//     console.log("Creating NewCrowdFundToken");
//     var leasetoken = CrowdFundTokenContract.deploy({
//         data: '0x608060405234801561001057600080fd5b50604051604080610baf8339810180604052810190808051906020019092919080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505050610a338061017c6000396000f300608060405260043610610099576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806318160ddd1461009e57806323b872dd146100c957806335b281531461014e57806340c10f191461019157806370a08231146101f65780638da5cb5b1461024d57806394f3f81d146102a4578063cbe12969146102e7578063f2fde38b14610342575b600080fd5b3480156100aa57600080fd5b506100b3610385565b6040518082815260200191505060405180910390f35b3480156100d557600080fd5b50610134600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061038f565b604051808215151515815260200191505060405180910390f35b34801561015a57600080fd5b5061018f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506105b4565b005b34801561019d57600080fd5b506101dc600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061066d565b604051808215151515815260200191505060405180910390f35b34801561020257600080fd5b50610237600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506107ee565b6040518082815260200191505060405180910390f35b34801561025957600080fd5b50610262610837565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102b057600080fd5b506102e5600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061085c565b005b3480156102f357600080fd5b50610328600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610912565b604051808215151515815260200191505060405180910390f35b34801561034e57600080fd5b50610383600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610932565b005b6000600254905090565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141515156103cc57600080fd5b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561041a57600080fd5b61046c82600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546109d090919063ffffffff16565b600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061050182600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546109e990919063ffffffff16565b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b60011515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514151561061357600080fd5b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b600060011515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415156106ce57600080fd5b6106e3826002546109e990919063ffffffff16565b60028190555061073b82600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546109e990919063ffffffff16565b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156108b757600080fd5b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b60016020528060005260406000206000915054906101000a900460ff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561098d57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008282111515156109de57fe5b818303905092915050565b60008082840190508381101515156109fd57fe5b80915050929150505600a165627a7a72305820de81c2e68a251fb9e2c6f0ea8108b9abc089ba1a23abf8bfdf7ae202fcff5f6e0029'
//     }).send({
//         from: account,
//         gas: '4700000'
//     }).on('receipt', function (receipt) {
//         console.log(receipt.contractAddress) // contains the new contract address
//     }).on('confirmation', function (confirmationNumber, receipt) { console.log("CF number: ", confirmationNumber, "RECEIPT: ", receipt); })
//         .then(function (newContractInstance) {
//             console.log(newContractInstance.options.address) // instance with the new contract address
//         });


//     // .on('error', function(error){})
//     // .on('transactionHash', function(transactionHash){})

// }

subscribeEvents = (io) => {
    console.log("!!! Subscribing to all events !!!");
    euroToken.events.allEvents("latest", (error, event) => error ? console.error("euroToken EVENT ERROR: ", error) : handleEvent(io, event))
    CrowdFundContract.events.allEvents("latest", (error, event) => error ? console.error("CrowdFundContract EVENT ERROR: ", error) : handleEvent(io, event))

    // setTimeout(() => {
    //     getConfirmationsHash("0xbc624a81a059d0a412961e8867d1e8bec1e0d50a0edf15073ecd3cd9123a81b4", res => console.log(res))
    // }, 2000);
}

handleEvent = (io, event) => {
    console.log("CrowdFundContract EVENT: ", event)
    // console.log(event.event);
    // switch (event.event) {
    //     case value:

    //         break;

    //     default:
    //         break;
    // }

    if (event.event === "AddNewObject") {
        // objectTxHash
        let objectID = event.returnValues.objectID
        let txHash = event.transactionHash
        if (objectID && txHash) {
            console.log("OBJECT ID, TXHASH: ", objectID, txHash);
            mongo.db["crowdfundobj2"].findAndModify(
                {
                    query: { "objectTxHash": txHash },
                    update: { $set: { objectID: objectID } },
                    new: true
                },
                (err, result) => {
                    console.log("OBJECT ID INSERTED RESULT: ", result, err);
                });
        }
    }
    getConfirmationsHash(event, resEvent => io.sockets.emit('event', resEvent))
}

getConfirmationsHash = (event, cb) => {
    let hash = event["transactionHash"]
    console.log("HASH: ", hash);
    // if (txHash !== hash) {
    //     txHash = hash
    //     eventToSend = event
    // if (event.event !== "Transfer") {
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
    // }

    // } else {
    //     if (eventToSend && (eventToSend.event === "Transfer") && (eventToSend.event !== event.event))
    //         eventToSend = event
    //     console.log("DUPLICATE HASH: ", hash);
    // }

}


module.exports = {
    subscribeEvents: subscribeEvents,
    getConfirmationsHash: getConfirmationsHash
    // createNewCrowdFundToken: createNewCrowdFundToken
}