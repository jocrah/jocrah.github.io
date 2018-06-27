// where the ES6 magic should happen
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(function(reg) {
      // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  }

  const BASE_URL = "https://free.currencyconverterapi.com/api/v5/";

  function createNode(element){
    return document.createElement(element);
  }

  function append(parent, el){
    return parent.appendChild(el);
  }

  window.onload= function(){
    const fromSelect = document.getElementById('from-select');
    const toSelect = document.getElementById('to-select');
    const inputAmount = document.getElementById('input-amount');
    const outputAmount = document.getElementById('output-amount');

    fetch(BASE_URL+"currencies")
    .then((response)=>response.json())
    .then(function(data){
      let currencies = data.results;
      for(key in currencies){
        let fromOption = createNode('option'),
            toOption = createNode('option');
        
        fromOption.innerHTML = `${currencies[key].currencyName}`;
        fromOption.value = `${key}`;
        toOption.innerHTML = `${currencies[key].currencyName}`;
        toOption.value = `${key}`;
        append(fromSelect,fromOption);
        append(toSelect, toOption);
      }
    })
  .catch(function(error){
    console.log(error);
  });

  let button = this.document.getElementById('convert');
  button.addEventListener('click', function(){
    

    let convParameters='';
    //build parameters
    let amount = parseFloat(inputAmount.value);
    
    let inputSelect = fromSelect.options[fromSelect.selectedIndex].value;
    console.log(inputSelect);
    let outputSelect = toSelect.options[toSelect.selectedIndex].value;
    let valid = (inputSelect !=='' && outputSelect!==''&&inputSelect!==null && outputSelect!==null);
    console.log(valid);
    if(valid==true){
      convParameters = `convert?q=${inputSelect}_${outputSelect}`;
      fetch(BASE_URL+convParameters)
      .then((response)=>response.json())
      .then(function(data){
        let conv = data.results;
        if(!isNaN(amount)){
          let new_amount = amount*conv[`${inputSelect}_${outputSelect}`].val;
          outputAmount.value = new_amount;
        }else{
          console.log('No amount specified or NaN');
        }
        
      })
    .catch(function(error){
      console.log(error);
    });
    }
  });

  };
 
