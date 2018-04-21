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
        this.spender = "0x4ad12Ef400a68Fa431F3908e8df2E51E95BAb113" // Lease Token Contract address as spender for Approve / Allowance methods
        this.contracts = {
            euroToken: {
                address: "0xa7aa26880AE3F2201779953f2d92e5ebA78C86Dd",
                abi: [{ "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }]
            },
            LeaseTokenContract: {
                address: this.spender,
                abi: [{ "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "investInObject", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "claimInvestment", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "updateFeeInLifecycle", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leasecbjectcycle", "outputs": [{ "name": "crowdsaleClosed", "type": "bool", "value": false }, { "name": "objectActive", "type": "bool", "value": false }, { "name": "objectActiveTime", "type": "uint256", "value": "0" }, { "name": "objectDeactiveTime", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newUser", "type": "address" }], "name": "addUser", "outputs": [{ "name": "", "type": "bool" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leaseobject", "outputs": [{ "name": "objectDealerAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectDriverAddress", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "objectPrice", "type": "uint256", "value": "0" }, { "name": "objectType", "type": "uint256", "value": "0" }, { "name": "objectFee", "type": "uint256", "value": "0" }, { "name": "objectTerm", "type": "uint256", "value": "0" }, { "name": "objectContractHash", "type": "bytes", "value": "0x" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "giveMe", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_objectPrice", "type": "uint256" }, { "name": "_objectHash", "type": "bytes" }, { "name": "_objectType", "type": "uint256" }, { "name": "_objectDealerAddr", "type": "address" }, { "name": "_objectFee", "type": "uint256" }, { "name": "_objectTerm", "type": "uint256" }, { "name": "_mileagesAvg", "type": "uint256" }], "name": "createObject", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "autoPayFee", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "closeCrowdsale", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "sumBalanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_driver", "type": "address" }], "name": "updateDriverAddress", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "toClaimTotal", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "buyObjectWhenFundsRaised", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_owner", "type": "address" }], "name": "toClaimPerObject", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "leaseobjectredemption", "outputs": [{ "name": "totalRaised", "type": "uint256", "value": "0" }, { "name": "totalDividends", "type": "uint256", "value": "0" }, { "name": "mileagesTotal", "type": "uint256", "value": "0" }, { "name": "mileagesAverage", "type": "uint256", "value": "0" }, { "name": "paymonth", "type": "uint256", "value": "0" }, { "name": "autoPay", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "payFee", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "activateDeactivateObject", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_objectId", "type": "uint256" }], "name": "objectBalanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "Euro", "outputs": [{ "name": "", "type": "address", "value": "0xa7aa26880ae3f2201779953f2d92e5eba78c86dd" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferLeaseToken", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "updateFeeDuringCrowedsale", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_mileagesAvg", "type": "uint256" }], "name": "updateMileages", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_type", "type": "uint256" }], "name": "sumObjectTypes", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_addressOfEuroToken", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Euro Token", "template": "elements_input_address", "value": "0xa7aa26880AE3F2201779953f2d92e5ebA78C86Dd" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "AddNewObject", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "claimed", "type": "bool" }], "name": "Claim", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "objectId", "type": "uint256" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "objectId", "type": "uint256" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }]
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
        this.paySubscriptionTxID = null
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

    getConfirmationsHash = (hash) => {
        console.log("HASH: ", hash);
        let blockStart, blockEnd;
        this.timer = setInterval(() => {
            console.log("CHECKING HASH CONFIRMATIONS:");
            this.eth.getTransactionReceipt(hash)
                .then(res => {
                    if (res && res.blockNumber) {
                        console.log("START BLOCK: ", res.blockNumber.toNumber())
                        blockStart = res.blockNumber.toNumber()
                    }
                })
                .then(
                    blockStart && this.eth.blockNumber()
                        .then(res => {
                            blockEnd = res
                            let confirmations = (blockEnd - blockStart)
                            console.log("CURRENT BLOCK: ", res.toNumber())
                            console.log("No. CONFs: ", confirmations, (confirmations > 0), this.timer)

                            if (confirmations > 0) {
                                this.props._hashConfirmations({ hashConfirmations: confirmations })
                                clearInterval(this.timer)
                            }
                        })
                )
        }, 1000)

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
            if (err || result.length > 0) {
                let resultObj = { eventTransfer: true }

                if (this.paySubscriptionTxID)
                    resultObj = { eventSubscription: true }

                this.props._setEventStatus(resultObj); setTimeout(() => { this.paySubscriptionTxID = null; this.investInObjectTxID = null; this.euroEventTransferUnsubscribe(); this.props._reloadTokens() }, 1000);
            }

            // if (err || result.length > 0) {
            //     if (!err)
            //         result.map(res => {
            //             if (res.transactionHash === this.investInObjectTxID)
            //                 this.props._setEventStatus({ eventTransfer: true }); setTimeout(() => { this.investInObjectTxID = null; this.euroEventTransferUnsubscribe(); this.props._reloadTokens() }, 1000);
            //             if (res.transactionHash === this.paySubscriptionTxID)
            //                 this.props._setEventStatus({ eventSubscription: true }); setTimeout(() => { this.paySubscriptionTxID = null; this.euroEventTransferUnsubscribe(); }, 1000);
            //         })
            //     else
            //         err.map(res => {
            //             if (res.transactionHash === this.investInObjectTxID)
            //                 this.props._setEventStatus({ eventTransfer: true }); setTimeout(() => { this.euroEventTransferUnsubscribe(); this.props._reloadTokens() }, 1000);
            //             if (res.transactionHash === this.paySubscriptionTxID)
            //                 this.props._setEventStatus({ eventSubscription: true }); setTimeout(() => { this.paySubscriptionTxID = null; this.euroEventTransferUnsubscribe(); }, 1000);
            //         })
            // }
        })
    }

    euroEventTransferUnsubscribe = () => {
        this.filters.EeuroTransfer.uninstall((err, result) => {
            console.log("EuroToken Event Transfer() Unsubscribe: ", err, result);
            this.investInObjectTxID = null
        })
    }

    euroEventApprovalSubscribe = () => {
        this.filters.EeuroApproval = this.euroToken.Approval()
        this.filters.EeuroApproval.new()
        this.filters.EeuroApproval.watch((err, result) => {
            console.log("EuroToken Event Approval() Result: ", err, result);
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
            console.log("EuroToken Event Approval() Unsubscribe: ", err, result);
            this.approveTxID = null
        })
    }

    /**
     * Euro Token Methods
     */
    euroBalanceOf = (account) => {
        console.log(`Fetching EURO Tokens Balance for: ${account}`);
        return this.euroToken.balanceOf(account)
            .then(result => {
                console.log(`EURO TOKENS BALANCE: ${result[0].toString() / 1000000}`);
                return { euroTokenBalance: (result[0].toString() / 1000000) }
            })
    }

    euroApprove = (value, account) => {

        console.log(`Approve value: ${value * 1000000} to spend by: ${this.spender} from: ${account}`);
        return this.euroToken.approve(this.spender, (value * 1000000), { from: account })
            .then(result => {
                console.log(`Approval Result: ${result}`);
                this.euroEventApprovalSubscribe()
                this.approveTxID = result
                return { approveTxID: result }
            })
    }

    euroAllowance = (account) => {
        console.log(`Fetching Allowance for: ${account}`);
        return this.euroToken.allowance(account, this.spender)
            .then(result => {
                console.log(`Allowance Result: ${result[0].toString() / 1000000}`);
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
            if (err || result.length > 0) {
                if (!err)
                    result.map(res => {
                        if (res.transactionHash === this.addNewObjectTxID) {
                            let objectID = result[0].data.objectID.toNumber()
                            let newObjData = this.addNewObject
                            newObjData["carID"] = objectID
                            let data = {
                                module: "membersdev",
                                result: "members",
                                query: { "_id": this.addNewObjectID },
                                data: this.addNewObject
                            }
                            console.log(data)
                            this.props._updateContractData(data)
                            this.props._setEventStatus({ eventAddNewObject: true, objectID: objectID }); setTimeout(() => { this.lcEventAddNewObjectUnsubscribe(); this.props._reloadTokens() }, 1000);
                        }
                        return res
                    })
                else
                    console.log(err)
            }
        })
    }

    lcEventAddNewObjectUnsubscribe = () => {
        this.filters.ElcAddNewObject.uninstall((err, result) => {
            console.log("LeaseTokenContract Event AddNewObject() Unsubscribe: ", err, result);
            this.addNewObjectTxID = null
            this.addNewObjectID = null
            this.addNewObject = null
        })
    }

    lcEventClaimSubscribe = () => {
        this.filters.lcClaim = this.LeaseTokenContract.Claim()
        this.filters.lcClaim.new()
        this.filters.lcClaim.watch((err, result) => {
            console.log("LeaseTokenContract Event Claim() Result: ", err, result);
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
            console.log("LeaseTokenContract Event Claim() Unsubscribe: ", err, result);
            this.claimDividendTxID = null
        })
    }

    /**
     * Lease Contract Methods
     */

    lcCreateObject = (objectid, objectImage, objectPrice, objectHash, objectType, objectDealer, objectFee, objectTerm, mileagesAvg, account) => {
        console.log(`Adding New object for: ${objectPrice}, ${objectHash}, ${objectType}, ${objectDealer}, ${objectFee}, ${objectTerm}, ${mileagesAvg}, ${account}`);
        return this.LeaseTokenContract.createObject(objectPrice, objectHash, objectType, objectDealer, objectFee, objectTerm, mileagesAvg, { from: account })
            .then(result => {
                console.log(`ADD NEW object RESULT: ${result}`);
                this.lcEventAddNewObjectSubscribe()
                this.addNewObjectTxID = result
                this.addNewObjectID = objectid
                this.addNewObject = {
                    carPic: objectImage,
                    carPrice: objectPrice,
                    carHash: objectHash,
                    carDealer: objectDealer,
                    carFee: objectFee,
                    carTerm: objectTerm,
                    carMileagesAvg: mileagesAvg,
                    account: account
                }
                return { addNewObjectTxID: result, progress: false }
            })
    }

    lcSumBalanceOf = (account) => {
        console.log(`Fetching Sum Balance Of: `);
        return this.LeaseTokenContract.sumBalanceOf(account)
            .then(result => {
                console.log(`sumBalanceOf RESULT: ${result[0].toNumber()}`);
                return { sumBalanceOf: result[0].toNumber(), progress: false }
            })
    }

    lcTotalSupply = () => {
        console.log(`Fetching Total Amount Raised.`);
        return this.LeaseTokenContract.totalSupply()
            .then(result => {
                console.log(`Total Supply RESULT: ${result[0].toNumber()}`);
                return { totalSupply: result[0].toNumber(), progress: false }
            })
    }

    lcAuthorization = (account) => {
        console.log(`Checking Authorization for: ${account}`);
        return this.LeaseTokenContract.authorization(account)
            .then(result => {
                console.log(`Authorization RESULT: ${result[0]}`);
                return { account: account, result: result[0] }
            })
    }

    lcAddUser = (user, account) => {
        console.log(`Add New User: ${account}`);
        return this.LeaseTokenContract.addUser(user, { from: account })
            .then(result => {
                console.log(`Add New User RESULT: ${result}`);
                return { AddNewUser: result }
            })
    }

    lcLeaseObject = (objectID) => {
        console.log(`Fetch object Details for ID: ${objectID}`);
        return this.LeaseTokenContract.leaseobject(objectID)
            .then(result => {
                console.log(`Details of object ID ${objectID} => `, result);
                return { id: objectID, result: result }
            })
    }

    lcLeaseObjectCycle = (objectID) => {
        console.log(`Fetch object Cycle Details for ID: ${objectID}`);
        return this.LeaseTokenContract.leasecbjectcycle(objectID)
            .then(result => {
                console.log(`Details of object cycle ID ${objectID} => `, result);
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
        console.log(`Fetch object Redemption Details for ID: ${objectID}`);
        return this.LeaseTokenContract.leaseobjectredemption(objectID)
            .then(result => {
                console.log(`Details of object redemption ID ${objectID} => `, result);
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
                this.investInObjectTxID = result
                return { investInObjectTxID: result, progress: false }
            })
    }

    lcPaySubscription = (objectID, month, milege, account) => {
        // account = "0xA30b6a96D652E99AA25162B2b9165f2c3f683ACc"
        console.log(`Calling Pay Interest And Redemption: ${objectID}, ${month}, ${milege}, ${account}`);
        return this.LeaseTokenContract.paySubscription(objectID, month, milege, { from: account })
            .then(result => {
                console.log(`paySubscription RESULT: ${result}`);
                this.euroEventTransferSubscribe()
                this.paySubscriptionTxID = result
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
                this.claimDividendTxID = result
                return { claimDividendTxID: result, progress: false }
            })
    }
}

const contract = new Contract()
export default contract