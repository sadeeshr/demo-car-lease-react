/**
|--------------------------------------------------
| Lease Smart Contract Handler
| Author: Sadeesh Radhakrishnan
|--------------------------------------------------
*/
// import Eth from 'ethjs';
import EthJs from 'ethjs-query';
import EthJsContract from 'ethjs-contract';
import unit from 'ethjs-unit';
import cc from './utils';

// import EthFilter from 'ethjs-filter';
// old euro: 0xa7aa26880AE3F2201779953f2d92e5ebA78C86Dd

class Contract {
    constructor() {
        this.spender = "0xA5609cfbb89129BA1e0a4D91f5CFFAd63fA00053" // Lease Token Contract address as spender for Approve / Allowance methods
        this.contracts = {
            euroToken: {
                address: "0x7612d4Ad91829b166424c01ce616CEd9146ee69A",
                abi: [{ "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approveByLeasecontract", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }]
            },
            LeaseData: {
                address: "0xD8Bce5151Aa7ee3630b93B9A75825eb8E3Af83f6",
                abi: [{ "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getDealer", "outputs": [{ "name": "", "type": "address", "value": "0x" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_dealer", "type": "address" }], "name": "setDealer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getDriver", "outputs": [{ "name": "", "type": "address", "value": "0x" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "setDeactiveTime", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getRaised", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_deliveryDate", "type": "uint256" }], "name": "setActiveTime", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leasecbjectcycle", "outputs": [{ "name": "crowdsaleClosed", "type": "bool", "value": false }, { "name": "objectActive", "type": "bool", "value": false }, { "name": "objectActiveTime", "type": "uint256", "value": "0" }, { "name": "objectDeactiveTime", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leaseobject", "outputs": [{ "name": "leaseTokenAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectDealerAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectDriverAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectPrice", "type": "uint256", "value": "0" }, { "name": "monthlyCapitalCost", "type": "uint256", "value": "0" }, { "name": "monthlyOperatingCost", "type": "uint256", "value": "0" }, { "name": "objectContractHash", "type": "bytes", "value": "0x" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getCrowdsaleClosed", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_owner", "type": "address" }], "name": "getLastCapitalPayout", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_leasetoken", "type": "address" }], "name": "setLeaseToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_hash", "type": "bytes" }], "name": "setHash", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getHash", "outputs": [{ "name": "", "type": "bytes" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_driver", "type": "address" }], "name": "setDriver", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_operation", "type": "uint256" }], "name": "setOperationPaid", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getOperatingCost", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_owner", "type": "address" }, { "name": "_lastCapitalPayout", "type": "uint256" }], "name": "setLastCapitalPayout", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_capital", "type": "uint256" }], "name": "setCapitalPaid", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_crowdsale", "type": "bool" }], "name": "setCrowdsaleClosed", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getLeaseToken", "outputs": [{ "name": "", "type": "address", "value": "0x" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getCapitalCost", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_capitalCost", "type": "uint256" }], "name": "setCapitalCost", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leaseobjecttransactions", "outputs": [{ "name": "totalRaised", "type": "uint256", "value": "0" }, { "name": "totalCapitalPaid", "type": "uint256", "value": "0" }, { "name": "totalOperationPaid", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getActiveTime", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getActive", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getDeactiveTime", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getOperationPaid", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getCapitalPaid", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_active", "type": "bool" }], "name": "setActive", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getPrice", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_monthlyOperatingCost", "type": "uint256" }], "name": "setOperatingCost", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_raised", "type": "uint256" }], "name": "setRaised", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_price", "type": "uint256" }], "name": "setPrice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
            },
            LeaseTokenContract: {
                address: this.spender,
                abi: [{ "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "investInObject", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "claimInvestment", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_objectPrice", "type": "uint256" }, { "name": "_objectHash", "type": "bytes" }, { "name": "_objectDealerAddr", "type": "address" }, { "name": "_addressOfLeaseToken", "type": "address" }, { "name": "_monthlyCapitalCost", "type": "uint256" }, { "name": "_monthlyOperatingCost", "type": "uint256" }], "name": "createObject", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newUser", "type": "address" }], "name": "addUser", "outputs": [{ "name": "", "type": "bool" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_driver", "type": "address" }], "name": "updateDriver", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_capital", "type": "uint256" }, { "name": "_operation", "type": "uint256" }], "name": "payCapitalAndOperation", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "d", "outputs": [{ "name": "", "type": "address", "value": "0xd8bce5151aa7ee3630b93b9a75825eb8e3af83f6" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "deactivate", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "sumBalanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "toggleCrowdsale", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "toClaimTotal", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_owner", "type": "address" }], "name": "toClaimPerObject", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_operatingCost", "type": "uint256" }], "name": "updateOperationCost", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_deliveryDate", "type": "uint256" }], "name": "buyAndActivate", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "Euro", "outputs": [{ "name": "", "type": "address", "value": "0x7612d4ad91829b166424c01ce616ced9146ee69a" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "updateCapitalCostInLifecycle", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferLeaseToken", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_addressOfEuroToken", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Euro Token", "template": "elements_input_address", "value": "0x7612d4Ad91829b166424c01ce616CEd9146ee69A" }, { "name": "_addressOfLeaseData", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Lease Data", "template": "elements_input_address", "value": "0xD8Bce5151Aa7ee3630b93B9A75825eb8E3Af83f6" }, { "name": "_objectIDlastVersion", "type": "uint256", "index": 2, "typeShort": "uint", "bits": "256", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;object I Dlast Version", "template": "elements_input_uint", "value": "" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newUser", "type": "address" }], "name": "CreateNewUser", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "AddNewObject", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "BoughtNewObject", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_id", "type": "uint256" }, { "indexed": false, "name": "_capital", "type": "uint256" }, { "indexed": false, "name": "_operation", "type": "uint256" }], "name": "PayCapitalAndOperation", "type": "event" }]
            },
            LeaseTokenObject: {
                abi: [{ "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_leasecontract", "type": "address" }, { "name": "_admin", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }]
            }
        }

        this.filters = {
            EeuroTransfer: null,
            EeuroApproval: null,
            EevTransfer: null,
            ElcAddNewObject: null
        }
        this.timer = null
        this.filter = null
        this.watcher = null
        this.account = null
        this.balance = null
        this.eth = null
        this.props = null
        this.addNewObjectTxID = null
        this.addNewObjectID = null
        this.addNewObject = null
        this.investInObjectTxID = null
        this.claimDividendTxID = null
        this.payFeeTxID = null
        this.LeaseTokenContract = null
        this.euroToken = null
        this.LeaseData = null
        this.LeaseTokenObjectContract = null
    }

    getAccount = () => {
        // const self = this
        let accountTimer = setInterval(() => {
            // cc.log("Checking Metamask Account");
            if (!this.account) {
                this.eth.coinbase().then(account => {
                    if (account) {
                        cc.log("ACCOUNT: ", account);
                        // this.getConfirmationsHash("0xf290b3e19ad0dc1bed93831bb04781af173f4643c55b270efb82235c55088150")
                        this.account = account;
                        this.props._setAccount({ account })
                        clearInterval(accountTimer)
                    }
                })
            } else
                clearInterval(accountTimer)
        }, 1000)

    }

    getBalance = (address) => {
        cc.log("Fetching Balance for ", address);
        this.eth.getBalance(address, "latest")
            .then(balance => {
                let ethBal = unit.fromWei(balance, 'ether')
                cc.log({ [address]: ethBal });
                this.props._setBalance({ [address]: ethBal })
            })
    }

    initContract = (props, web3) => {
        // cc.log("WEB3: ", web3);
        this.props = props
        // cc.log("ETH: ", Eth);
        //let newWeb3 = new Eth.HttpProvider('https://smartjuice.apayaa.com:8545')
        //cc.log("WEB 3 ####", newWeb3);
        //const eth = new Eth(newWeb3)
        const eth = new EthJs(web3.currentProvider)
        this.eth = eth
        // let account = eth.coinbase()
        this.getAccount()
        //this.props._setAccount({ account: "0x423B7B8Da5ec685130670A978a1A680dFa27c879" })
        // cc.log("ACC: ", account);
        // const filters = new EthFilter(eth)
        // this.filter = new filters.PendingTransactionFilter()
        // this.filter.new()

        const contract = new EthJsContract(eth)
        // const LeaseTokenContract = 
        this.euroToken = contract(this.contracts.euroToken.abi).at(this.contracts.euroToken.address)
        this.LeaseTokenContract = contract(this.contracts.LeaseTokenContract.abi).at(this.contracts.LeaseTokenContract.address)
        this.LeaseData = contract(this.contracts.LeaseData.abi).at(this.contracts.LeaseData.address)
        this.LeaseTokenObjectContract = contract(this.contracts.LeaseTokenObject.abi);


        cc.log("LeaseData: ", this.LeaseData);

        // cc.log("Euro Token: ", this.euroToken);
        //cc.log("Lease Token Contract: ", this.LeaseTokenContract);
        // this.evEventTransfer()

        return {
            // euroToken: this.euroToken,
            // evToken: this.LeaseTokenContract,
            // LeaseTokenContract: this.LeaseTokenContract
        }
    }

    getConfirmationsHash = (hash) => {
        cc.log("HASH: ", hash);
        let blockStart, blockEnd;
        let timer = setInterval(() => {
            cc.log("CHECKING HASH CONFIRMATIONS:");
            if ((blockEnd - blockStart) > 0)
                clearInterval(timer)
            this.eth.getTransactionReceipt(hash)
                .then(res => {
                    if (res && res.blockNumber) {
                        cc.log("TX RECEIPT: ", res)
                        cc.log("START BLOCK: ", res.blockNumber.toNumber())
                        blockStart = res.blockNumber.toNumber()
                    }
                })
                .then(
                    blockStart && this.eth.blockNumber()
                        .then(res => {
                            blockEnd = res
                            let confirmations = (blockEnd - blockStart)
                            cc.log("CURRENT BLOCK: ", res.toNumber())
                            cc.log("No. CONFs: ", confirmations, (confirmations > 0))
                            this.eth.getTransactionByHash(hash)
                                .then(res2 => cc.log(res2))
                            if (confirmations > 0) {
                                this.props._hashConfirmations({ hashConfirmations: confirmations })
                            }
                        })
                )
        }, 5000)

    }

    /**
     * Pending Transactions Filter, listens on all contracts, transactions, NOT RECOMMENDED
     */
    startPendingTranscationWatcher = () => {
        this.watcher = this.filter.watch((err, result) => {
            cc.log("Pending Transaction Result: ", err, result);
            // if (err || result.length > 0) setTimeout(this.stopPendingTranscationWatcher, 1000);
        })
    }

    stopPendingTranscationWatcher = () => {
        this.watcher.stopWatching((err, result) => {
            cc.log("Stopped Pending Transcation Watching: ", err, result);
        })
    }


    /**
     * Euro Token Events
     */

    euroEventTransferSubscribe = () => {
        this.filters.EeuroTransfer = this.euroToken.Transfer()
        this.filters.EeuroTransfer.new()
        this.filters.EeuroTransfer.watch((err, result) => {
            cc.log("EuroToken Event Transfer() Result: ", err, result);
            if (err || result.length > 0) {
                let resultObj = { eventTransfer: true }

                if (this.payFeeTxID)
                    resultObj = { eventSubscription: true }

                this.props._setEventStatus(resultObj); setTimeout(() => { this.payFeeTxID = null; this.investInObjectTxID = null; this.euroEventTransferUnsubscribe(); this.props._reloadTokens() }, 1000);
            }
        })
    }

    euroEventTransferUnsubscribe = () => {
        this.filters.EeuroTransfer.uninstall((err, result) => {
            cc.log("EuroToken Event Transfer() Unsubscribe: ", err, result);
            this.investInObjectTxID = null
        })
    }

    euroEventApprovalSubscribe = () => {
        this.filters.EeuroApproval = this.euroToken.Approval()
        this.filters.EeuroApproval.new()
        this.filters.EeuroApproval.watch((err, result) => {
            cc.log("EuroToken Event Approval() Result: ", err, result);
            if (err || result.length > 0) { this.props._setEventStatus({ eventApprove: true }); setTimeout(() => { this.euroEventApprovalUnsubscribe(); }, 1000) };

            // if (err || result.length > 0) {
            //     if (!err)
            //         result.map(res => {
            //             if (res.transactionHash === this.approveTxID)
            //                 this.props._setEventStatus({ eventApprove: true }); setTimeout(() => { this.euroEventApprovalUnsubscribe(); }, 1000)
            //         })
            //     else
            //         err.map(res => {
            //             if (res.transactionHash === this.approveTxID)
            //                 this.props._setEventStatus({ eventApprove: true }); setTimeout(() => { this.euroEventApprovalUnsubscribe(); }, 1000)
            //         })
            // };
        })
    }

    euroEventApprovalUnsubscribe = () => {
        this.filters.EeuroApproval.uninstall((err, result) => {
            cc.log("EuroToken Event Approval() Unsubscribe: ", err, result);
            this.approveTxID = null
        })
    }

    /**
     * Euro Token Methods
     */
    euroBalanceOf = (account) => {
        cc.log(`Fetching EURO Tokens Balance for: ${account}`);
        return this.euroToken.balanceOf(account)
            .then(result => {
                cc.log(`EURO TOKENS BALANCE: ${result[0].toString() / 1000000}`);
                return { euroTokenBalance: (result[0].toString() / 1000000) }
            })
    }

    euroApprove = (value, account) => {

        cc.log(`Approve value: ${value * 1000000} to spend by: ${this.spender} from: ${account}`);
        return this.euroToken.approve(this.spender, (value * 1000000), { from: account })
            .then(result => {
                cc.log(`Approval Result: ${result}`);
                this.euroEventApprovalSubscribe()
                this.approveTxID = result
                return { approveTxID: result }
            })
    }

    euroAllowance = (account) => {
        cc.log(`Fetching Allowance for: ${account}`);
        return this.euroToken.allowance(account, this.spender)
            .then(result => {
                cc.log(`Allowance Result: ${result[0].toString() / 1000000}`);
                return { allowance: (result[0].toString() / 1000000) }
            })
    }

    /**
     * Lease Token Contract Methods
     */

    /**
     * Lease Token Methods
     */
    evEventTransferSubscribe = () => {
        this.filters.EevTransfer = this.LeaseTokenContract.Transfer()
        this.filters.EevTransfer.new()
        this.filters.EevTransfer.watch((err, result) => {
            cc.log("EVToken Event Transfer() Result: ", err, result);
            if (err || result.length > 0) { this.props._setEventStatus({ eventTransfer: true }); setTimeout(() => { this.evEventTransferUnsubscribe(); this.props._reloadTokens() }, 1000); }

        })
    }

    evEventTransferUnsubscribe = () => {
        this.filters.EevTransfer.uninstall((err, result) => {
            cc.log("EVToken Event Transfer() Unsubscribe: ", err, result);
        })
    }

    /**
     * Lease Token Methods
     */
    evMyTokens = (account, objectID) => {
        cc.log(`Fetching EV Tokens for: ${account}, objectID: ${objectID}`);
        return this.LeaseTokenContract.objectBalanceOf(account, objectID)
            .then(result => {
                cc.log(`EV TOKENS: ${result[0].toString()}`);
                // this.setState({ ["evToken_" + objectID]: result[0].toString() })
                return { id: objectID, result: result[0].toString() }
            })
    }

    // evBalanceOf = (account) => {
    //     cc.log(`Fetching EV Tokens Balance for: ${account}`);
    //     return this.LeaseTokenContract.balanceOf(account)
    //         .then(result => {
    //             cc.log(`EV TOKENS BALANCE: ${result[0].toString()}`);
    //             return { evTokenBalance: result[0].toString() }
    //         })
    // }

    /**
     * Lease Contract Events
     */

    lcEventAddNewObjectSubscribe = () => {
        this.filters.ElcAddNewObject = this.LeaseTokenContract.AddNewObject()
        this.filters.ElcAddNewObject.new()
        this.filters.ElcAddNewObject.watch((err, result) => {
            cc.log("LeaseTokenContract Event AddNewObject() Result: ", err, result);
            if (err || result.length > 0) {
                if (!err)
                    result.map(res => {
                        if (res.transactionHash === this.addNewObjectTxID) {
                            let objectID = result[0].data.objectID.toNumber()
                            let newObjData = this.addNewObject
                            newObjData["objectID"] = objectID
                            let data = {
                                module: "membersdev2",
                                result: "usernames",
                                query: { "_id": this.addNewObjectID },
                                data: this.addNewObject
                            }
                            cc.log(data)
                            this.props._updateContractData(this.props, data)
                            this.props._setEventStatus({ eventAddNewObject: true, objectID: objectID }); setTimeout(() => { this.lcEventAddNewObjectUnsubscribe(); this.props._reloadTokens() }, 1000);
                        }
                        return res
                    })
                else
                    cc.log(err)
            }
        })
    }

    lcEventAddNewObjectUnsubscribe = () => {
        this.filters.ElcAddNewObject.uninstall((err, result) => {
            cc.log("LeaseTokenContract Event AddNewObject() Unsubscribe: ", err, result);
            this.addNewObjectTxID = null
            this.addNewObjectID = null
            this.addNewObject = null
        })
    }

    lcEventClaimSubscribe = () => {
        this.filters.lcClaim = this.LeaseTokenContract.Claim()
        this.filters.lcClaim.new()
        this.filters.lcClaim.watch((err, result) => {
            cc.log("LeaseTokenContract Event Claim() Result: ", err, result);
            if (err || result.length > 0) { this.props._setEventStatus({ eventClaim: true }); setTimeout(this.lcEventClaimUnsubscribe, 1000); }

            // if (err || result.length > 0) {
            //     if (!err)
            //         result.map(res => {
            //             if (res.transactionHash === this.claimDividendTxID)
            //                 this.props._setEventStatus({ eventClaim: true }); setTimeout(this.lcEventClaimUnsubscribe, 1000);
            //         })
            //     else
            //         err.map(res => {
            //             if (res.transactionHash === this.claimDividendTxID)
            //                 this.props._setEventStatus({ eventClaim: true }); setTimeout(this.lcEventClaimUnsubscribe, 1000);
            //         })
            // }
        })
    }

    lcEventClaimUnsubscribe = () => {
        this.filters.lcClaim.uninstall((err, result) => {
            cc.log("LeaseTokenContract Event Claim() Unsubscribe: ", err, result);
            this.claimDividendTxID = null
        })
    }

    /**
     * Lease Contract Methods
     */

    lcCreateObject = (props, id, months, municipalityID, objectPrice, objectHash, objectLTAddress, objectDealer, objectMCCost, objectMOCost, account) => {
        cc.log(`Adding New object for: ${objectPrice}, ${objectHash}, ${objectLTAddress}, ${objectDealer}, ${objectMCCost}, ${objectMOCost}, ${account}`);
        if (props) this.props = props
        return this.LeaseTokenContract.createObject(objectPrice, objectHash, objectDealer, objectLTAddress, objectMCCost, objectMOCost, { from: account })
            .then(result => {
                cc.log(`ADD NEW object RESULT: ${result}`);
                // this.lcEventAddNewObjectSubscribe() // development
                // this.addNewObjectTxID = result
                // this.addNewObjectID = objectid
                // this.addNewObject = {
                //     objectPic: objectImage,
                //     objectPrice: objectPrice,
                //     objectHash: objectHash,
                //     objectDealer: objectDealer,
                //     carFee: objectMCCost,
                //     carTerm: objectMOCost,
                //     car: ,
                //     account: account
                // }
                // return { addNewObjectTxID: result, addNewObjectHash: objectHash, progress: false }
                return {
                    newObject: {
                        txID: result,
                        id: id
                        // data: {
                        // id: id,
                        // municipalityID: municipalityID,
                        // objectPic: objectImage,
                        // months: months,
                        // objectPrice: objectPrice,
                        // objectHash: objectHash,
                        // objectDealer: objectDealer,
                        // objectMonthlyCapitalCost: objectMCCost,
                        // objectMonthlyOperatingCost: objectMOCost,
                        // account: account
                        // }
                    },
                    progress: false
                }
            })
    }

    lcSumBalanceOf = (account) => {
        cc.log(`Fetching Sum Balance Of: `);
        return this.LeaseTokenContract.sumBalanceOf(account)
            .then(result => {
                cc.log(`sumBalanceOf RESULT: ${result[0].toNumber()}`);
                return { sumBalanceOf: result[0].toNumber(), progress: false }
            })
    }

    lcTotalSupply = () => {
        cc.log(`Fetching Total Amount Raised.`);
        return this.LeaseTokenContract.totalSupply()
            .then(result => {
                cc.log(`Total Supply RESULT: ${result[0].toNumber()}`);
                return { totalSupply: result[0].toNumber(), progress: false }
            })
    }

    lcAuthorization = (account) => {
        cc.log(`Checking Authorization for: ${account}`);
        return this.LeaseTokenContract.authorization(account)
            .then(result => {
                cc.log(`Authorization RESULT: ${result[0]}`);
                return { account: account, result: result[0] }
            })
    }

    lcAddUser = (user, account) => {
        cc.log(`Add New User: ${user} Auth: ${account}`);
        return this.LeaseTokenContract.addUser(user, { from: account })
            .then(result => {
                cc.log(`Add New User RESULT: ${result}`);
                return {
                    AddNewUser: {
                        txID: result,
                        account: user
                    }
                }
            })
    }

    lcBuyAndActivate = (objectID, activeDate, account) => {
        let timeStamp = Math.floor(activeDate.getTime() / 1000)
        cc.log(`Buy And Activate Object: ${objectID}, ${timeStamp}`);
        return this.LeaseTokenContract.buyAndActivate(objectID, timeStamp, { from: account })
            .then(result => {
                cc.log(`Buy And Activate RESULT: ${result}`);
                return {
                    // BuyAndActivate: {
                    //     txID: result,
                    //     account: account,
                    //     objectID: objectID
                    // }
                    BuyAndActivateTxID: result
                }
            })
    }

    lcPayCapitalAndOperation = (props, objectID, capital, operation, account) => {
        if (props) this.props = props
        cc.log(`Pay Capital And Operation: ${objectID}, ${capital}, ${operation}`);
        return this.LeaseTokenContract.payCapitalAndOperation(objectID, capital, operation, { from: account })
            .then(result => {
                cc.log(`Pay Capital And Operation: ${result}`);
                return {
                    payFeeTxID: result, progress: false
                }
            })
    }

    lcLeaseObject = (objectID) => {
        cc.log(`Fetch object Details for ID: ${objectID}`);
        return this.LeaseData.leaseobject(objectID)
            .then(result => {
                cc.log(`Details of object ID ${objectID} => `, result);
                return { id: objectID, result: result }
            })
    }

    lcLeaseObjectCycle = (objectID) => {
        cc.log(`Fetch object Cycle Details for ID: ${objectID}`);
        return this.LeaseData.leasecbjectcycle(objectID)
            .then(result => {
                cc.log(`Details of object cycle ID ${objectID} => `, result);
                return {
                    id: objectID,
                    result: {
                        crowdsaleClosed: result["crowdsaleClosed"],
                        active: result["objectActive"],
                        activeTime: result["objectActiveTime"].toNumber(),
                        deactiveTime: result["objectDeactiveTime"].toNumber()
                    }
                }
            })
    }

    lcLeaseObjectRedemption = (objectID) => {
        cc.log(`Fetch object Redemption Details for ID: ${objectID}`);
        return this.LeaseTokenContract.leaseobjectredemption(objectID)
            .then(result => {
                cc.log(`Details of object redemption ID ${objectID} => `, result);
                return {
                    id: objectID,
                    result: {
                        totalRaised: result["totalRaised"].toNumber(),
                        totalDividends: result["totalDividends"].toNumber(),
                        paymonth: result["paymonth"].toNumber(),
                        mileagesTotal: result["mileagesTotal"].toNumber(),
                        mileagesAverage: result["mileagesAverage"].toNumber(),
                        autoPay: result["autoPay"]
                    }
                }
            })
    }

    lcAmountObjects = () => {
        cc.log(`Fetch Crowd Sale Closed Objects Count:`);
        return this.LeaseTokenContract.amountObjects()
            .then(result => {
                cc.log(`Crowd Sale Closed Objects Count => `, result, result[0].toNumber());
                return { crowdsaleClosed: result[0].toNumber() }
            })
    }

    lcInvestInObject = (objectID, amount, account) => {
        cc.log(`Calling Invest In Object For object ID: ${objectID}, ${amount}, ${account}`);
        return this.LeaseTokenContract.investInObject(objectID, amount || "0", { from: account })
            .then(result => {
                cc.log(`Invest In Object RESULT: ${result}`);
                // this.lcEventAddNewObjectSubscribe()    // contract missing event call, not calling this 
                // this.startPendingTranscationWatcher()
                // this.euroEventTransferSubscribe() // development
                this.investInObjectTxID = result
                return { investInObjectTxID: result, progress: false }
            })
    }

    lcPayFee = (objectID, account) => {
        // account = "0xA30b6a96D652E99AA25162B2b9165f2c3f683ACc"
        cc.log(`Calling Pay Fee: ${objectID}, ${account}`);
        return this.LeaseTokenContract.payFee(objectID, { from: account })
            .then(result => {
                cc.log(`payFee RESULT: ${result}`);
                // this.euroEventTransferSubscribe() //development
                this.payFeeTxID = result
                return { payFeeTxID: result, progress: false }
            })
    }


    lcActivateDeactivateObject = (objectID, account) => {
        cc.log(`Calling Activate Deactivate Object: ${objectID}, ${account}`);
        return this.LeaseTokenContract.activateDeactivateObject(objectID, { from: account })
            .then(result => {
                cc.log(`Activate Deactivate Object RESULT: ${result}`);
                this.activateDeactivateObjectTxID = result
                return { activateDeactivateObjectTxID: result, progress: false }
            })
    }

    lcToClaimDividend = (objectID, account) => {
        cc.log(`Calling Read Investor To Claim.`);
        return this.LeaseTokenContract.toClaimDividend(account, objectID)
            .then(result => {
                cc.log(`ToClaimDividend RESULT: ${result[0].toString()}`);
                return { unClaimedRedemption: result[0].toString(), progress: false }
            })
    }

    lcToClaimTotal = (account) => {
        cc.log(`Calling To Claim Total.`);
        return this.LeaseTokenContract.toClaimTotal(account)
            .then(result => {
                cc.log(`ToClaimTotal RESULT: ${result[0].toNumber()}`);
                return { unClaimedRedemption: result[0].toNumber() }
            })
    }


    lcClaimDividend = (objectID, account) => {
        cc.log(`Calling Claim Interest And Redemption.`);
        return this.LeaseTokenContract.claimDividend(objectID, { from: account })
            .then(result => {
                cc.log(`claimDividend RESULT: ${result}`);
                // this.lcEventClaimSubscribe() //development
                this.claimDividendTxID = result
                return { claimDividendTxID: result, progress: false }
            })
    }

    lcCreateNewLeaseTokenObject = (props, data, account) => {
        if (props) this.props = props

        cc.log("Creating NewLeaseTokenObject");
        let self = this
        let _leasecontract = this.spender
        let _admin = "0x60516AA74F455f642C66FA1eD1e77C553da4be17"
        let hash = data["data"]["objectHash"]

        this.LeaseTokenObjectContract.new(
            _leasecontract,
            _admin,
            {
                data: '0x608060405234801561001057600080fd5b50604051604080610baf8339810180604052810190808051906020019092919080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505050610a338061017c6000396000f300608060405260043610610099576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806318160ddd1461009e57806323b872dd146100c957806335b281531461014e57806340c10f191461019157806370a08231146101f65780638da5cb5b1461024d57806394f3f81d146102a4578063cbe12969146102e7578063f2fde38b14610342575b600080fd5b3480156100aa57600080fd5b506100b3610385565b6040518082815260200191505060405180910390f35b3480156100d557600080fd5b50610134600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061038f565b604051808215151515815260200191505060405180910390f35b34801561015a57600080fd5b5061018f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506105b4565b005b34801561019d57600080fd5b506101dc600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061066d565b604051808215151515815260200191505060405180910390f35b34801561020257600080fd5b50610237600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506107ee565b6040518082815260200191505060405180910390f35b34801561025957600080fd5b50610262610837565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102b057600080fd5b506102e5600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061085c565b005b3480156102f357600080fd5b50610328600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610912565b604051808215151515815260200191505060405180910390f35b34801561034e57600080fd5b50610383600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610932565b005b6000600254905090565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141515156103cc57600080fd5b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561041a57600080fd5b61046c82600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546109d090919063ffffffff16565b600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061050182600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546109e990919063ffffffff16565b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b60011515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514151561061357600080fd5b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b600060011515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415156106ce57600080fd5b6106e3826002546109e990919063ffffffff16565b60028190555061073b82600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546109e990919063ffffffff16565b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156108b757600080fd5b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b60016020528060005260406000206000915054906101000a900460ff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561098d57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008282111515156109de57fe5b818303905092915050565b60008082840190508381101515156109fd57fe5b80915050929150505600a165627a7a72305820d087e880c18653c2ca34a3eba7bf5fdead1dd194f40aa49972d485ba1af0e4230029',
                from: account,
                gas: 4700000
            }, function (e, contract) {
                // cc.log(e, contract);
                if (contract && !e) {
                    self.props._setObject({
                        newLeaseTokenObject: {
                            txID: contract,
                            hash: hash
                        }
                    })

                    // data["data"]["leaseTokenAddress"] = contractAddress
                    self.props._writeNewContractData(self.props, data)

                    let contractAddress = ""
                    let timer = setInterval(() => {
                        cc.log("CHECKING CONTRACT ADDRESS:");
                        if (contractAddress)
                            clearInterval(timer)
                        self.eth.getTransactionReceipt(contract)
                            .then(res => {
                                if (res) {
                                    cc.log("TX RECEIPT: ", res)
                                    cc.log("CONTRACT ADDRESS: ", res.contractAddress)
                                    contractAddress = res.contractAddress
                                    if (contractAddress) {
                                        let newEvent = { event: "NewLeaseTokenObject", ...res }
                                        self.props._newLeaseTokenAddress({ newLeaseTokenAddress: contractAddress })
                                        self.props._setEvent(newEvent)
                                        self.props._sendUserEvent(newEvent)
                                    }
                                }
                            })
                    }, 5000)
                } else {
                    cc.log("ERROR - Metamask Rejection: ", e)
                }

            }
        )
    }

    // Lease Data Methods:

    ldGetRaised = (objectID) => {
        cc.log(`Calling Total Raised.`);
        return this.LeaseData.getRaised(objectID)
            .then(result => {
                cc.log(`getRaised RESULT: ${result[0].toNumber()}`);
                return {
                    id: objectID,
                    result: {
                        totalRaised: result[0].toNumber()
                    }
                }
            })
    }

    // lease token object methods:

    ltBalanceOf = (objectID, account, address) => {
        cc.log(`Fetching Lease Token Balance Of: `);

        return this.LeaseTokenObjectContract.at(address).balanceOf(account)
            .then(result => {
                cc.log(`EV TOKENS: ${result[0].toString()}`);
                // this.setState({ ["evToken_" + objectID]: result[0].toString() })
                return { id: objectID, result: result[0].toString() }
            })
    }

    ltTotalSupply = (objectID, address) => {
        cc.log(`Fetching Lease Token Total Supply: `);

        return this.LeaseTokenObjectContract.at(address).totalSupply()
            .then(result => {
                cc.log(`TOTAL SUPPLY: ${result[0].toString()}`);
                return { id: objectID, result: result[0].toString() }
            })
    }
}

const contract = new Contract()
export default contract