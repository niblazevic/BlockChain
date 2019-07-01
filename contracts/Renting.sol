pragma solidity ^0.5.0;

contract Renting {

address[16] public renters;

function rent(uint carId) public returns (uint) {
  require(carId >= 0 && carId <= 15);

  renters[carId] = msg.sender;

  return carId;
}

function getRenters() public view returns (address[16] memory) {
  return renters;
}

}