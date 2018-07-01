// where the ES6 magic should happen




let currencies = null; // variable to keep currencies
const BASE_URL = "https://free.currencyconverterapi.com/api/v5/"; //Base url for free converter
let fromSelect;
let toSelect;
let inputAmount;
let outputAmount;
let dateRetrievedRight;
let dateRetrievedLeft;
let successButtonClick =false;


/**
 * Setting up database and object stores if not already set up
 */
let dbPromise = idb.open('c-converter-db', 2, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      let currencyStore = upgradeDb.createObjectStore('currencyStore', {
        keyPath: 'id'
      });
    case 1:
      let conversionStore = upgradeDb.createObjectStore('conversionStore', {
        keyPath: 'id'
      });
  }
});

/**
 * Register service worker if it exist
 */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => {
      // registration worked
      console.log(`Registration succeeded. Scope is ${reg.scope}`);
    }).catch(error => {
      // registration failed
      console.log(`Registration failed with ${error}`);
    });
}

/**
 * General function to create a node in DOM
 */
function createNode(element) {
  return document.createElement(element);
}

/**
 * Create child element in parent in DOM
 */
function append(parent, el) {
  return parent.appendChild(el);
}

function populateSelects(data) {
  let fromOption = createNode('option');
  let toOption = createNode('option');
  fromOption.innerHTML = `${data.currencyName}`;
  fromOption.value = `${data.id}`;
  toOption.innerHTML = `${data.currencyName}`;
  toOption.value = `${data.id}`;
  append(fromSelect, fromOption);
  append(toSelect, toOption);
}

/**
 * Get information from local database
 * @param {*} dbPromise 
 * @param {*} mode 
 */
function getFromLocalDatabase(dbPromise, mode) {
  switch (mode) {
    case 0:
      dbPromise.then(db => {
        if (!db) return;
        let tx = db.transaction('currencyStore');
        let store = tx.objectStore('currencyStore');
        store.getAll().then(currs => {
          for (let i = 0; i < currs.length; i++) {
            populateSelects(currs[i]);
          }
        });
      });
      break;
    case 1:
      dbPromise.then(db => {
        if (!db) return;
        let tx = db.transaction('conversionStore');
        let store = tx.objectStore('conversionStore');
        store.get(`${inputSelect}_${outputSelect}`).then(conversionObject => {
          if (!isNaN(amount)) {
            let new_amount = amount * conversionObject.rate;
            outputAmount.value = new_amount;
            dateRetrievedRight.innerHTML = `Using results from ${conversionObject.date}`;
          }
        });
      });


  }

}

/**
 * Check if window is loaded and set things up
 */
window.addEventListener('load', ()=>{ 
  fromSelect = document.getElementById('from-select');
  toSelect = document.getElementById('to-select');
  inputAmount = document.getElementById('input-amount');
  outputAmount = document.getElementById('output-amount');
  dateRetrievedRight = this.document.getElementById('dateRetrievedRight');
  dateRetrievedLeft = this.document.getElementById('dateRetrievedLeft');
  if (this.navigator.onLine == true) {
    /**
    * Fetch various currencies from api and load into select element
    */
    fetch(`${BASE_URL}currencies`)
      .then((response) => response.json())
      .then(data => {
        currencies = data.results;
        for (key in currencies) {
          populateSelects(currencies[key]);
        }

        /**
         * Populate IDB with returned results for offline support
         */
        dbPromise.then(db => {
          let tx = db.transaction('currencyStore', 'readwrite');
          let store = tx.objectStore('currencyStore');

          for (key in currencies) {
            store.put(currencies[key]);
          }
        });
      })
      .catch(error => {
        console.log(error);
        //get/read from idb if existent
        getFromLocalDatabase(dbPromise, 0);
      });
  } else {
    getFromLocalDatabase(dbPromise, 0);
  }


  /**
   * Action for button when clicked
   */
  let button = this.document.getElementById('convert');
  button.addEventListener('click', () => {
    let convParameters = '';
    //build parameters
    let amount = parseFloat(inputAmount.value);

    let inputSelect = fromSelect.options[fromSelect.selectedIndex].value;
    let outputSelect = toSelect.options[toSelect.selectedIndex].value;
    let valid = (inputSelect !== '' && outputSelect !== '' && inputSelect !== null && outputSelect !== null);
    if (valid == true) {
      convParameters = `convert?q=${inputSelect}_${outputSelect}`;

      if (navigator.onLine == true) {
        fetch(BASE_URL + convParameters)
          .then((response) => response.json())
          .then(data => {
            let today = new Date();
            let date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
            let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
            let dateTime = `${date} ${time}`;
            let conv = data.results;
            if (!isNaN(amount)) {
              let new_amount = amount * conv[`${inputSelect}_${outputSelect}`].val;
              outputAmount.value = new_amount;

              //save entry to database
              //form object
              dbPromise.then(db => {
                if (!db) return;
                let tx = db.transaction('conversionStore', 'readwrite');
                let store = tx.objectStore('conversionStore');
                let conversionObject = {
                  'id': `${inputSelect}_${outputSelect}`,
                  'rate': conv[`${inputSelect}_${outputSelect}`].val,
                  'date': `${dateTime}`
                };
                store.put(conversionObject);
              });

            } else {
              console.log('No amount specified or NaN');
            }
          })
          .catch(error => {
            console.log(error);
            //get conversion from db
            getFromLocalDatabase(dbPromise, 1);
          });
      } else {
        getFromLocalDatabase(dbPromise, 1);
      }

    }
  });

});

