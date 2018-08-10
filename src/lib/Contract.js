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
        this.spender = "0xaE5D33E54685c868C82287E75F4DD2F7CD8568EB" // Lease Token Contract address as spender for Approve / Allowance methods
        this.contracts = {
            euroToken: {
                address: "0x34a5c08d0b570E90243A2B3A8ad7F980A0DE83EC",
                abi: [{ "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approveByCrowdfundcontract", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool", "value": false }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }]
            },
            CrowdFundData: {
                address: "0x1115C7573bd5FBa94EBAc8B86D222a23558F0e7a",
                abi: [{ "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }], "name": "getBytes", "outputs": [{ "name": "", "type": "bytes" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "address" }], "name": "setAddr", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_TokenFactoryAddress", "type": "address" }], "name": "setTokenFactory", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newUser", "type": "address" }], "name": "addAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }], "name": "getAddr", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "getObjectID", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_cid", "type": "uint256" }, { "name": "_existingCurrency", "type": "address" }], "name": "removeCurrencyType", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "string" }], "name": "setString", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "bytes" }], "name": "setBytes", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_owner", "type": "address" }], "name": "getExtraInt", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "bool" }], "name": "setBool", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTokenFactory", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "existingUser", "type": "address" }], "name": "removeAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }], "name": "getString", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }], "name": "getInt", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_cid", "type": "uint256" }], "name": "viewCurrencyType", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_cid", "type": "uint256" }, { "name": "_newCurrency", "type": "address" }], "name": "addCurrencyType", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_value", "type": "uint256" }], "name": "setInt", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorization", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_existingUser", "type": "address" }], "name": "removeUserAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }, { "name": "_owner", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "setExtraInt", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_key", "type": "string" }], "name": "getBool", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_user", "type": "address" }], "name": "viewUserAuthorization", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "objectID_", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newUser", "type": "address" }], "name": "addUserAuthorization", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_tokenFactory", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;token Factory", "template": "elements_input_address", "value": "0xc8b78175Cb1720D7466fe7f526e03E68a04f9cC8" }, { "name": "_firstCurrency", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;first Currency", "template": "elements_input_address", "value": "0x34a5c08d0b570E90243A2B3A8ad7F980A0DE83EC" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }]
            },
            CrowdFundContract: {
                address: this.spender,
                abi: [{ "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_amount", "type": "uint256" }], "name": "investInObject", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_objectHash", "type": "bytes" }, { "name": "_currencyId", "type": "uint256" }, { "name": "_objectPrice", "type": "uint256" }, { "name": "_fundReceiver", "type": "address" }, { "name": "_serviceProvider", "type": "address" }, { "name": "_monthlyCapitalCost", "type": "uint256" }, { "name": "_monthlyOperatingCost", "type": "uint256" }, { "name": "_biddingTimeInDays", "type": "uint256" }], "name": "createObject", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "d", "outputs": [{ "name": "", "type": "address", "value": "0x1115c7573bd5fba94ebac8b86d222a23558f0e7a" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address", "value": "0x60516aa74f455f642c66fa1ed1e77c553da4be17" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_deliveryDate", "type": "uint256" }], "name": "buyAndActivate", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newUser", "type": "address" }, { "name": "_currencyId", "type": "uint256" }], "name": "addUser", "outputs": [{ "name": "", "type": "bool" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "claimClosedCrowdsales", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_addressOfCrowdfundData", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;address Of Crowdfund Data", "template": "elements_input_address", "value": "0x1115C7573bd5FBa94EBAc8B86D222a23558F0e7a" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newUser", "type": "address" }], "name": "CreateNewUser", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "AddNewObject", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "InvestInObject", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "BoughtNewObject", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "objectID", "type": "uint256" }], "name": "ClaimedCrowdsale", "type": "event" }]
            },
            CrowdFundToken: {
                abi: [{ "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_to", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;to", "template": "elements_input_address", "value": "0x5de17631Cf829d754aBA3e78F6379aa1299aB2CE" }, { "name": "_amount", "type": "uint256", "index": 1, "typeShort": "uint", "bits": "256", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;amount", "template": "elements_input_uint", "value": "444" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }]
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
        this.CrowdFundContract = null
        this.euroToken = null
        this.CrowdFundData = null
        this.CrowdFundTokenContract = null
    }

    getAccount = () => {
        // const self = this
        let accountTimer = setInterval(() => {
            // cc.log("Checking Metamask Account");
            if (!this.account) {
                console.log("NOT LOGGED IN")
                this.eth.coinbase().then(account => {
                    if (account) {
                        cc.log("ACCOUNT: ", account);
                        console.log("LOGGED IN")
                        // this.getConfirmationsHash("0xf290b3e19ad0dc1bed93831bb04781af173f4643c55b270efb82235c55088150")
                        this.account = account;
                        this.props._setAccount({ account })
                        this.getVersion()
                        clearInterval(accountTimer)
                    }
                })
            } else
                clearInterval(accountTimer)
        }, 1000)

    }

    getVersion = () => {
        this.eth.net_version().then(netId => {
            switch (netId) {
                case "1":
                    console.log('This is mainnet')
                    break
                case "2":
                    console.log('This is the deprecated Morden test network.')
                    break
                case "3":
                    console.log('This is the ropsten test network.')
                    break
                case "4":
                    console.log('This is the Rinkeby test network.')
                    break
                case "42":
                    console.log('This is the Kovan test network.')
                    break
                default:
                    console.log('This is an unknown network.')
            }
        })
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
        this.getVersion()
        this.getAccount()
        //this.props._setAccount({ account: "0x423B7B8Da5ec685130670A978a1A680dFa27c879" })
        // cc.log("ACC: ", account);
        // const filters = new EthFilter(eth)
        // this.filter = new filters.PendingTransactionFilter()
        // this.filter.new()

        const contract = new EthJsContract(eth)
        // const CrowdFundContract = 
        this.euroToken = contract(this.contracts.euroToken.abi).at(this.contracts.euroToken.address)
        this.CrowdFundContract = contract(this.contracts.CrowdFundContract.abi).at(this.contracts.CrowdFundContract.address)
        this.CrowdFundData = contract(this.contracts.CrowdFundData.abi).at(this.contracts.CrowdFundData.address)
        this.CrowdFundTokenContract = contract(this.contracts.CrowdFundToken.abi);


        cc.log("CrowdFundData: ", this.CrowdFundData);

        // cc.log("Euro Token: ", this.euroToken);
        cc.log("Crowd Fund Contract: ", this.CrowdFundContract);
        // this.evEventTransfer()

        return {
            // euroToken: this.euroToken,
            // evToken: this.CrowdFundContract,
            // CrowdFundContract: this.CrowdFundContract
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
        this.filters.EevTransfer = this.CrowdFundContract.Transfer()
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
        return this.CrowdFundContract.objectBalanceOf(account, objectID)
            .then(result => {
                cc.log(`EV TOKENS: ${result[0].toString()}`);
                // this.setState({ ["evToken_" + objectID]: result[0].toString() })
                return { id: objectID, result: result[0].toString() }
            })
    }

    // evBalanceOf = (account) => {
    //     cc.log(`Fetching EV Tokens Balance for: ${account}`);
    //     return this.CrowdFundContract.balanceOf(account)
    //         .then(result => {
    //             cc.log(`EV TOKENS BALANCE: ${result[0].toString()}`);
    //             return { evTokenBalance: result[0].toString() }
    //         })
    // }

    /**
     * Lease Contract Events
     */

    lcEventAddNewObjectSubscribe = () => {
        this.filters.ElcAddNewObject = this.CrowdFundContract.AddNewObject()
        this.filters.ElcAddNewObject.new()
        this.filters.ElcAddNewObject.watch((err, result) => {
            cc.log("CrowdFundContract Event AddNewObject() Result: ", err, result);
            if (err || result.length > 0) {
                if (!err)
                    result.map(res => {
                        if (res.transactionHash === this.addNewObjectTxID) {
                            let objectID = result[0].data.objectID.toNumber()
                            let newObjData = this.addNewObject
                            newObjData["objectID"] = objectID
                            let data = {
                                module: "membersdev3",
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
            cc.log("CrowdFundContract Event AddNewObject() Unsubscribe: ", err, result);
            this.addNewObjectTxID = null
            this.addNewObjectID = null
            this.addNewObject = null
        })
    }

    lcEventClaimSubscribe = () => {
        this.filters.lcClaim = this.CrowdFundContract.Claim()
        this.filters.lcClaim.new()
        this.filters.lcClaim.watch((err, result) => {
            cc.log("CrowdFundContract Event Claim() Result: ", err, result);
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
            cc.log("CrowdFundContract Event Claim() Unsubscribe: ", err, result);
            this.claimDividendTxID = null
        })
    }

    /**
     * Lease Contract Methods
     */

    lcCreateObject = (props, objectName, months, municipalityID, objectPrice, objectHash, objectCurrencyID, objectDealer, objectMCCost, objectMOCost, account) => {
        cc.log(`Adding New object for: ${objectName}, ${objectPrice}, ${objectHash}, ${objectCurrencyID}, ${objectDealer}, ${objectMCCost}, ${objectMOCost}, ${account}`);
        if (props) this.props = props
        return this.CrowdFundContract.createObject(objectPrice, objectHash, objectDealer, objectCurrencyID, objectName, objectMCCost, objectMOCost, { from: account })
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

                // let data = {
                //     module: "crowdfundobj",
                //     result: "members",
                //     query: {
                //         "_id": id
                //     },
                //     data: { objectTxHash: result }
                // }
                // this.props._updateContractData(this.props, data)

                return {
                    newObject: {
                        txID: result,
                        // id: id
                        // data: {
                        // objectName,
                        // municipalityID,
                        // months,
                        // objectPrice,
                        // objectHash,
                        // objectDealer,
                        // objectCurrencyID,
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
        return this.CrowdFundContract.sumBalanceOf(account)
            .then(result => {
                cc.log(`sumBalanceOf RESULT: ${result[0].toNumber()}`);
                return { sumBalanceOf: result[0].toNumber(), progress: false }
            })
    }

    lcTotalSupply = () => {
        cc.log(`Fetching Total Amount Raised.`);
        return this.CrowdFundContract.totalSupply()
            .then(result => {
                cc.log(`Total Supply RESULT: ${result[0].toNumber()}`);
                return { totalSupply: result[0].toNumber(), progress: false }
            })
    }

    lcAuthorization = (account) => {
        cc.log(`Checking Authorization for: ${account}`);
        return this.CrowdFundData.viewUserAuthorization(account)
            .then(result => {
                cc.log(`Authorization RESULT: ${result[0]}`);
                return { account: account, result: result[0] }
            })
    }

    lcAddUser = (user, account) => {
        cc.log(`Add New User: ${user} Auth: ${account}`);
        return this.CrowdFundContract.addUser(user, { from: account })
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
        return this.CrowdFundContract.buyAndActivate(objectID, timeStamp, { from: account })
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
        return this.CrowdFundContract.payCapitalAndOperation(objectID, capital, operation, { from: account })
            .then(result => {
                cc.log(`Pay Capital And Operation: ${result}`);
                return {
                    payFeeTxID: result, progress: false
                }
            })
    }

    // lcLeaseObject = (objectID) => {
    //     cc.log(`Fetch object Details for ID: ${objectID}`);
    //     return this.CrowdFundData.leaseobject(objectID)
    //         .then(result => {
    //             cc.log(`Details of object ID ${objectID} => `, result);
    //             return { id: objectID, result: result }
    //         })
    // }

    crowdFundData = (objectID, type, name) => {
        switch (type) {
            case "string":
                return this.CrowdFundData.getString(objectID, name)
                    .then(result => {
                        cc.log(`Get String Details of object ID ${objectID} ${name} => `, result[0]);
                        return { id: objectID, result: { [name]: result[0] } }
                    })
            case "bytes":
                return this.CrowdFundData.getBytes(objectID, name)
                    .then(result => {
                        cc.log(`Get Bytes Details of object ID ${objectID} ${name} => `, result[0]);
                        return { id: objectID, result: { [name]: result[0] } }
                    })
            case "address":
                return this.CrowdFundData.getAddr(objectID, name)
                    .then(result => {
                        cc.log(`Get Address Details of object ID ${objectID} ${name} => `, result[0]);
                        return { id: objectID, result: { [name]: result[0] } }
                    })
            case "integer":
                return this.CrowdFundData.getInt(objectID, name)
                    .then(result => {
                        cc.log(`Get Integer Details of object ID ${objectID} ${name} => `, result[0].toNumber());
                        return { id: objectID, result: { [name]: result[0].toNumber() } }
                    })
            case "bool":
                return this.CrowdFundData.getBool(objectID, name)
                    .then(result => {
                        cc.log(`Get Boolean Details of object ID ${objectID} ${name} => `, result[0]);
                        return { id: objectID, result: { [name]: result[0] } }
                    })
            default:
                return;
        }
    }

    // lcLeaseObjectCycle = (objectID) => {
    //     cc.log(`Fetch object Cycle Details for ID: ${objectID}`);
    //     return this.CrowdFundData.leasecbjectcycle(objectID)
    //         .then(result => {
    //             cc.log(`Details of object cycle ID ${objectID} => `, result);
    //             return {
    //                 id: objectID,
    //                 result: {
    //                     crowdsaleClosed: result["crowdsaleClosed"],
    //                     active: result["objectActive"],
    //                     activeTime: result["objectActiveTime"].toNumber(),
    //                     deactiveTime: result["objectDeactiveTime"].toNumber()
    //                 }
    //             }
    //         })
    // }

    // lcLeaseObjectRedemption = (objectID) => {
    //     cc.log(`Fetch object Redemption Details for ID: ${objectID}`);
    //     return this.CrowdFundContract.leaseobjectredemption(objectID)
    //         .then(result => {
    //             cc.log(`Details of object redemption ID ${objectID} => `, result);
    //             return {
    //                 id: objectID,
    //                 result: {
    //                     totalRaised: result["totalRaised"].toNumber(),
    //                     totalDividends: result["totalDividends"].toNumber(),
    //                     paymonth: result["paymonth"].toNumber(),
    //                     mileagesTotal: result["mileagesTotal"].toNumber(),
    //                     mileagesAverage: result["mileagesAverage"].toNumber(),
    //                     autoPay: result["autoPay"]
    //                 }
    //             }
    //         })
    // }

    lcAmountObjects = () => {
        cc.log(`Fetch Crowd Sale Closed Objects Count:`);
        return this.CrowdFundContract.amountObjects()
            .then(result => {
                cc.log(`Crowd Sale Closed Objects Count => `, result, result[0].toNumber());
                return { crowdsaleClosed: result[0].toNumber() }
            })
    }

    lcInvestInObject = (objectID, amount, account) => {
        cc.log(`Calling Invest In Object For object ID: ${objectID}, ${amount}, ${account}`);
        return this.CrowdFundContract.investInObject(objectID, amount || "0", { from: account })
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
        return this.CrowdFundContract.payFee(objectID, { from: account })
            .then(result => {
                cc.log(`payFee RESULT: ${result}`);
                // this.euroEventTransferSubscribe() //development
                this.payFeeTxID = result
                return { payFeeTxID: result, progress: false }
            })
    }


    lcActivateDeactivateObject = (objectID, account) => {
        cc.log(`Calling Activate Deactivate Object: ${objectID}, ${account}`);
        return this.CrowdFundContract.activateDeactivateObject(objectID, { from: account })
            .then(result => {
                cc.log(`Activate Deactivate Object RESULT: ${result}`);
                this.activateDeactivateObjectTxID = result
                return { activateDeactivateObjectTxID: result, progress: false }
            })
    }

    lcToClaimDividend = (objectID, account) => {
        cc.log(`Calling Read Investor To Claim.`);
        return this.CrowdFundContract.toClaimDividend(account, objectID)
            .then(result => {
                cc.log(`ToClaimDividend RESULT: ${result[0].toString()}`);
                return { unClaimedRedemption: result[0].toString(), progress: false }
            })
    }

    // lcToClaimTotal = (account) => {
    //     cc.log(`Calling To Claim Total.`); // change included as transaction 
    //     // return this.CrowdFundContract.toClaimTotal(account, { from: account })
    //     return this.CrowdFundContract.toClaimTotal(account)
    //         .then(result => {
    //             cc.log(`ToClaimTotal RESULT: ${result[0].toNumber()}`);
    //             return { unClaimedRedemption: result[0].toNumber() }
    //         })
    // }


    lcClaimDividend = (objectID, account) => {
        cc.log(`Calling Claim Interest And Redemption.`);
        return this.CrowdFundContract.claimDividend(objectID, { from: account })
            .then(result => {
                cc.log(`claimDividend RESULT: ${result}`);
                // this.lcEventClaimSubscribe() //development
                this.claimDividendTxID = result
                return { claimDividendTxID: result, progress: false }
            })
    }

    lcCreateNewCrowdFundToken = (props, data, account) => {
        if (props) this.props = props

        cc.log("Creating NewCrowdFundToken");
        let self = this
        let _leasecontract = this.spender
        let _admin = "0x60516AA74F455f642C66FA1eD1e77C553da4be17"
        let hash = data["data"]["objectHash"]

        this.CrowdFundTokenContract.new(
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
                        newCrowdFundToken: {
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
                                        let newEvent = { event: "NewCrowdFundToken", ...res }
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

    // ldGetRaised = (objectID) => {
    //     cc.log(`Calling Total Raised.`);
    //     return this.CrowdFundData.getRaised(objectID)
    //         .then(result => {
    //             cc.log(`getRaised RESULT: ${result[0].toNumber()}`);
    //             return {
    //                 id: objectID,
    //                 result: {
    //                     totalRaised: result[0].toNumber()
    //                 }
    //             }
    //         })
    // }

    // lease token object methods:

    ltBalanceOf = (objectID, account, address) => {
        cc.log(`Fetching Lease Token Balance Of: `);

        return this.CrowdFundTokenContract.at(address).balanceOf(account)
            .then(result => {
                cc.log(`EV TOKENS: ${result[0].toString()}`);
                // this.setState({ ["evToken_" + objectID]: result[0].toString() })
                return { id: objectID, result: result[0].toString() }
            })
    }

    ltTotalSupply = (objectID, address) => {
        cc.log(`Fetching Lease Token Total Supply: `);

        return this.CrowdFundTokenContract.at(address).totalSupply()
            .then(result => {
                cc.log(`TOTAL SUPPLY: ${result[0].toString()}`);
                return { id: objectID, result: result[0].toString() }
            })
    }
}

const contract = new Contract()
export default contract