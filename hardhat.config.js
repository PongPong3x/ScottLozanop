require("@nomiclabs/hardhat-waffle")
const fs = require('fs')
const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789"


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    // hardhat: {
    //   chainId: 1337
    // },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/9a6356648ece4a32a0f10e75fc6552f6",
      accounts: [`0x${privateKey}`]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}