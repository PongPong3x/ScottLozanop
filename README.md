# Art Market

* See the site deployed here: https://artmarket.netlify.app
* See the site walkthrough here: https://www.loom.com/share/dd5886c281654d8d9a93e07b13fe23bf

## Objectives

1) Should allow only creator to log in and upload content to her marketplace page. To achieve this this app uses nextauth simple credentials. 

 TBD Uses credentials stored in .env Server-side access control not exceptionally secure. Need to base this on NFT ownership validation like BAYC. Not yet implemented.


2) When a user purchases an item, the purchase price will be transferred from the buyer to the seller (the artist in this case should be the only one who can create) and the item will be transferred from the marketplace to the buyer.

3) The marketplace owner will be able to set a listing fee. This fee will be taken from the seller and transferred to the contract owner upon completion of any sale, enabling the owner of the marketplace to earn recurring revenue from any sale transacted in the marketplace.

4) Users can search on the homepage by querying the GraphQL (TBD) Not implemented in this project.


## Installing Dependencies:

1. Clone repository
2. Run "npm install" for all dependencies
3. 
4. Compile contracts with "npx hardhat compile" to generate the artifacts
5. In config.js, populate the following variables with the deployed address of all the contracts and the testnet or mainnet of your choice where deployed. This example uses infura:
    - export const nftmarketaddress = "0x..."
    - export const nftaddress = "0x..."
    - export const rpc_url = "https://polygon-mumbai.infura.io/v3/{projectIDHere}"

## Accessing Project

1. In project directory, spin up a hardhat node: npx hardhat node
2. Create file ".secret" with a private key of the address 0 from the node terminal window
3. In seperate terminal window, run command npx hardhat run scripts/deploy.js --network mumbai
4. Run "npm run dev"  in terminal
5. Navigate to localhost in your browser
6. You will not be able to sign in without creating a .env file with the following three parameters( make the URL localhost and the username and password of your choice. Password needs to be between quotations to work):

    - NEXTAUTH_URL=
    - NEXTAUTH_USERNAME=
    - NEXTAUTH_PASSWORD=""

7. Import a few accounts including account 0 from the node running into metamask to test.
8. Don't forget to log out before switching addresses to test purchasing. Otherwise, any address can create items. 

## For Local Development/Deployment
1. In Pages docs create-item, index, my-assets and creator-dashboard, replace the two import statements with the path to the .json files for both contracts in your artifacts directory after compiling. The Import paths to replace will resemble '../artifacts/contracts/Market.sol/NFTMarket.json' Below are the import statements to change:
    
    -import NFT from './NFT.json'
    -import Market from './NFTMarket.json'

2. After changing the import path, you can delete NFT.json and NFTMarket.json in the pages directory

## Running Unit Tests

1. In terminal, in root directory, run npx hardhat test
2. Tests should be running on port 8545


 # Ethereum address: 0x9E3A3d7A89B23F01f19E22f5C2601ed0D5cD7C88


-----------------------------------------------------------------------------------------------------------------------------
