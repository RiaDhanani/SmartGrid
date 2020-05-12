pragma solidity ^0.4.17;

contract NRG{
   
    struct ProducerStruct{
        uint8 CPU;
        uint16 energyRemaining;
        uint16 totalEP;
        uint16 storageCapacity;
        uint16 productionCapacity;//Total Energy Produced
        uint32 MoneyBalance; //Wallet used instead of Metamask amount
    }
   
    struct ProviderStruct{
        uint8 clusterNumber; //cluster number designated to the provider
        uint8 CPU;
        uint16 energyRemaining;
        uint16 storageCapacity;
        uint32 MoneyBalance; //Wallet used instead of Metamask amount
    }
   
    struct ConsumerStruct{
        uint8 CPU;
        uint8 clusterNumber; //cluster number to identify the provider
        uint16 energyRemaining;
        uint16 productionCapacity;
        uint16 totalEP;
        uint16 TotalEC; //Total Energy Consumed
        uint16 storageCapacity;
        uint32 MoneyBalance; //Wallet used instead of Metamask amount
       
    }
   
    mapping (address=>ProducerStruct) producer;
    mapping (address=>ProviderStruct) provider;
    mapping (address=>ConsumerStruct) consumer;
    mapping (address=>uint8) public Entity;
   
    
   
    modifier CheckIfEntityAlreadyRegistered(address _addr){
        require(Entity[_addr]==0);
        _;
    }

    event EnergySent(address from, address to, uint energy);
    event EnergyDemanded(address from, address to, uint energy);
    event EnergyProduced(uint energy);
   
    function getEntity() public view returns (uint8) {
        return (Entity[msg.sender]);
    }
   
    //initially setting balance of money as 0
    function addProducer (uint8 _CPU, uint16 _energyRemaining, uint16 _totalEP, uint16 _storageCapacity, uint16 _productionCapacity ) public CheckIfEntityAlreadyRegistered(msg.sender){
        producer[msg.sender] = ProducerStruct( _CPU, _energyRemaining, _totalEP, _storageCapacity, _productionCapacity, 0);
        Entity[msg.sender] = 1;
    }
   
   
    //initially setting balance of money as 0
    function addProvider (uint8 _clusterNumber, uint8 _CPU, uint16 _energyRemaining, uint16 _storageCapacity) public CheckIfEntityAlreadyRegistered(msg.sender){
        provider[msg.sender] = ProviderStruct(_clusterNumber,_CPU,_energyRemaining,_storageCapacity, 0);
        Entity[msg.sender] = 2;
    }
   
    //initially setting balance of money as 0
    function addConsumer(uint8 _CPU, uint8 _clusterNumber, uint16 _energyRemaining, uint16 _productionCapacity, uint16 _totalEP, uint16 _TotalEC, uint16 _storageCapacity) public CheckIfEntityAlreadyRegistered(msg.sender){
        consumer[msg.sender] = ConsumerStruct(_CPU, _clusterNumber, _energyRemaining, _productionCapacity, _totalEP, _TotalEC, _storageCapacity, 0);
        Entity[msg.sender] = 3;
    }
   
   
   
    function setCPU (uint8 _price) public {
       
        require(Entity[msg.sender]!=0);
       
        if (Entity[msg.sender] == 1){
            producer[msg.sender].CPU = _price;
        }else if(Entity[msg.sender] == 2){
            provider[msg.sender].CPU = _price;
        }else{
            consumer[msg.sender].CPU = _price;
        }
    }
   
    function getCPU (address _addr) public view returns (uint8) {
       
        if (Entity[_addr] == 1){
            return producer[_addr].CPU;
        }else if(Entity[_addr] == 2){
            return provider[_addr].CPU;
        }else{
            return consumer[_addr].CPU;
        }
    }

   
   
    function produceEnergy (uint16 _energy) public {
       
        require(Entity[msg.sender]==1||Entity[msg.sender]==3);
        uint16 remaningSpaceInStorage;
        if(Entity[msg.sender]==1){
            require(_energy<=producer[msg.sender].productionCapacity);
            remaningSpaceInStorage = producer[msg.sender].storageCapacity - producer[msg.sender].energyRemaining;
            if (remaningSpaceInStorage<_energy){
                producer[msg.sender].energyRemaining += remaningSpaceInStorage;
                producer[msg.sender].totalEP += remaningSpaceInStorage;
                EnergyProduced(_energy);
            }else{
                producer[msg.sender].energyRemaining += _energy;
                producer[msg.sender].totalEP += _energy;
                EnergyProduced(_energy);
            }
           
        }else{
            require(_energy<=consumer[msg.sender].productionCapacity);
            remaningSpaceInStorage = consumer[msg.sender].storageCapacity - consumer[msg.sender].energyRemaining;
            if (remaningSpaceInStorage<_energy){
                consumer[msg.sender].energyRemaining += remaningSpaceInStorage;
                consumer[msg.sender].totalEP += remaningSpaceInStorage;
                EnergyProduced(_energy);
            }else{
                consumer[msg.sender].energyRemaining += _energy;
                consumer[msg.sender].totalEP += _energy;
                EnergyProduced(_energy);
            }
        }
    }

    function getRemainingEnergy(address _addr) view public returns (uint16){
       
        if (Entity[_addr] == 1){
            return producer[_addr].energyRemaining;
        }else if(Entity[_addr] == 2){
            return provider[_addr].energyRemaining;
        }else{
            return consumer[_addr].energyRemaining;
        }
    }


    function getStorageCapacity(address _addr) view public returns (uint16){
       
        if (Entity[_addr] == 1){
            return producer[_addr].storageCapacity;
        }else if(Entity[_addr] == 2){
            return provider[_addr].storageCapacity;
        }else{
            return consumer[_addr].storageCapacity;
        }
    }
   
   
   
    function addMoneyToAccount(uint32 _amnt) public {
       
        if (Entity[msg.sender] == 1){
            producer[msg.sender].MoneyBalance += _amnt;
        }else if(Entity[msg.sender] == 2){
            provider[msg.sender].MoneyBalance += _amnt;
        }else{
            consumer[msg.sender].MoneyBalance += _amnt;
        }
       
    }
   
    function checkMoneyCPUEnergyBalance() public view returns (uint32, uint8, uint16) {
        if (Entity[msg.sender] == 1){
            return (producer[msg.sender].MoneyBalance, producer[msg.sender].CPU, producer[msg.sender].energyRemaining);
        }else if(Entity[msg.sender] == 2){
            return (provider[msg.sender].MoneyBalance, provider[msg.sender].CPU, provider[msg.sender].energyRemaining);
        }else{
            return (consumer[msg.sender].MoneyBalance, consumer[msg.sender].CPU, consumer[msg.sender].energyRemaining);
        }
    }
   
   
   function sendEnergyTo (uint16 _unitsOfEnergyToBeSent, address _addr) public {
       require(Entity[msg.sender]!=0);
        uint32 costForEnergy;
        uint16 remaningSpaceInStorage;
        if (Entity[msg.sender] == 1){
           remaningSpaceInStorage = provider[_addr].storageCapacity - provider[_addr].energyRemaining;
            if (remaningSpaceInStorage<_unitsOfEnergyToBeSent){
           
                costForEnergy = producer[msg.sender].CPU * remaningSpaceInStorage;
                require(provider[_addr].MoneyBalance>= costForEnergy);
               
                provider[_addr].energyRemaining += remaningSpaceInStorage;
                producer[msg.sender].energyRemaining -= remaningSpaceInStorage;
                producer[msg.sender].MoneyBalance += costForEnergy;
                provider[_addr].MoneyBalance -= costForEnergy;
                EnergySent(msg.sender, _addr, _unitsOfEnergyToBeSent);
               
            }else{
               
                costForEnergy = producer[msg.sender].CPU * _unitsOfEnergyToBeSent;
                require(provider[_addr].MoneyBalance>= costForEnergy);
               
                provider[_addr].energyRemaining += _unitsOfEnergyToBeSent;
                producer[msg.sender].energyRemaining -= _unitsOfEnergyToBeSent;
                provider[_addr].MoneyBalance -= costForEnergy;
                producer[msg.sender].MoneyBalance += costForEnergy;
                EnergySent(msg.sender, _addr, _unitsOfEnergyToBeSent);
            }
        }else if(Entity[msg.sender] == 2){
            remaningSpaceInStorage = consumer[_addr].storageCapacity - consumer[_addr].energyRemaining;
            if (remaningSpaceInStorage<_unitsOfEnergyToBeSent){
               
                costForEnergy = provider[msg.sender].CPU * remaningSpaceInStorage;
                require(consumer[_addr].MoneyBalance>= costForEnergy);
               
                consumer[_addr].energyRemaining += remaningSpaceInStorage;
                provider[msg.sender].energyRemaining -= remaningSpaceInStorage;
                provider[msg.sender].MoneyBalance += costForEnergy;
                consumer[_addr].MoneyBalance -= costForEnergy;
                EnergySent(msg.sender, _addr, _unitsOfEnergyToBeSent);
               
            }else{
                costForEnergy = provider[msg.sender].CPU * _unitsOfEnergyToBeSent;
                require(consumer[_addr].MoneyBalance>= costForEnergy);
               
                consumer[_addr].energyRemaining += _unitsOfEnergyToBeSent;
                provider[msg.sender].energyRemaining -= _unitsOfEnergyToBeSent;
                consumer[_addr].MoneyBalance -= costForEnergy;
                provider[msg.sender].MoneyBalance += costForEnergy;
                EnergySent(msg.sender, _addr, _unitsOfEnergyToBeSent);
            }
           
           
        }else{
            remaningSpaceInStorage = consumer[_addr].storageCapacity - consumer[_addr].energyRemaining;
            if (remaningSpaceInStorage<_unitsOfEnergyToBeSent){
               
                costForEnergy = consumer[msg.sender].CPU * remaningSpaceInStorage;
                require(consumer[_addr].MoneyBalance>= costForEnergy);
               
                consumer[_addr].energyRemaining += remaningSpaceInStorage;
                consumer[msg.sender].energyRemaining -= remaningSpaceInStorage;
                consumer[msg.sender].MoneyBalance += costForEnergy;
                consumer[_addr].MoneyBalance -= costForEnergy;
                EnergySent(msg.sender, _addr, _unitsOfEnergyToBeSent);
               
            }else{
                costForEnergy = consumer[msg.sender].CPU * _unitsOfEnergyToBeSent;
                require(consumer[_addr].MoneyBalance>= costForEnergy);
               
                consumer[_addr].energyRemaining += _unitsOfEnergyToBeSent;
                consumer[msg.sender].energyRemaining -= _unitsOfEnergyToBeSent;
                consumer[_addr].MoneyBalance -= costForEnergy;
                consumer[msg.sender].MoneyBalance += costForEnergy;
                EnergySent(msg.sender, _addr, _unitsOfEnergyToBeSent);
            }
            
        }
       
   }
   
    function demandEnergy(uint16 _unitsOfEnergyRequested, address _addr) public {
       
        require(Entity[msg.sender]!=0 || Entity[msg.sender] != 1);
        uint32 costForEnergy;
        uint16 remaningSpaceInStorage;
        if (Entity[msg.sender] == 2){
           remaningSpaceInStorage = provider[msg.sender].storageCapacity - provider[msg.sender].energyRemaining;
            if (remaningSpaceInStorage<_unitsOfEnergyRequested){
           
                costForEnergy = producer[_addr].CPU * remaningSpaceInStorage;
                require(provider[msg.sender].MoneyBalance>= costForEnergy);
               
                provider[msg.sender].energyRemaining += remaningSpaceInStorage;
                producer[msg.sender].energyRemaining -= remaningSpaceInStorage;
                producer[_addr].MoneyBalance += costForEnergy;
                provider[msg.sender].MoneyBalance -= costForEnergy;
                EnergyDemanded(msg.sender, _addr, _unitsOfEnergyRequested);
               
            }else{
               
                costForEnergy = producer[_addr].CPU * _unitsOfEnergyRequested;
                require(provider[msg.sender].MoneyBalance>= costForEnergy);
               
                provider[msg.sender].energyRemaining += _unitsOfEnergyRequested;
                producer[_addr].energyRemaining -= _unitsOfEnergyRequested;
                provider[msg.sender].MoneyBalance -= costForEnergy;
                producer[_addr].MoneyBalance += costForEnergy;
                EnergyDemanded(msg.sender, _addr, _unitsOfEnergyRequested);
            }
        }else{
            remaningSpaceInStorage = consumer[msg.sender].storageCapacity - consumer[msg.sender].energyRemaining;
            if (remaningSpaceInStorage<_unitsOfEnergyRequested){
               
                costForEnergy = provider[_addr].CPU * remaningSpaceInStorage;
                require(consumer[msg.sender].MoneyBalance>= costForEnergy);
               
                consumer[msg.sender].energyRemaining += remaningSpaceInStorage;
                provider[_addr].energyRemaining -= remaningSpaceInStorage;
                provider[_addr].MoneyBalance += costForEnergy;
                consumer[msg.sender].MoneyBalance -= costForEnergy;
                EnergyDemanded(msg.sender, _addr, _unitsOfEnergyRequested);
               
            }else{
                costForEnergy = provider[_addr].CPU * _unitsOfEnergyRequested;
                require(consumer[msg.sender].MoneyBalance>= costForEnergy);
               
                consumer[msg.sender].energyRemaining += _unitsOfEnergyRequested;
                provider[_addr].energyRemaining -= _unitsOfEnergyRequested;
                consumer[msg.sender].MoneyBalance -= costForEnergy;
                provider[_addr].MoneyBalance += costForEnergy;
                EnergyDemanded(msg.sender, _addr, _unitsOfEnergyRequested);
            }
           
           
        }
       
    }
   
    function consumeEnergy (uint16 _uintsOfEnergyConsumed) public {
        require(Entity[msg.sender]==3);
        consumer[msg.sender].energyRemaining -= _uintsOfEnergyConsumed;
        consumer[msg.sender].TotalEC += _uintsOfEnergyConsumed;
    }
   
   
}

