const Web3 = require('web3');
// const RINKEBY_NODE_URL = "wss://rinkeby.infura.io/_ws" //infura for testing websockets, can use our socket also
const RINKEBY_NODE_URL = "ws://178.62.195.242:8546"
// const RINKEBY_NODE_URL = "ws://localhost:8546"
const mongo = require('./Mongo')

const web3 = new Web3(new Web3.providers.WebsocketProvider(RINKEBY_NODE_URL));
let txHash = "" // temporary variable to hold hash
let eventToSend = ""

// console.log("WSS WEB3: ", web3)


const spender = "0x8C0F39899b372090E41B3b2dec3b79821D8F000C" // Lease Token Contract address as spender for Approve / Allowance methods
const contracts = {
    euroToken: {
        address: "0xa90448636411D1fdb7ac9bb5337B28E717aaf27E",
        abi: [ { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newUser", "type": "address" } ], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" } ], "name": "mint", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_value", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "existingUser", "type": "address" } ], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approveByCrowdfundcontract", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "authorization", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Burn", "type": "event" } ]
    },
    CrowdFundData: {
        address: "0x6b1e7436916b374cabAC9CF32388f2D6dc8BC807",
        abhi: [ { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" } ], "name": "getBytes", "outputs": [ { "name": "", "type": "bytes", "value": "0x" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "address" } ], "name": "setAddr", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_TokenFactoryAddress", "type": "address" } ], "name": "setTokenFactory", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" } ], "name": "getAddr", "outputs": [ { "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "getObjectID", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_cid", "type": "uint256" }, { "name": "_existingCurrency", "type": "address" } ], "name": "removeCurrencyType", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "string" } ], "name": "setString", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "bytes" } ], "name": "setBytes", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_owner", "type": "address" } ], "name": "getExtraInt", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "bool" } ], "name": "setBool", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTokenFactory", "outputs": [ { "name": "", "type": "address", "value": "0xe8d66f160a8c9d604ac9b2291a6980720cbf9b19" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" } ], "name": "getString", "outputs": [ { "name": "", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" } ], "name": "getInt", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_cid", "type": "uint256" } ], "name": "viewCurrencyType", "outputs": [ { "name": "", "type": "address", "value": "0xa90448636411d1fdb7ac9bb5337b28e717aaf27e" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_cid", "type": "uint256" }, { "name": "_newCurrency", "type": "address" } ], "name": "addCurrencyType", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "uint256" } ], "name": "setInt", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_existingUser", "type": "address" } ], "name": "removeUserAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_owner", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "setExtraInt", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" } ], "name": "getBool", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_user", "type": "address" } ], "name": "viewUserAuthorization", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "objectID_", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_newUser", "type": "address" } ], "name": "addUserAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "_tokenFactory", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;token Factory", "template": "elements_input_address", "value": "0xE8d66F160a8c9d604AC9b2291A6980720CbF9b19" }, { "name": "_firstCurrency", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;first Currency", "template": "elements_input_address", "value": "0xa90448636411D1fdb7ac9bb5337B28E717aaf27E" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]
    },
    CrowdFundContract: {
        address: spender,
        abi: [ { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" } ], "name": "investInObject", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_objectPrice", "type": "uint256" }, { "name": "_objectHash", "type": "bytes" }, { "name": "_fundReceiver", "type": "address" }, { "name": "_currencyId", "type": "uint256" }, { "name": "_fundTokenName", "type": "string" }, { "name": "_monthlyCapitalCost", "type": "uint256" }, { "name": "_monthlyOperatingCost", "type": "uint256" } ], "name": "createObject", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferCrowdfundToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "payCapitalAndOperation", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "d", "outputs": [ { "name": "", "type": "address", "value": "0x6b1e7436916b374cabac9cf32388f2d6dc8bc807" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "toClaimTotal", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_owner", "type": "address" } ], "name": "toClaimPerObject", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" }, { "name": "_deliveryDate", "type": "uint256" } ], "name": "buyAndActivate", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_currencyId", "type": "uint256" }, { "name": "_idArray", "type": "uint256[]" } ], "name": "claimMultipleCapital", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_newUser", "type": "address" }, { "name": "_currencyId", "type": "uint256" } ], "name": "addUser", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "_addressOfCrowdfundData", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Crowdfund Data", "template": "elements_input_address", "value": "0x6b1e7436916b374cabAC9CF32388f2D6dc8BC807" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "claimed", "type": "bool" } ], "name": "Claim", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "newUser", "type": "address" } ], "name": "CreateNewUser", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "objectID", "type": "uint256" } ], "name": "AddNewObject", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "objectID", "type": "uint256" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "InvestInObject", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "objectID", "type": "uint256" } ], "name": "BoughtNewObject", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "objectID", "type": "uint256" }, { "indexed": false, "name": "capital", "type": "uint256" }, { "indexed": false, "name": "operation", "type": "uint256" } ], "name": "PayCapitalAndOperation", "type": "event" } ]
    },
    CrowdFundToken: {
        abi: [ { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_to", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;to", "template": "elements_input_address", "value": "0x5de17631Cf829d754aBA3e78F6379aa1299aB2CE" }, { "name": "_amount", "type": "uint256", "index": 1, "typeShort": "uint", "bits": "256", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;amount", "template": "elements_input_uint", "value": "444" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]
    }
}

//const euroToken = new web3.eth.Contract(contracts.euroToken.abi).at(contracts.euroToken.address) // old web3 connection
// const CrowdFundContract = contract(contracts.CrowdFundContract.abi).at(contracts.CrowdFundContract.address) // old web3 connection

const euroToken = new web3.eth.Contract(contracts.euroToken.abi, contracts.euroToken.address)
const CrowdFundContract = new web3.eth.Contract(contracts.CrowdFundContract.abi, contracts.CrowdFundContract.address)
const CrowdFundTokenContract = new web3.eth.Contract(contracts.CrowdFundToken.abi);


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
            mongo.db["crowdfundobj"].findAndModify(
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
    if (txHash !== hash) {
        txHash = hash
        eventToSend = event
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

    } else {
        if (eventToSend && (eventToSend.event === "Transfer") && (eventToSend.event !== event.event))
            eventToSend = event
        console.log("DUPLICATE HASH: ", hash);
    }

}


module.exports = {
    subscribeEvents: subscribeEvents,
    // createNewCrowdFundToken: createNewCrowdFundToken
}