App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  ENTT:null,
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

};
  

  var x = 40;
  var y = 20;//$("#remainingEnergy").val();
  
  var data = [
    {name: "Stored", value: x},
    {name: "Free", value: y}
  ];
  var text = "";
  
  
  var width = 260;
  var height = 260;
  var thickness = 40;
  var duration = 750;
  
  var radius = Math.min(width, height) / 2;
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  
  var svg = d3.select("#chart")
  .append('svg')
  .attr('class', 'pie')
  .attr('width', width)
  .attr('height', height);
  
  var g = svg.append('g')
  .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');
  
  var arc = d3.arc()
  .innerRadius(radius - thickness)
  .outerRadius(radius);
  
  var pie = d3.pie()
  .value(function(d) { return d.value; })
  .sort(null);
  
  var path = g.selectAll('path')
  .data(pie(data))
  .enter()
  .append("g")
  .on("mouseover", function(d) {
    let g = d3.select(this)
    .style("cursor", "pointer")
    .style("fill", "black")
    .append("g")
    .attr("class", "text-group");
    
    g.append("text")
    .attr("class", "name-text")
    .text(`${d.data.name}`)
    .attr('text-anchor', 'middle')
    .attr('dy', '-1.2em');
    
    g.append("text")
    .attr("class", "value-text")
    .text(`${d.data.value}`)
    .attr('text-anchor', 'middle')
    .attr('dy', '.6em');
  })
  .on("mouseout", function(d) {
    d3.select(this)
    .style("cursor", "none")
    .style("fill", color(this._current))
    .select(".text-group").remove();
  })
  .append('path')
  .attr('d', arc)
  .attr('fill', (d,i) => color(i))
  .on("mouseover", function(d) {
    d3.select(this)
    .style("cursor", "pointer")
    .style("fill", "black");
  })
  .on("mouseout", function(d) {
    d3.select(this)
    .style("cursor", "none")
    .style("fill", color(this._current));
  })
  .each(function(d, i) { this._current = i; });
  
  
  g.append('text')
  .attr('text-anchor', 'middle')
  .attr('dy', '.35em')
  .text(text);

