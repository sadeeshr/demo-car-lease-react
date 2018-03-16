/**
|--------------------------------------------------
| Lease Smart Contract Handler
| Author: Sadeesh Radhakrishnan
|--------------------------------------------------
*/
import Eth from 'ethjs';
import EthJs from 'ethjs-query';
import EthJsContract from 'ethjs-contract';
import unit from 'ethjs-unit';
import EthFilter from 'ethjs-filter';

class Contract {
    constructor() {
        this.contracts = {
            euroToken: {
                address: "0x84F71cCa581872a4a9b1F33547674B4e8765E581",
                abi: [{ "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "1000000" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "_approvals", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "tokenOwner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }]
            },
            evToken: {
                address: "0x23FA54b5114dc5F038f754e8c79C6A3E46aCBe8C",
                abi: [{ "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" }, { "name": "_value", "type": "uint256" }], "name": "mintToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "myAddress", "type": "address" }, { "name": "TokenId", "type": "uint256" }], "name": "myTokens", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_tokenId", "type": "uint256" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }]
            },
            LeaseContract: {
                address: "0x2d8F5c6ca4f54b6affcc0cB7Dee7246374BAC2c1",
                abi: [{ "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }, { "name": "amount", "type": "uint256" }], "name": "raiseFundsForCar", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalAmountRaised", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }], "name": "claimInterestAndRedemption", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "euroToken2", "outputs": [{ "name": "", "type": "address", "value": "0x84f71cca581872a4a9b1f33547674b4e8765e581" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }, { "name": "month", "type": "uint256" }, { "name": "milages", "type": "uint256" }], "name": "payInterestAndRedemption", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "ownershipToken", "outputs": [{ "name": "", "type": "address", "value": "0x23fa54b5114dc5f038f754e8c79c6a3e46acbe8c" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "investorAddress", "type": "address" }, { "name": "carID", "type": "uint256" }], "name": "readInvestorToClaim", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }, { "name": "_carHash", "type": "bytes32" }, { "name": "_carDealer", "type": "address" }, { "name": "_carDriver", "type": "address" }, { "name": "_monthlyRedemption", "type": "uint256" }], "name": "AddNewCar", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "carID", "type": "uint256" }], "name": "buyCarWhenFundsRaised", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "cars", "outputs": [{ "name": "exist", "type": "bool", "value": false }, { "name": "crowdsaleClosed", "type": "bool", "value": false }, { "name": "carDealerAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "carDriver", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "carContractHash", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "carRaised", "type": "uint256", "value": "0" }, { "name": "carMilages", "type": "uint256", "value": "0" }, { "name": "payMonthNr", "type": "uint256", "value": "0" }, { "name": "monthlyRedemption", "type": "uint256", "value": "0" }, { "name": "totalRedemption", "type": "uint256", "value": "0" }, { "name": "unclaimedRedemption", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "addressOfEvToken", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "address Of Ev Token", "template": "elements_input_address", "value": "0x23FA54b5114dc5F038f754e8c79C6A3E46aCBe8C" }, { "name": "addressOfEuroToken", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "address Of Euro Token", "template": "elements_input_address", "value": "0x84F71cCa581872a4a9b1F33547674B4e8765E581" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }, { "indexed": false, "name": "isContribution", "type": "bool" }], "name": "FundTransfer", "type": "event" }]
            }
        }
        this.filters = {
            evTransfer: null,
            lcFundTransfer: null
        }
        this.filter = null
        this.watcher = null
        this.account = null
        this.balance = null
        this.eth = null
        this.props = null
        this.evToken = null
        this.euroToken = null
        this.LeaseContract = null
    }

    getAccount = () => {
        // const self = this
        let accountTimer = setInterval(() => {
            // console.log("Checking Metamask Account");
            if (!this.account) {
                this.eth.coinbase().then(account => {
                    if (account) {
                        console.log("ACCOUNT: ", account);
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
        console.log("ETH: ", Eth);
        //let newWeb3 = new Eth.HttpProvider('https://smartjuice.apayaa.com:8545')
        //console.log("WEB 3 ####", newWeb3);
        //const eth = new Eth(newWeb3)
        const eth = new EthJs(web3.currentProvider)
        this.eth = eth
        // let account = eth.coinbase()
        this.getAccount()
        //this.props._setAccount({ account: "0x423B7B8Da5ec685130670A978a1A680dFa27c879" })
        // console.log("ACC: ", account);
        // const filters = new EthFilter(eth)
        // this.filter = new filters.PendingTransactionFilter()
        // this.filter.new()

        const contract = new EthJsContract(eth)
        // const LeaseContract = 
        this.euroToken = contract(this.contracts.euroToken.abi).at(this.contracts.euroToken.address)
        this.evToken = contract(this.contracts.evToken.abi).at(this.contracts.evToken.address)
        this.LeaseContract = contract(this.contracts.LeaseContract.abi).at(this.contracts.LeaseContract.address)

        // this.evEventTransfer()

        return {
            // euroToken: this.euroToken,
            // evToken: this.evToken,
            // LeaseContract: this.LeaseContract
        }
    }

    /**
     * Pending Transactions Filter, listens on all contracts, transactions, NOT RECOMMENDED
     */
    startPendingTranscationWatcher = () => {
        this.watcher = this.filter.watch((err, result) => {
            console.log("Pending Transaction Result: ", err, result);
            // if (err || result.length > 0) setTimeout(this.stopPendingTranscationWatcher, 1000);
        })
    }

    stopPendingTranscationWatcher = () => {
        this.watcher.stopWatching((err, result) => {
            console.log("Stopped Pending Transcation Watching: ", err, result);
        })
    }

    /**
     * EV Token Methods
     */
    evEventTransferSubscribe = () => {
        this.filters.evTransfer = this.evToken.Transfer()
        this.filters.evTransfer.new()
        this.filters.evTransfer.watch((err, result) => {
            console.log("EVToken Event Transfer() Result: ", err, result);
            if (err || result.length > 0) setTimeout(() => { this.evEventTransferUnsubscribe(); this.props._reloadTokens() }, 1000);

        })
    }

    evEventTransferUnsubscribe = () => {
        this.filters.evTransfer.uninstall((err, result) => {
            console.log("EVToken Event Transfer() Unsubscribe: ", err, result);
        })
    }

    evMyTokens = (account, carID) => {
        console.log(`Fetching EV Tokens for: ${account}, carID: ${carID}`);
        return this.evToken.myTokens(account, carID)
            .then(result => {
                console.log(`EV TOKENS: ${result[0].toString()}`);
                // this.setState({ ["evToken_" + carID]: result[0].toString() })
                return { id: carID, result: result[0].toString() }
            })
    }

    evBalanceOf = (account) => {
        console.log(`Fetching EV Tokens Balance for: ${account}`);
        return this.evToken.balanceOf(account)
            .then(result => {
                console.log(`EV TOKENS BALANCE: ${result[0].toString()}`);
                return { evTokenBalance: result[0].toString() }
            })
    }

    /**
     * Euro Token Methods
     */
    euroBalanceOf = (account) => {
        console.log(`Fetching EURO Tokens Balance for: ${account}`);
        return this.euroToken.balanceOf(account)
            .then(result => {
                console.log(`EURO TOKENS BALANCE: ${result[0].toString()}`);
                return { euroTokenBalance: result[0].toString() }
            })
    }

    /**
     * Lease Contract Methods
     */
    lcEventFundTransferSubscribe = () => {
        this.filters.lcFundTransfer = this.LeaseContract.FundTransfer()
        this.filters.lcFundTransfer.new()
        this.filters.lcFundTransfer.watch((err, result) => {
            console.log("LeaseContract Event FundTransfer() Result: ", err, result);
            if (err || result.length > 0) setTimeout(this.lcEventFundTransferUnsubscribe, 1000);
        })
    }

    lcEventFundTransferUnsubscribe = () => {
        this.filters.lcFundTransfer.uninstall((err, result) => {
            console.log("LeaseContract Event FundTransfer() Unsubscribe: ", err, result);
        })
    }

    lcAddNewCar = (carID, carHash, carDealer, carDriver, monRed, account) => {
        console.log(`Adding New Car for: ${account}`);
        return this.LeaseContract.AddNewCar(carID, carHash, carDealer, carDriver, monRed, { from: account })
            .then(result => {
                console.log(`ADD NEW CAR RESULT: ${result}`);
                return { addNewCarTxID: result, progress: false }
            })
    }

    lcTotalAmountRaised = () => {
        console.log(`Fetching Total Amount Raised.`);
        return this.LeaseContract.totalAmountRaised()
            .then(result => {
                console.log(`totalAmountRaised RESULT: ${result[0].toNumber()}`);
                return { totalAmountRaised: result[0].toNumber(), progress: false }
            })
    }

    lcCars = (carID) => {
        console.log(`Fetch Car Details for ID: ${carID}`);
        return this.LeaseContract.cars(carID)
            .then(result => {
                console.log(`Details of CAR ID ${carID} => `, result);
                // if (selected) this.props._carSelected(result)
                // if (result.crowdsaleClosed)
                // this.crowdsaleClosed = this.crowdsaleClosed + 1
                // return { [carID]: result }
                return { id: carID, result: result }
            })
    }


    lcRaiseFundsForCar = (carID, amount, account) => {
        console.log(`Calling Raise Funds For Car ID: ${carID}, ${amount}, ${account}`);
        return this.LeaseContract.raiseFundsForCar(carID, amount || "0", { from: account })
            .then(result => {
                console.log(`raiseFundsForCar RESULT: ${result}`);
                // this.lcEventFundTransferSubscribe()    // contract missing event call, not calling this 
                // this.startPendingTranscationWatcher()
                this.evEventTransferSubscribe()
                return { raiseFundsForCarTxID: result, progress: false }
            })
    }

    lcPayInterestAndRedemption = (carID, month, milege, account) => {
        console.log(`Calling Pay Interest And Redemption.`);
        return this.LeaseContract.payInterestAndRedemption(carID, month || "0", milege || "0", { from: account })
            .then(result => {
                console.log(`payInterestAndRedemption RESULT: ${result}`);
                return { payInterestAndRedemptionTxID: result, progress: false }
            })
    }

    lcReadInvestorToClaim = (carID, account) => {
        console.log(`Calling Read Investor To Claim.`);
        return this.LeaseContract.readInvestorToClaim(account, carID)
            .then(result => {
                console.log(`readInvestorToClaim RESULT: ${result[0].toString()}`);
                return { unClaimedRedemption: result[0].toString(), progress: false }
            })
    }

    lcClaimInterestAndRedemption = (carID, account) => {
        console.log(`Calling Claim Interest And Redemption.`);
        return this.LeaseContract.claimInterestAndRedemption(carID, { from: account })
            .then(result => {
                console.log(`claimInterestAndRedemption RESULT: ${result}`);
                return { claimInterestAndRedemptionTxID: result, progress: false }
            })
    }
}

const contract = new Contract()
export default contract