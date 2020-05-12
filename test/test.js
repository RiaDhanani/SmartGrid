let NRG = artifacts.require("./NRG.sol");

let NRGInstance;


contract('NRGContract', function (accounts) {
  
  it("contract deployment", function() {
    return NRG.deployed().then(function (instance) {
      NRGInstance = instance;
      assert(NRGInstance !== undefined, 'NRG contract should be defined');
    });
  });
  
  
  it("Initially the Entity should be Zero", function(){
  	return NRGInstance.getEntity().then(function (result){
  	assert.equal(0, result.toNumber(), 'Entity is Zero');
  	});
  
  });
  
  it("Should add producer", function(){
  	return NRGInstance.addProducer(5,0,0,1000,250).then(function (result){
  	assert.equal('0x01', result.receipt.status, 'Producer has been successfully created');
  	});
  
  });
  
  it("Once added the the Entity should be One", function(){
  	return NRGInstance.getEntity().then(function (result){
  	assert.equal(1, result.toNumber(), 'Entity is One');
  	});
  
  });
  
  it("Should add Provider", function(){
  	return NRGInstance.addProvider(1, 10, 0,2000, {from: accounts[1]}).then(function (result){
  	assert.equal('0x01', result.receipt.status, 'Provider has been successfully created');
  	});
  
  });
  
  it("Once added the the Entity should be Two", function(){
  	return NRGInstance.getEntity({from: accounts[1]}).then(function (result){
  	assert.equal(2, result.toNumber(), 'Entity is Two');
  	});
  
  });
  
  it("Should add Consumer", function(){
  	return NRGInstance.addConsumer(5, 1, 0,50, 0, 0, 200, {from: accounts[2]}).then(function (result){
  	assert.equal('0x01', result.receipt.status, 'Consumer has been successfully created');
  	});
  });
  
  it("Once added the the Entity should be Three", function(){
  	return NRGInstance.getEntity({from: accounts[2]}).then(function (result){
  	assert.equal(3, result.toNumber(), 'Entity is Three');
  	});
  
  });
  



  
  

});
