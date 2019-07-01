pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Renting.sol";

contract TestRenting {
 // The address of the renting contract to be tested
 Renting renting = Renting(DeployedAddresses.Renting());

 function testUserCanRentCar() public {
  uint returnedId = renting.rent(expectedCarId);

  Assert.equal(returnedId, expectedCarId, "Renting of the expected car should match what is returned.");
}
function testGetRentAddressByCarId() public {
  address renter = renting.renters(expectedCarId);

  Assert.equal(renter, expectedRenter, "Renter of the expected car should be this contract");
}
function testGetRenterAddressByCarIdInArray() public {
  // Store adopters in memory rather than contract's storage
  address[16] memory renters = renting.getRenters();

  Assert.equal(renters[expectedCarId], expectedRenter, "Owner of the expected car should be this contract");
}

 // The id of the pet that will be used for testing
 uint expectedCarId = 8;

 //The expected owner of adopted pet is this contract
 address expectedRenter = address(this);

}