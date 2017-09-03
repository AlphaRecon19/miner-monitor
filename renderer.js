var data = {
    config: {
        key: '',
        url: ''
    },
    balance: {
        confirmed: null,
        unconfirmed: null
    },
    prices: {
        vrmToBTC: null,
        vrmtoGBP: null,
        vrmtoEUR: null,
        vrmToUSD: null
    }
}

var getPoolUrl = function() {
    return data.config.url + data.config.key + '&action='
}

var updatePrices = function() {
    fetch('https://min-api.cryptocompare.com/data/price?fsym=VRM&tsyms=BTC,USD,EUR,GBP').then(function(response) {
        return response.json()
    }).then(function(json) {
        data.prices.vrmtoBTC = json.BTC;
        data.prices.vrmtoGBP = json.GBP;
        data.prices.vrmtoEUR = json.EUR;
        data.prices.vrmtoUSD = json.USD;

        console.log('Updated prices');
        renderBalance();

        // Repeat every 5 minutes
        setTimeout(function() {
            updatePrices()
        }, 300000);
    }).catch(function(ex) {
        //
    })
}

var updateBalance = function() {
    fetch(getPoolUrl() + 'getuserbalance').then(function(response) {
        return response.json()
    }).then(function(json) {
        var d = json.getuserbalance.data;

        data.balance.confirmed = d.confirmed;
        data.balance.unconfirmed = d.unconfirmed;

        console.log('Updated balance');
        renderBalance();

        // Repeat every 30 seconds
        setTimeout(function() {
            updateBalance()
        }, 30000);
    }).catch(function(ex) {
        //
    })
}

var renderBalance = function() {
    // Check if both data sources are available
    if (data.prices.vrmToBTC === null && data.balance.confirmed === null) {
        return false;
    }

    var confirmed = document.querySelector('.js--balance-confirmed');
    var unconfirmed = document.querySelector('.js--balance-unconfirmed');

    var gbp = document.querySelector('.js--balance-gbp');
    var eur = document.querySelector('.js--balance-eur');
    var usd = document.querySelector('.js--balance-usd');
    var btc = document.querySelector('.js--balance-btc');
    var beer = document.querySelector('.js--balance-beer');

    var rawConfirmed = data.balance.confirmed

    confirmed.innerHTML = parseFloat(rawConfirmed).toFixed(5);
    unconfirmed.innerHTML = parseFloat(data.balance.unconfirmed).toFixed(5);

    gbpAmount = parseFloat(rawConfirmed * data.prices.vrmtoGBP).toFixed(5);

    gbp.innerHTML = gbpAmount;
    eur.innerHTML = parseFloat(rawConfirmed * data.prices.vrmtoEUR).toFixed(5);
    usd.innerHTML = parseFloat(rawConfirmed * data.prices.vrmtoUSD).toFixed(5);
    btc.innerHTML = parseFloat(rawConfirmed * data.prices.vrmtoBTC).toFixed(5);
    beer.innerHTML = Math.floor(gbpAmount / 4);
}

var init = function() {
    renderBalance();
    updatePrices();
    updateBalance();
}

init();