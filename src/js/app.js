App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  ENTT:null,
  currentAccount:null,
  transaction:0,
  flag:false,
  
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    }
    web3 = new Web3(App.web3Provider);
    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('NRG.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
        var voteArtifact = data;
        App.contracts.vote = TruffleContract(voteArtifact);

    // Set the provider for our contract
        App.contracts.vote.setProvider(App.web3Provider);
        
        App.currentAccount = web3.eth.coinbase;
        jQuery('#current_account').text("Current account : "+web3.eth.coinbase);
        jQuery('#curr_account').text(web3.eth.coinbase);
        App.getENTT();
	return App.bindEvents();

      });
  },


  bindEvents : function(){
  
  $(document).on('click', '#reg_prod_sol', function(){ 
  App.addProducer(jQuery('#CPU').val(),jQuery('#energyRemaining').val(),jQuery('#totalEP').val(),jQuery('#storageCapacity').val(),jQuery('#productionCapacity').val()); 
	});

  $(document).on('click', '#reg_provid_sol', function(){ 
  App.addProvider(jQuery('#cluster_no').val(),jQuery('#CPU').val(),jQuery('#energyRemaining').val(),jQuery('#storageCapacity').val()); 
	});
  
  $(document).on('click', '#reg_cons_sol', function(){ 
    App.addConsumer(jQuery('#CPU').val(),jQuery('#cluster_no').val(),jQuery('#energyRemaining').val(),jQuery('#productionCapacity').val(),jQuery('#totalEP').val(),jQuery('#totalEC').val(),jQuery('#storageCapacity').val()); 
    });

  },
   
 
  populateAddress : function(){ 
 
    new Web3(new Web3.providers.HttpProvider('http://localhost:9545')).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){
        var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_create_address').append(optionElement);
          if(web3.eth.coinbase != accounts[i]){
            jQuery('#enter_send_address').append(optionElement);  
          }
      });
    });
  },



  getENTT : function(){
    App.contracts.vote.deployed().then(function(instance) {
      return instance.getEntity();
    }).then(function(result) {
      App.ENTT = result.toNumber();
      console.log("This is now the Entity variable :"+App.ENTT);
      jQuery('#ENTT').text("Entity : "+result.toNumber());
      if(App.ENTT == 1){
        window.location.replace("ProducerPage.html");
      	console.log("This is the entity 1 if condition");
      }
      else if(App.ENTT == 2){
        window.location.replace("ProviderPage.html");
        console.log("This is the entity 2 if condition");
      }
      else if(App.ENTT == 3){
        window.location.replace("ConsumerPage.html");
        console.log("This is the entity 3 if condition");
      }
      
    })
    
  },
  
  
  
  
  addProducer : function(cpu, nrgrm, totalep, sc, pc){
  var nrginstance;
  App.contracts.vote.deployed().then(function(instance){
  	nrginstance = instance;
  	return nrginstance.addProducer(cpu, nrgrm, totalep, sc, pc);
  	}).then(function(result){
  	if(result.receipt.status == '0x01')
  	{
	  	alert(App.currentAccount+" has been added as Producer successfully ");
	  	alert("Entity of "+App.currentAccount+" is "+nrginstance.getEntity().toNumber());
  	 }
 	else
  	{
  		alert("Creation failed");
  	}	
  	}).catch(function(err){
        console.log(err.message);
      })
  	
  },
  
  
  
  addProvider : function(clno, cpu, nrgrm, sc){
  var nrginstance;
  App.contracts.vote.deployed().then(function(instance){
  	nrginstance = instance;
  	return nrginstance.addProvider(clno, cpu, nrgrm, sc);
  	}).then(function(result){
  	if(result.receipt.status == '0x01')
  	{
	  	alert(App.currentAccount+" has been added as Provider successfully ");
	  	alert("Entity of "+App.currentAccount+" is "+nrginstance.getEntity().toNumber());
  	 }
 	else
  	{
  		alert("Creation failed");
  	}	
  	}).catch(function(err){
        console.log(err.message);
      })
  	
  },

  addConsumer : function(cpu, clno, nrgrm, pc, totalep, totalec, sc){
    var nrginstance;
    App.contracts.vote.deployed().then(function(instance){
      nrginstance = instance;
      return nrginstance.addConsumer(cpu, clno, nrgrm, pc, totalep, totalec, sc);
      }).then(function(result){
      if(result.receipt.status == '0x01')
      {
        alert(App.currentAccount+" has been added as Consumer successfully ");
        alert("Entity of "+App.currentAccount+" is "+nrginstance.getEntity().toNumber());
       }
     else
      {
        alert("Creation failed");
      }	
      }).catch(function(err){
          console.log(err.message);
        })
      
    }



  
};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
