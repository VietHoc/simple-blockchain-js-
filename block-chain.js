const hash = require('crypto-js/sha256');


class Block {

  constructor(prevHash, data) {
    this.prevHash = prevHash;
    this.data = data;
    this.timestamp = new Date();
    this.hash = this.calculateHash();
    this.mineVar = 0
  }

  calculateHash() {
    return hash(this.prevHash + JSON.stringify(this.data) + this.timestamp + this.mineVar).toString();
  }

  mine(difficulty) {
    while (!this.hash.startsWith('0'.repeat(difficulty))) {
      this.mineVar++
      this.hash = this.calculateHash()
    }
  }
}

class BlockChain {
  constructor(difficulty) {
    const genesisBlock = new Block('0000', {
      isGenesisBlock: true
    })
    this.difficulty = difficulty
    this.chain = [genesisBlock];
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const lastBlock = this.getLastBlock()
    const newBlock = new Block(lastBlock.hash, data)
    console.log('Start mining')
    console.time('mine')
    newBlock.mine(this.difficulty)
    console.timeEnd('mine')
    console.log('End mining:', newBlock)
    this.chain.push(newBlock)
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const prevHash = this.chain[i - 1]
      if (currentBlock.hash != currentBlock.calculateHash()) {
        return false
      }

      if (currentBlock.prevHash != prevHash.hash) {
        return false
      }
    }
    return true
  }
}

const hocBlockChain = new BlockChain(5);

hocBlockChain.addBlock({
  from: 'tom',
  to: 'jerry',
  amount: 100
})
hocBlockChain.addBlock({
  from: 'tom',
  to: 'jerry1',
  amount: 400
})
hocBlockChain.addBlock({
  secret: 'xxxxxxxx'
})

console.log(hocBlockChain);
console.log('Is valid: ', hocBlockChain.isValid());

hocBlockChain.chain[1].data = {
  from: 'tom',
  to: 'jerry',
  amount: 50
}
hocBlockChain.chain[1].hash = hocBlockChain.chain[1].calculateHash()

console.log('Is valid: ', hocBlockChain.isValid());