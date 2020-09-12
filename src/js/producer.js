App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  ENTT:null,
  storageCapacity:null,
  MoneyBalance:null,
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
  
    $(document).on('click', '#produce-energy', function(){ 
    App.produceEnergy(jQuery('#energy').val()); 
    });

    $(document).on('click', '#set-cpu', function(){ 
    App.setCPU(jQuery('#CPU').val()); 
    });

    $(document).on('click', '#checkCPU', function(){ 
    App.getCostPerUnit(jQuery('#adr').val()); 
    });
    
    $(document).on('click', '#add-crypto-coins', function(){ 
    App.addMoneyToAccount(jQuery('#amnt').val()); 
    });
        
    $(document).on('click', '#checkBalance', function(){ 
    App.checkMoneyCPUEnergyBalance(); 
    });
        
    $(document).on('click', '#checkRemaining', function(){ 
      App.getRemainingEnergy(jQuery('#adr').val()); 
      });

      $(document).on('click', '#checkSC', function(){ 
        App.getStorageCapacity(jQuery('#adr').val()); 
        });

    $(document).on('click', '#send_money', function(){ App.sendEnergyTo(jQuery('#send_amount').val(),jQuery('#enter_send_address').val()); }); 

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
      if(App.ENTT == 0){
        window.location.replace("index.html");
      	console.log("This is the entity 0 if condition");
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



  produceEnergy : function(energy){
    var nrginstance;
    App.contracts.vote.deployed().then(function(instance){
      nrginstance = instance;
      return nrginstance.produceEnergy(energy);
      }).then(function(result){
      if(result.receipt.status == '0x01')
      {
        //alert("Energy produced by producer : "+energy);
        for (var i = 0; i < result.logs.length; i++) {
            var log = result.logs[i];
        if (log.event == "EnergyProduced") {
          var text = 'Produced energy : ' + energy + ' by ' + web3.eth.coinbase;
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
       }
     else
      {
        alert("Creation failed");
      }	
      }).catch(function(err){
          console.log(err.message);
        })
      
    },


    setCPU : function(price){
      var nrginstance;
      App.contracts.vote.deployed().then(function(instance){
        nrginstance = instance;
        return nrginstance.setCPU(price);
        }).then(function(result){
        if(result.receipt.status == '0x01')
        {
          //alert("CPU added by producer : "+CPU);
          //alert("Entity of "+App.currentAccount+" is "+nrginstance.getEntity().toNumber());
          for (var i = 0; i < result.logs.length; i++) {
            var log = result.logs[i];
        if (log.event == "UpdatedCPU") {
          var text = 'Updated CPU : ' + price + ' by ' + web3.eth.coinbase;
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
         }
       else
        {
          alert("Creation failed");
        }	
        }).catch(function(err){
            console.log(err.message);
          })
        
      },
  
      getCostPerUnit : function(){
          var nrginstance;
          App.contracts.vote.deployed().then(function(instance){
            nrginstance = instance;
            return nrginstance.checkMoneyCPUEnergyBalance();
          }).then(function(result){
            App.CPU = result[1].toNumber(); 
            console.log(App.CPU);
          if(App.CPU === result[1].toNumber())
          {
            //alert("Producer Balance : "+App.MoneyBalance);
            $('#displayCPU').val(App.CPU);
          }
          else
          {
            alert("Creation failed");
          }	
          })
        },

      getRemainingEnergy : function(adr){
        adr = App.currentAccount;
        var nrginstance;
        App.contracts.vote.deployed().then(function(instance){
          nrginstance = instance;
          return nrginstance.getRemainingEnergy(adr);
          }).then(function(result){
         // if(result.receipt.status == '0x01')
          //{
            //alert("Remaining energy : "+result);
            $('#displayER').val(result);
           //}
         //else
          //{
            //alert("Creation failed");
          //}	
          }).catch(function(err){
              console.log(err.message);
            })
          
        },

        getStorageCapacity : function(adr){
          adr = App.currentAccount;
          var nrginstance;
          App.contracts.vote.deployed().then(function(instance){
            nrginstance = instance;
            return nrginstance.getStorageCapacity(adr);
            }).then(function(result){
           // if(result.receipt.status == '0x01')
            //{
              //alert("Storage capacity : "+result);
              $('#displaySC').val(result);
             //}
           //else
            //{
              //alert("Creation failed");
            //}	
            }).catch(function(err){
                console.log(err.message);
              })
            
          },

      addMoneyToAccount : function(amnt){
        var nrginstance;
        App.contracts.vote.deployed().then(function(instance){
          nrginstance = instance;
          return nrginstance.addMoneyToAccount(amnt);
          }).then(function(result){
          if(result.receipt.status == '0x01')
          {
            //alert("Cryptocoins added by producer : "+amnt);
            //alert("Entity of "+App.currentAccount+" is "+nrginstance.getEntity().toNumber());
            for (var i = 0; i < result.logs.length; i++) {
              var log = result.logs[i];
          if (log.event == "CryptocoinsAdded") {
            var text = 'Cryprtocoins Added : ' + amnt + ' by ' + web3.eth.coinbase;
            jQuery('#showmessage_text').html(text);
            jQuery('#show_event').animate({'right':'10px'});
            setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
            break;
          }
        }
           }
         else
          {
            alert("Creation failed");
          }	
          }).catch(function(err){
              console.log(err.message);
            })
          
        },



        checkMoneyCPUEnergyBalance : function(){
          var nrginstance;
          App.contracts.vote.deployed().then(function(instance){
          nrginstance = instance;
          return nrginstance.checkMoneyCPUEnergyBalance();
          }).then(function(result) {
            App.MoneyBalance = result[0].toNumber();
          if(App.MoneyBalance === result[0].toNumber())
          {
            //alert("Producer Balance : "+App.MoneyBalance);
            $('#displayBalance').val(App.MoneyBalance);
          }
          else
          {
            alert("Creation failed");
          }	
          }).catch(function(err){
          console.log(err.message);
          })
        },

        sendEnergyTo : function(value,addr) {
          if(addr == ""){
            alert("Please select an adrdess");
            return false;
          }
          if(value == ""){
            alert("Please enter valid amount");
            return false;
          }

          var nrginstance;
          App.contracts.vote.deployed().then(function(instance) {
            nrginstance = instance;
            return nrginstance.sendEnergyTo(value,addr);
          }).then( function(result){
            if(result.receipt.status == '0x01') {
              console.log(result);
              //alert("Transfer successful");
              for (var i = 0; i < result.logs.length; i++) {
                var log = result.logs[i];
                var singularText = "units of energy were";
                if(log.args.amount == 1){
                  singularText = "unit of energy was";
                }
              if (log.event == "EnergySent") {
                var text = 'Energy transfer: ' + value + " " +singularText + 
                    ' sent from ' + log.args.from +
                    ' to ' + log.args.to + '.';
                jQuery('#showmessage_text').html(text);
                jQuery('#show_event').animate({'right':'10px'});
                setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
                break;
              }
            }
          }
         }).catch( function(err){
        console.log(err.message);
      })
      },
  
  
  
};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
