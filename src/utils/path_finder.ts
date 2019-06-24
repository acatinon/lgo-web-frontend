
import { crypto, address } from "bitcoinjs-lib";
import * as bip32 from "bip32";
import NodeRSA from "node-rsa";

class NodeData {
  publicKey: string;
  bitcoinAddress: string;
  chainCode: string
}

let network = {
  apiName: "btc",
  unit: "BTC",
  name: "bitcoin",
  satoshi: 8,
  bitcoinjs: {
    bech32: "bc",
    bip32: {
      private: 76066276,
      public: 76067358
    },
    messagePrefix: "Bitcoin Signed Message:",
    pubKeyHash: 0,
    scriptHash: 5,
    wif: 128
  },
  isSegwitSupported: true,
  handleFeePerByte: true
};

function parseHexString(str: string): Number[] {
  var result: Number[] = [];
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }
  return result;
}

export const toPrefixBuffer = (network: any) => {
  return {
    ...network,
    messagePrefix: Buffer.concat([
      Buffer.from([network.messagePrefix.length + 1]),
      Buffer.from(network.messagePrefix + "\n", "utf8")
    ]).toString("hex")
  };
};

function compressPublicKey(publicKey: string) {
  var compressedKeyIndex;
  if (publicKey.substring(0, 2) !== "04") {
    throw "Invalid public key format";
  }
  if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
    compressedKeyIndex = "03";
  } else {
    compressedKeyIndex = "02";
  }
  var result = compressedKeyIndex + publicKey.substring(2, 66);
  return result;
}

export async function getPublicKey(btc: any, purpose: string, coin: string, account: string): Promise<string> {
  var prevPath = purpose + "/" + coin;

  let nodeData: NodeData = await btc.getWalletPublicKey(prevPath);
  const key = new NodeRSA();

  key.importKey(
    {
      n: Buffer.from(nodeData.publicKey),
      e: 3
    },
    'components-public'
  );

  return key.exportKey('pkcs8-public');
}

/*
export async function initialize(btc, purpose, coin, account, segwit): Promise<string> {
  var prevPath = purpose + "/" + coin;

  const finalize = async fingerprint => {
    var path = prevPath + "/" + account;
    let nodeData = await btc.getWalletPublicKey(path);
    var publicKey = compressPublicKey(nodeData.publicKey);
    var childnum = (0x80000000 | account) >>> 0;
    var xpub = createXPUB(
      3,
      fingerprint,
      childnum,
      nodeData.chainCode,
      publicKey,
      network.bitcoinjs.bip32.public
    );
    return encodeBase58Check(xpub);
  };

  let nodeData = await btc.getWalletPublicKey(prevPath);
  var publicKey = compressPublicKey(nodeData.publicKey);
  publicKey = parseHexString(publicKey);
  var result = crypto.sha256(publicKey);
  result = crypto.ripemd160(result);
  var fingerprint = ((result[0] << 24) | (result[1] << 16) | (result[2] << 8) | result[3]) >>> 0;

  return finalize(fingerprint);
};


export var findPath = async (params, onUpdate, onDone, onError) => {
  if (typeof Worker !== "undefined") {
    var derivationWorker = new Worker("./workers/DerivationWorker.js");
  } else {
    onError("You need to use Google Chrome");
  }
  if (!params.useXpub) {
    try {
      let xpub58 = await initialize(
        parseInt(params.coin, 10),
        params.segwit ? "49'" : "44'",
        parseInt(params.coinPath, 10) + "'",
        parseInt(params.account, 10) + "'",
        params.segwit
      );
      params.xpub58 = xpub58;
      console.log("success initialized", xpub58);
    } catch (e) {
      throw "Verify that your device is plugged in, unlocked, and that the correct app is open with the browser support on";
    }
  }
  params.network = toPrefixBuffer(network.bitcoinjs);

  derivationWorker.onmessage = event => {
    onUpdate(event.data.response);
    if (event.data.done) {
      onDone();
    }
    if (event.data.failed) {
      onError("The address is not from this account");
    }
  };
  derivationWorker.onerror = error => {
    onError("Derivation error: " + error.message);
    derivationWorker.terminate();
  };
  derivationWorker.postMessage(params);
  return () => {
    derivationWorker.terminate();
  };
};

export var findAddress = async (path, segwit, xpub58) => {
  var script = segwit
    ? network.bitcoinjs.scriptHash
    : network.bitcoinjs.pubKeyHash;
  var hdnode = bip32.fromBase58(
    xpub58,
    toPrefixBuffer(network.bitcoinjs)
  );
  var pubKeyToSegwitAddress = (pubKey, scriptVersion, segwit) => {
    var script = [0x00, 0x14].concat(
      Array.from(crypto.hash160(pubKey))
    );
    var hash160 = crypto.hash160(Buffer.from(script));
    return address.toBase58Check(hash160, scriptVersion);
  };

  var getPublicAddress = (hdnode: bip32.BIP32Interface, path, script, segwit) => {
    hdnode = hdnode.derivePath(
      path
        .split("/")
        .splice(3, 2)
        .join("/")
    );
    if (!segwit) {
      return hdnode.publicKey;
    } else {
      return pubKeyToSegwitAddress(hdnode.getPublicKeyBuffer(), script, segwit);
    }
  };
  try {
    return await getPublicAddress(hdnode, path, script, segwit);
  } catch (e) {
    throw e;
  }
};
*/