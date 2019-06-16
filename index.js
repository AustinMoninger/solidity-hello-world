const fs = require('fs'); // Built-in dependency for file streaming.
const solc = require('solc'); // Our Solidity compiler
const Web3 = require('web3');

const input = fs.readFileSync('HelloWorld.sol'); // Read the file...
const output = solc.compile(input.toString(), 1); // ...and compile it!

// console.log(output); // Log the result

// Set up a provider
const provider = new Web3.providers.HttpProvider("http://localhost:8545");

// Connect to the network and save it as "web3"
const web3 = new Web3(provider);

// Get the compiled contract's interface and bytecode
// (we'll use the bytecode later)
const { interface, bytecode } = output.contracts[":HelloWorld"];

// Convert the interface into JSON
const abi = JSON.parse(interface);
 
// Initialize a new contract object:
const contract = new web3.eth.Contract(abi);

// console.log(contract)

const deployAndRunContract = async () => {
    // Get the addresses of testrpc's fake wallet:
    const addresses = await web3.eth.getAccounts();
    
    // Get the current price of gas
    const gasPrice = await web3.eth.getGasPrice();
  
    try {
      // Deploy the HelloWorld contract (its bytecode) 
      // by spending some gas from our first address
      const contractInstance = await contract.deploy({
        data: bytecode
      }).send({
        from: addresses[0],
        gas: 1000000,
        gasPrice,
      });
  
      console.log("Deployed at", contractInstance.options.address);
  
      // Call the "getMyName" function and log the result:
      const myName = await contractInstance.methods.getMyName().call();
      console.log("Result from blockchain:", myName);
      
    } catch (err) {
      console.log("Failed to deploy", err);
    }
  }
  
  deployAndRunContract(); // Call the function