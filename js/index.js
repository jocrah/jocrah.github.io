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

  const url = "https://free.currencyconverterapi.com/api/v5/currencies";

  function createNode(element){
    return document.createElement(element);
  }

  function append(parent, el){
    return parent.appendChild(el);
  }

  window.onload= function(){
    const fromSelect = document.getElementById('from-select');
    const toSelect = document.getElementById('to-select');
    fetch(url)
    .then((response)=>response.json())
    .then(function(data){
      let currencies = data.results;
      for(key in currencies){
        let fromOption = createNode('option'),
            toOption = createNode('option');
        
        fromOption.innerHTML = `${currencies[key].currencyName}`;
        toOption.innerHTML = `${currencies[key].currencyName}`;
        append(fromSelect,fromOption);
        append(toSelect, toOption);
      }
    })
  .catch(function(error){
    console.log(error);
  });
  };
 
