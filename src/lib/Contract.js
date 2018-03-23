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
// import EthFilter from 'ethjs-filter';

class Contract {
    constructor() {
        this.spender = "0x1e4fdA42b85Af17c1eE807EE73e6Be7984Db1D26" // Euro Token Contract address
        this.contracts = {
            euroToken: {
                address: "0x1e4fdA42b85Af17c1eE807EE73e6Be7984Db1D26",
                abi: [{ "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }]
            },
            LeaseTokenContract: {
                address: "0x95703522a4E2c4f76A120b55d1275cDe18d8F094",
                abi: [{ "constant": false, "inputs": [{ "name": "_objectID", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "investInObject", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_objectPrice", "type": "uint256" }, { "name": "_objectHash", "type": "bytes32" }, { "name": "_objectType", "type": "uint256" }, { "name": "_objectDealerAddr", "type": "address" }, { "name": "_objectFee", "type": "uint256" }], "name": "addNewObject", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "amountObjects", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_account", "type": "address" }], "name": "sumBalanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_objectID", "type": "uint256" }], "name": "claimDividend", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_objectID", "type": "uint256" }, { "name": "_paymonth", "type": "uint256" }, { "name": "_milages", "type": "uint256" }], "name": "paySubscription", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_objectID", "type": "uint256" }], "name": "buyObjectWhenFundsRaised", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_objectID", "type": "uint256" }, { "name": "_value", "type": "uint256" }], "name": "transferLeaseToken", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leaseobjects", "outputs": [{ "name": "crowdsaleClosed", "type": "bool", "value": false }, { "name": "objectContractHash", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "objectDealerAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectType", "type": "uint256", "value": "0" }, { "name": "objectPrice", "type": "uint256", "value": "0" }, { "name": "objectFee", "type": "uint256", "value": "0" }, { "name": "totalRaised", "type": "uint256", "value": "0" }, { "name": "totalDividends", "type": "uint256", "value": "0" }, { "name": "milages", "type": "uint256", "value": "0" }, { "name": "paymonth", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_objectId", "type": "uint256" }], "name": "objectBalanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "Euro", "outputs": [{ "name": "", "type": "address", "value": "0x1e4fda42b85af17c1ee807ee73e6be7984db1d26" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_account", "type": "address" }, { "name": "_objectID", "type": "uint256" }], "name": "toClaimDividend", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "addressOfEuroToken", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "address Of Euro Token", "template": "elements_input_address", "value": "0x1e4fdA42b85Af17c1eE807EE73e6Be7984Db1D26" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "AddNewObject", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "claimed", "type": "bool" }], "name": "Claim", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "objectId", "type": "uint256" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }]
            }
        }
        this.filters = {
            EeuroTransfer: null,
            EeuroApproval: null,
            EevTransfer: null,
            ElcAddNewObject: null
        }
        this.filter = null
        this.watcher = null
        this.account = null
        this.balance = null
        this.eth = null
        this.props = null
        this.LeaseTokenContract = null
        this.euroToken = null
        this.LeaseTokenContract = null
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
        // const LeaseTokenContract = 
        this.euroToken = contract(this.contracts.euroToken.abi).at(this.contracts.euroToken.address)
        this.LeaseTokenContract = contract(this.contracts.LeaseTokenContract.abi).at(this.contracts.LeaseTokenContract.address)

        console.log("Euro Token: ", this.euroToken);
        console.log("Lease Token Contract: ", this.LeaseTokenContract);
        // this.evEventTransfer()

        return {
            // euroToken: this.euroToken,
            // evToken: this.LeaseTokenContract,
            // LeaseTokenContract: this.LeaseTokenContract
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
     * Euro Token Events
     */

    euroEventTransferSubscribe = () => {
        this.filters.EeuroTransfer = this.euroToken.Transfer()
        this.filters.EeuroTransfer.new()
        this.filters.EeuroTransfer.watch((err, result) => {
            console.log("EuroToken Event Transfer() Result: ", err, result);
            if (err || result.length > 0) { this.props._setEventStatus({ eventTransfer: true }); setTimeout(() => { this.euroEventTransferUnsubscribe(); this.props._reloadTokens() }, 1000); }
        })
    }

    euroEventTransferUnsubscribe = () => {
        this.filters.EeuroTransfer.uninstall((err, result) => {
            console.log("EuroToken Event Transfer() Unsubscribe: ", err, result);
        })
    }

    euroEventApprovalSubscribe = () => {
        this.filters.EeuroApproval = this.euroToken.Approval()
        this.filters.EeuroApproval.new()
        this.filters.EeuroApproval.watch((err, result) => {
            console.log("EuroToken Event Approval() Result: ", err, result);
            if (err || result.length > 0) setTimeout(() => { this.euroEventApprovalUnsubscribe(); }, 1000);
        })
    }

    euroEventApprovalUnsubscribe = () => {
        this.filters.EeuroApproval.uninstall((err, result) => {
            console.log("EuroToken Event Approval() Unsubscribe: ", err, result);
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

    euroApprove = (value, account) => {

        console.log(`Approve value: ${value} to spend by: ${this.spender} from: ${account}`);
        return this.euroToken.approve(this.spender, value, { from: account })
            .then(result => {
                console.log(`Approval Result: ${result}`);
                this.euroEventApprovalSubscribe()
                return { approvalResult: result }
            })
    }

    euroAllowance = (account) => {
        console.log(`Fetching Allowance for: ${account}`);
        return this.euroToken.allowance(account, this.spender)
            .then(result => {
                console.log(`Allowance Result: ${result[0].toString()}`);
                return { allowance: result[0].toString() }
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
            console.log("EVToken Event Transfer() Result: ", err, result);
            if (err || result.length > 0) { this.props._setEventStatus({ eventTransfer: true }); setTimeout(() => { this.evEventTransferUnsubscribe(); this.props._reloadTokens() }, 1000); }

        })
    }

    evEventTransferUnsubscribe = () => {
        this.filters.EevTransfer.uninstall((err, result) => {
            console.log("EVToken Event Transfer() Unsubscribe: ", err, result);
        })
    }

    /**
     * Lease Token Methods
     */
    evMyTokens = (account, objectID) => {
        console.log(`Fetching EV Tokens for: ${account}, objectID: ${objectID}`);
        return this.LeaseTokenContract.objectBalanceOf(account, objectID)
            .then(result => {
                console.log(`EV TOKENS: ${result[0].toString()}`);
                // this.setState({ ["evToken_" + objectID]: result[0].toString() })
                return { id: objectID, result: result[0].toString() }
            })
    }

    evBalanceOf = (account) => {
        console.log(`Fetching EV Tokens Balance for: ${account}`);
        return this.LeaseTokenContract.balanceOf(account)
            .then(result => {
                console.log(`EV TOKENS BALANCE: ${result[0].toString()}`);
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
            console.log("LeaseTokenContract Event AddNewObject() Result: ", err, result);
            if (err || result.length > 0) { this.props._setEventStatus({ eventAddNewObject: true, objectID: (result[0].data.objectID.toNumber() - 1) }); setTimeout(() => { this.lcEventAddNewObjectUnsubscribe(); this.props._reloadTokens() }, 1000); }
        })
    }

    lcEventAddNewObjectUnsubscribe = () => {
        this.filters.ElcAddNewObject.uninstall((err, result) => {
            console.log("LeaseTokenContract Event AddNewObject() Unsubscribe: ", err, result);
        })
    }

    lcEventClaimSubscribe = () => {
        this.filters.lcClaim = this.LeaseTokenContract.Claim()
        this.filters.lcClaim.new()
        this.filters.lcClaim.watch((err, result) => {
            console.log("LeaseTokenContract Event Claim() Result: ", err, result);
            if (err || result.length > 0) { this.props._setEventStatus({ eventClaim: true }); setTimeout(this.lcEventClaimUnsubscribe, 1000); }
        })
    }

    lcEventClaimUnsubscribe = () => {
        this.filters.lcClaim.uninstall((err, result) => {
            console.log("LeaseTokenContract Event Claim() Unsubscribe: ", err, result);
        })
    }

    /**
     * Lease Contract Methods
     */

    lcaddNewobject = (objectPrice, objectHash, objectType, objectDealer, objectFee, account) => {
        console.log(`Adding New object for: ${account}`);
        return this.LeaseTokenContract.addNewObject(objectPrice, objectHash, objectType, objectDealer, objectFee, { from: account })
            .then(result => {
                console.log(`ADD NEW object RESULT: ${result}`);
                this.lcEventAddNewObjectSubscribe()
                return { addNewObjectTxID: result, progress: false }
            })
    }

    lcSumBalanceOf = (account) => {
        console.log(`Fetching Total Amount Raised.`);
        return this.LeaseTokenContract.sumBalanceOf(account)
            .then(result => {
                console.log(`sumBalanceOf RESULT: ${result[0].toNumber()}`);
                return { sumBalanceOf: result[0].toNumber(), progress: false }
            })
    }

    lcLeaseObjects = (objectID) => {
        console.log(`Fetch object Details for ID: ${objectID}`);
        return this.LeaseTokenContract.leaseobjects(objectID)
            .then(result => {
                console.log(`Details of object ID ${objectID} => `, result);
                // if (selected) this.props._objectSelected(result)
                // if (result.crowdsaleClosed)
                // this.crowdsaleClosed = this.crowdsaleClosed + 1
                // return { [objectID]: result }
                return { id: objectID, result: result }
            })
    }

    lcAmountObjects = () => {
        console.log(`Fetch Crowd Sale Closed Objects Count:`);
        return this.LeaseTokenContract.amountObjects()
            .then(result => {
                console.log(`Crowd Sale Closed Objects Count => `, result, result[0].toNumber());
                return { crowdsaleClosed: result[0].toNumber() }
            })
    }

    lcInvestInObject = (objectID, amount, account) => {
        console.log(`Calling Raise Funds For object ID: ${objectID}, ${amount}, ${account}`);
        return this.LeaseTokenContract.investInObject(objectID, amount || "0", { from: account })
            .then(result => {
                console.log(`Invest In Object RESULT: ${result}`);
                // this.lcEventAddNewObjectSubscribe()    // contract missing event call, not calling this 
                // this.startPendingTranscationWatcher()
                this.euroEventTransferSubscribe()
                return { investInObjectTxID: result, progress: false }
            })
    }

    lcPaySubscription = (objectID, month, milege, account) => {
        console.log(`Calling Pay Interest And Redemption.`);
        return this.LeaseTokenContract.paySubscription(objectID, month || "0", milege || "0", { from: account })
            .then(result => {
                console.log(`paySubscription RESULT: ${result}`);
                return { paySubscriptionTxID: result, progress: false }
            })
    }

    lcToClaimDividend = (objectID, account) => {
        console.log(`Calling Read Investor To Claim.`);
        return this.LeaseTokenContract.toClaimDividend(account, objectID)
            .then(result => {
                console.log(`ToClaimDividend RESULT: ${result[0].toString()}`);
                return { unClaimedRedemption: result[0].toString(), progress: false }
            })
    }

    lcClaimDividend = (objectID, account) => {
        console.log(`Calling Claim Interest And Redemption.`);
        return this.LeaseTokenContract.claimDividend(objectID, { from: account })
            .then(result => {
                console.log(`claimDividend RESULT: ${result}`);
                this.lcEventClaimSubscribe()
                return { claimDividendTxID: result, progress: false }
            })
    }
}

const contract = new Contract()
export default contract