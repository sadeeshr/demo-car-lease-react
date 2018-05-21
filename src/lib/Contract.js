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
        this.spender = "0xaeC47EC5014f19a07145a1DB8B0738f9b304F7DF" // Lease Token Contract address as spender for Approve / Allowance methods
        this.contracts = {
            euroToken: {
                address: "0xCE868dEf60303B9D0c6c9e0F621B3591546e3C7E",
                abi: [{ "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approveByLeasecontract", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }]
            },
            leaseData: {
                address: "0x216030686c6eE82bD1B692c0db9561B75E338FC6",
                abhi: [{ "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getDealer", "outputs": [{ "name": "", "type": "address", "value": "0x" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_dealer", "type": "address" }], "name": "setDealer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getDriver", "outputs": [{ "name": "", "type": "address", "value": "0x" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "setDeactiveTime", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getRaised", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_deliveryDate", "type": "uint256" }], "name": "setActiveTime", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leasecbjectcycle", "outputs": [{ "name": "crowdsaleClosed", "type": "bool", "value": false }, { "name": "objectActive", "type": "bool", "value": false }, { "name": "objectActiveTime", "type": "uint256", "value": "0" }, { "name": "objectDeactiveTime", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leaseobject", "outputs": [{ "name": "leaseTokenAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectDealerAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectDriverAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectPrice", "type": "uint256", "value": "0" }, { "name": "monthlyCapitalCost", "type": "uint256", "value": "0" }, { "name": "monthlyOperatingCost", "type": "uint256", "value": "0" }, { "name": "objectContractHash", "type": "bytes", "value": "0x" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getCrowdsaleClosed", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_owner", "type": "address" }], "name": "getLastCapitalPayout", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_leasetoken", "type": "address" }], "name": "setLeaseToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_hash", "type": "bytes" }], "name": "setHash", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getHash", "outputs": [{ "name": "", "type": "bytes" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_driver", "type": "address" }], "name": "setDriver", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_operation", "type": "uint256" }], "name": "setOperationPaid", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getOperatingCost", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_owner", "type": "address" }, { "name": "_lastCapitalPayout", "type": "uint256" }], "name": "setLastCapitalPayout", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_capital", "type": "uint256" }], "name": "setCapitalPaid", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_crowdsale", "type": "bool" }], "name": "setCrowdsaleClosed", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getLeaseToken", "outputs": [{ "name": "", "type": "address", "value": "0x" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getCapitalCost", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_capitalCost", "type": "uint256" }], "name": "setCapitalCost", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leaseobjecttransactions", "outputs": [{ "name": "totalRaised", "type": "uint256", "value": "0" }, { "name": "totalCapitalPaid", "type": "uint256", "value": "0" }, { "name": "totalOperationPaid", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getActiveTime", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getActive", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getDeactiveTime", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getOperationPaid", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getCapitalPaid", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_active", "type": "bool" }], "name": "setActive", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getPrice", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_monthlyOperatingCost", "type": "uint256" }], "name": "setOperatingCost", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_raised", "type": "uint256" }], "name": "setRaised", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_price", "type": "uint256" }], "name": "setPrice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
            },
            LeaseTokenContract: {
                address: this.spender,
                abi: [{ "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "investInObject", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "claimInvestment", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_objectPrice", "type": "uint256" }, { "name": "_objectHash", "type": "bytes" }, { "name": "_objectDealerAddr", "type": "address" }, { "name": "_addressOfLeaseToken", "type": "address" }, { "name": "_monthlyCapitalCost", "type": "uint256" }, { "name": "_monthlyOperatingCost", "type": "uint256" }], "name": "createObject", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newUser", "type": "address" }], "name": "addUser", "outputs": [{ "name": "", "type": "bool" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_driver", "type": "address" }], "name": "updateDriver", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_capital", "type": "uint256" }, { "name": "_operation", "type": "uint256" }], "name": "payCapitalAndOperation", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "d", "outputs": [{ "name": "", "type": "address", "value": "0x216030686c6ee82bd1b692c0db9561b75e338fc6" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "deactivate", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "sumBalanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "toggleCrowdsale", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "toClaimTotal", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_owner", "type": "address" }], "name": "toClaimPerObject", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_operatingCost", "type": "uint256" }], "name": "updateOperationCost", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_deliveryDate", "type": "uint256" }], "name": "buyAndActivate", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "Euro", "outputs": [{ "name": "", "type": "address", "value": "0xce868def60303b9d0c6c9e0f621b3591546e3c7e" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "updateCapitalCostInLifecycle", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferLeaseToken", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_addressOfEuroToken", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Euro Token", "template": "elements_input_address", "value": "0xCE868dEf60303B9D0c6c9e0F621B3591546e3C7E" }, { "name": "_addressOfLeaseData", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Lease Data", "template": "elements_input_address", "value": "0x216030686c6eE82bD1B692c0db9561B75E338FC6" }, { "name": "_objectIDlastVersion", "type": "uint256", "index": 2, "typeShort": "uint", "bits": "256", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;object I Dlast Version", "template": "elements_input_uint", "value": "" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "claimed", "type": "bool" }], "name": "Claim", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newUser", "type": "address" }], "name": "CreateNewUser", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "AddNewObject", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "BoughtNewObject", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_id", "type": "uint256" }, { "indexed": false, "name": "_capital", "type": "uint256" }, { "indexed": false, "name": "_operation", "type": "uint256" }], "name": "PayCapitalAndOperation", "type": "event" }]
            },
            LeaseTokenObject: {
                abi: [{ "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }]
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
        this.LeaseTokenContract = null
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

    evBalanceOf = (account) => {
        cc.log(`Fetching EV Tokens Balance for: ${account}`);
        return this.LeaseTokenContract.balanceOf(account)
            .then(result => {
                cc.log(`EV TOKENS BALANCE: ${result[0].toString()}`);
                return { evTokenBalance: result[0].toString() }
            })
    }

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
                            newObjData["carID"] = objectID
                            let data = {
                                module: "membersdev2",
                                result: "members",
                                query: { "_id": this.addNewObjectID },
                                data: this.addNewObject
                            }
                            cc.log(data)
                            this.props._updateContractData(data)
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

    lcCreateObject = (objectid, objectImage, objectPrice, objectHash, objectType, objectDealer, objectFee, objectTerm, mileagesAvg, account) => {
        cc.log(`Adding New object for: ${objectPrice}, ${objectHash}, ${objectType}, ${objectDealer}, ${objectFee}, ${objectTerm}, ${mileagesAvg}, ${account}`);
        return this.LeaseTokenContract.createObject(objectPrice, objectHash, objectType, objectDealer, objectFee, objectTerm, mileagesAvg, { from: account })
            .then(result => {
                cc.log(`ADD NEW object RESULT: ${result}`);
                // this.lcEventAddNewObjectSubscribe() // development
                // this.addNewObjectTxID = result
                // this.addNewObjectID = objectid
                // this.addNewObject = {
                //     carPic: objectImage,
                //     carPrice: objectPrice,
                //     carHash: objectHash,
                //     carDealer: objectDealer,
                //     carFee: objectFee,
                //     carTerm: objectTerm,
                //     carMileagesAvg: mileagesAvg,
                //     account: account
                // }
                // return { addNewObjectTxID: result, addNewObjectHash: objectHash, progress: false }
                return {
                    newObject: {
                        id: objectid,
                        txID: result,
                        data: {
                            carPic: objectImage,
                            carPrice: objectPrice,
                            carHash: objectHash,
                            carDealer: objectDealer,
                            carFee: objectFee,
                            carTerm: objectTerm,
                            carMileagesAvg: mileagesAvg,
                            account: account
                        }
                    }
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
        cc.log(`Add New User: ${account}`);
        return this.LeaseTokenContract.addUser(user, { from: account })
            .then(result => {
                cc.log(`Add New User RESULT: ${result}`);
                return { AddNewUser: result }
            })
    }

    lcLeaseObject = (objectID) => {
        cc.log(`Fetch object Details for ID: ${objectID}`);
        return this.LeaseTokenContract.leaseobject(objectID)
            .then(result => {
                cc.log(`Details of object ID ${objectID} => `, result);
                return { id: objectID, result: result }
            })
    }

    lcLeaseObjectCycle = (objectID) => {
        cc.log(`Fetch object Cycle Details for ID: ${objectID}`);
        return this.LeaseTokenContract.leasecbjectcycle(objectID)
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
        cc.log(`Calling Raise Funds For object ID: ${objectID}, ${amount}, ${account}`);
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
}

const contract = new Contract()
export default contract