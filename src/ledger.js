/**
|--------------------------------------------------
| Ledger Nano device Handler
| Author: Sadeesh Radhakrishnan
|--------------------------------------------------
*/
import ledger from 'ledgerco'
import BigNumber from 'bignumber.js';
import Tx from 'ethereumjs-tx';
import util from 'ethereumjs-util';

class Ledger {
    constructor() {
        this.apikey = "HEX6ZJP9JPRTD8K5XCR4YGREDM184MGEUM" // etherscan API KEY
        this.api = "ropsten" // 'ropsten' for test network, 'api' for live network
        this.chainId = 3 // 3 for ropsten test network, 1 for live network
        this.carLeaseContractAddress = "0x87B9E8f28de1b7E83c2C8ff05C3432B0734bbc94"
        this.funcHash = "0x0d1905d3" //first 32 bits of hashing ABI function name 0x0d1905d3 0000000000000000000000000000000000000000000000000000000000000001
        this.eth = null
        this.eths = []
        this.ethtx = []
        this.ethaddress = {}
        this.rawTx = null
        this.rawHex = null
        this.gasLimit = "21500" // smart contract gas limit is 21464
        this.gasPrice = "21000000000"
        this.signedTx = null
        this.signedHex = null
    }

    connect = (cb) => {
        ledger
            .comm_u2f
            .create_async(0, true)
            .then(function (comm) {
                console.log(comm)
                return comm
            })
            .then((comm) => {
                let eth = new ledger.eth(comm)
                console.log(eth)
                this.eth = eth
                setTimeout(() => {
                    this.getAddress(() => cb(this.eths))
                }, 1000);
            })
            .catch(function (reason) {
                console.log('An error occured: ', reason)
            })
    }

    getAddress = (cb) => {
        console.log("LIST OF ETHEREUM ADDRESSES: ");
        console.log("=============================");
        let self = this
        let ethBip32 = "44'/60'/0'/";
        let addresses = []
        for (let i = 0; i < 5; i++) {
            this.eth.getAddress_async(ethBip32 + i).then(
                function (result) {
                    console.log(i + ". BIP32: ", ethBip32 + i + "  Address: " + result.address);
                    addresses.push(result.address)
                    self.getTransactionCount(ethBip32 + i, result.address)
                    if (i === 4) self.getBalance(addresses, () => cb(1))

                }).fail(
                function (error) {
                    console.log(error);
                });
        }
    }

    getBalance(addresses, cb) {
        let self = this
        let url = "https://" + this.api + ".etherscan.io/api?module=account&action=balancemulti&address=" + addresses.join() + "&tag=latest&apikey=" + this.apikey;
        console.log(url);
        fetch(url)
            .then(result => result.json())
            .then(balance => {
                self.eths = balance.result
                console.log("Balance: ", self.eths)
                cb(1)
            })
    }

    getTransactionCount(bip32, address) {
        let self = this
        let url = "https://" + this.api + ".etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=" + address + "&tag=latest&apikey=" + this.apikey;
        fetch(url)
            .then(result => result.json())
            .then(txcount => {
                // console.log("count: ", txcount);
                this.ethaddress[address]= {
                    bip32: bip32,
                    nonce: txcount.result
                }
                console.log("addr",this.ethaddress);
            })
    }

    genRawTransaction = (id, address, value, cb) => {
        var dataId = util.bufferToHex(util.setLengthLeft(id, 32)).substring(2) //left padding 256 bits for parameter ie 32 bytes
        
        var weiValue = this.toWei(value);
        console.log(weiValue);
        console.log(this.ethaddress[address]);
        var rawTx = {
            to: this.carLeaseContractAddress,
            value: this.toHex(weiValue),
            gasLimit: this.toHex(this.gasLimit),
            gasPrice: this.toHex(this.gasPrice),
            nonce: this.ethaddress[address].nonce || 0,
            chainId: this.chainId,
            data: this.funcHash + dataId
        };

        console.log("Raw Trx: ", rawTx);

        var tx = new Tx(rawTx);
        tx.raw[6] = Buffer.from([this.chainId]);
        tx.raw[7] = tx.raw[8] = 0;
        tx.raw.slice(0, 6);
        console.log("Raw Tr Gen: ", tx.raw);

        var encTx = util.rlp.encode(tx.raw).toString('hex')
        console.log("Raw Trx Hex: ", encTx);
        this.genSignedTransaction(this.ethaddress[address].bip32,rawTx, encTx, (response) => cb(response))
    }

    genSignedTransaction = (bip32, rawTx, encTx, cb) => {

        var self = this;

        this.eth.signTransaction_async(bip32, encTx)
            .then(function (result) {
                console.log(result);

                rawTx.v = "0x" + result["v"];
                rawTx.r = "0x" + result['r'];
                rawTx.s = "0x" + result['s'];
                var signedTx = new Tx(rawTx);
                console.log("Signed Transaction: ", signedTx);
                if (signedTx.verifySignature()) {
                    console.log('Signature Checks out!')
                }
                var signedHex = util.rlp.encode(signedTx.raw).toString('hex')
                console.log("Signed Trx Hex: ", "0x" + signedHex);
                self.pushSignedTransaction(signedHex, (response) => cb(response))
            })
            .fail(function (ex) { console.log(ex); });
    }

    pushSignedTransaction(signedHex, cb) {
        let url = "https://" + this.api + ".etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=" + signedHex + "&apikey=" + this.apikey;
        fetch(url)
            .then(result => result.json())
            .then(response => {
                console.log(response);
                cb(response)
            })
    }

    toHex = (dec) => "0x" + new BigNumber(dec).toString(16)

    toDecimal = (hex) => new BigNumber(hex).toString()

    toEther = (number) => {
        var ethValue = new BigNumber(number, 10).mul(1).round(0, BigNumber.ROUND_DOWN).div(1000000000000000000).toString(10);
        return ethValue.toString(10);
    };

    toWei = (number) => {
        var weiValue = new BigNumber(number).mul(1000000000000000000).round(0, BigNumber.ROUND_DOWN);
        console.log("wei value: ", weiValue.toString(10));
        return weiValue.toString(10);
    };
}

const ledgerApi = new Ledger()
export default ledgerApi
