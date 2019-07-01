App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    
    $.getJSON('../cars.json', function(data) {
      var carRows = $('#carRows');
      var carTemplate = $('#carTemplate');

      for (i = 0; i < data.length; i ++) {
        carTemplate.find('.panel-title').text(data[i].name);
        carTemplate.find('img').attr('src', data[i].picture);
        carTemplate.find('.car-transmission').text(data[i].transmission);
        carTemplate.find('.car-age').text(data[i].age);
        carTemplate.find('.car-location').text(data[i].location);
        carTemplate.find('.btn-rent').attr('data-id', data[i].id);

        carRows.append(carTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Renting.json', function(data) {
  // Get the necessary contract artifact file and instantiate it with truffle-contract
  var RentingArtifact = data;
  App.contracts.Renting = TruffleContract(RentingArtifact);

  // Set the provider for our contract
  App.contracts.Renting.setProvider(App.web3Provider);

  // Use our contract to retrieve and mark the adopted cars
  return App.markRented();
});

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-rent', App.handleRent);
  },

  markRented: function(renters, account) {
    var rentingInstance;

App.contracts.Renting.deployed().then(function(instance) {
  rentingInstance = instance;

  return rentingInstance.getRenters.call();
}).then(function(renters) {
  for (i = 0; i < renters.length; i++) {
    if (renters[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-car').eq(i).find('button').text('Zauzeto').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});
  },

  handleRent: function(event) {
    event.preventDefault();

    var carId = parseInt($(event.target).data('id'));

    var rentingInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.Renting.deployed().then(function(instance) {
    rentingInstance = instance;

    // Execute adopt as a transaction by sending account
    return rentingInstance.rent(carId, {from: account});
  }).then(function(result) {
    return App.markRented();
  }).catch(function(err) {
    console.log(err.message);
  });
});
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
