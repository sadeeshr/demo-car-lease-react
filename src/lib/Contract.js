/**
|--------------------------------------------------
| Lease Smart Contract Handler
| Author: Sadeesh Radhakrishnan
|--------------------------------------------------
*/

import EthJs from 'ethjs-query';
import EthJsContract from 'ethjs-contract';

class Contract {
    constructor() {
        this.address = "0xafd92B34FAfeEaE86943f792Ea84b1c7ad241d0e"   // SMART CONTRACT ADDRESS
        // ABI interface
        this.abi = [{ "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }], "name": "raiseFundsForCar", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }, { "name": "_carHash", "type": "bytes32" }, { "name": "_carDealer", "type": "address" }, { "name": "_carDriver", "type": "address" }], "name": "AddNewCar", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalAmountRaised", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }, { "name": "etherPrice", "type": "uint256" }], "name": "buyCarWhenFundsRaised", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "claimInterestAndRedemption", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }, { "name": "month", "type": "uint256" }, { "name": "kilometers", "type": "uint256" }], "name": "payInterestAndRedemption", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "ownershipToken", "outputs": [{ "name": "", "type": "address", "value": "0xef0242e1cdd0c48145426275ce542130f703a39b" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "cars", "outputs": [{ "name": "exist", "type": "bool", "value": true }, { "name": "crowdsaleClosed", "type": "bool", "value": false }, { "name": "carDealerAddress", "type": "address", "value": "0x91944022771f16f53de8fe329d3ce4795594c307" }, { "name": "carDriver", "type": "address", "value": "0xc0e612e818b32bfdd5a2b403a89139e92034a047" }, { "name": "carContractHash", "type": "bytes32", "value": "0xd760b2dbf6422c65d9f89bc0b5f59404ee94429503c8a9b1eb4b0435bfa7be2d" }, { "name": "carRaised", "type": "uint256", "value": "0" }, { "name": "numInvestors", "type": "uint256", "value": "0" }, { "name": "carKilometers", "type": "uint256", "value": "0" }, { "name": "payMonthNr", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "addressOfLeaseToken", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "address Of Lease Token", "template": "elements_input_address", "value": "0xef0242e1cdd0c48145426275ce542130f703a39b" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }, { "indexed": false, "name": "isContribution", "type": "bool" }], "name": "FundTransfer", "type": "event" }]
    }

    initContract = (props, web3) => {
        console.log("WEB3: ", web3);
        const eth = new EthJs(web3.currentProvider)
        const contract = new EthJsContract(eth)
        const LeaseContract = contract(this.abi)
        const leaseContract = LeaseContract.at(this.address)
        console.log("LEASE CONTRACT: ", leaseContract);
        return leaseContract        
    }

}
const contract = new Contract()
export default contract