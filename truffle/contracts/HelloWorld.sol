pragma solidity ^0.5.8;

contract HelloWorld {
    string myName = "Austin";

    function getMyName() public view returns(string memory) {
        return myName;
    }

    function changeMyName(string memory _newName) public {
        myName = _newName;
    }
}