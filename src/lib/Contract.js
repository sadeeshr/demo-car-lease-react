/**
|--------------------------------------------------
| Lease Smart Contract Handler
| Author: Sadeesh Radhakrishnan
|--------------------------------------------------
*/

import EthJs from 'ethjs-query';
import EthJsContract from 'ethjs-contract';
import unit from 'ethjs-unit';
import util from 'util';

class Contract {
    constructor() {
        this.address = "0xbb53a2f587E0Bf60B6233F3d3539ebB3be2449d6"   // SMART CONTRACT ADDRESS
        this.account = null
        this.balance = null
        this.eth = null
        this.props = null
        // ABI interface
        this.abi = [{ "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }, { "name": "amount", "type": "uint256" }], "name": "raiseFundsForCar", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalAmountRaised", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }], "name": "claimInterestAndRedemption", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "euroToken2", "outputs": [{ "name": "", "type": "address", "value": "0x84f71cca581872a4a9b1f33547674b4e8765e581" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "test2", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }, { "name": "month", "type": "uint256" }, { "name": "milages", "type": "uint256" }], "name": "payInterestAndRedemption", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "ownershipToken", "outputs": [{ "name": "", "type": "address", "value": "0x23fa54b5114dc5f038f754e8c79c6a3e46acbe8c" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }, { "name": "_carHash", "type": "bytes32" }, { "name": "_carDealer", "type": "address" }, { "name": "_carDriver", "type": "address" }, { "name": "_monthlyRedemption", "type": "uint256" }], "name": "AddNewCar", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }], "name": "buyCarWhenFundsRaised", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "cars", "outputs": [{ "name": "exist", "type": "bool", "value": false }, { "name": "crowdsaleClosed", "type": "bool", "value": false }, { "name": "carDealerAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "carDriver", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "carContractHash", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "carRaised", "type": "uint256", "value": "0" }, { "name": "carMilages", "type": "uint256", "value": "0" }, { "name": "payMonthNr", "type": "uint256", "value": "0" }, { "name": "monthlyRedemption", "type": "uint256", "value": "0" }, { "name": "totalRedemption", "type": "uint256", "value": "0" }, { "name": "unclaimedRedemption", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "test", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "addressOfEvToken", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "address Of Ev Token", "template": "elements_input_address", "value": "0x23FA54b5114dc5F038f754e8c79C6A3E46aCBe8C" }, { "name": "addressOfEuroToken", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "address Of Euro Token", "template": "elements_input_address", "value": "0x84F71cCa581872a4a9b1F33547674B4e8765E581" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }, { "indexed": false, "name": "isContribution", "type": "bool" }], "name": "FundTransfer", "type": "event" }]
    }

    getAccount = () => {
        if (!this.account) {
            this.eth.coinbase().then(account => { 
                console.log("ACCOUNT: ", account); 
                this.account = account; 
                return account 
            })
        } else
            return this.account
    }

    getBalance = (address) => {
        console.log("Fetching Balance for ", address);
        this.eth.getBalance(address, "latest")
            .then(balance => {
                let ethBal = unit.fromWei(balance, 'ether')
                console.log({ [address]: ethBal });
                this.props._setBalance({ [address]: ethBal })
            })
    }

    initContract = (props, web3) => {
        console.log("WEB3: ", web3);
        this.props = props
        const eth = new EthJs(web3.currentProvider)
        this.eth = eth
        // let account = eth.coinbase()
        this.getAccount()
        // console.log("ACC: ", account);
        const contract = new EthJsContract(eth)
        const LeaseContract = contract(this.abi)
        const leaseContract = LeaseContract.at(this.address)
        console.log("LEASE CONTRACT: ", leaseContract);
        return leaseContract
    }

}
const contract = new Contract()
export default contract