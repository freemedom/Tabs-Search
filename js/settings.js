
var settings = {

    set: function (key,value){
        chrome.extension.getBackgroundPage().localStorage.setItem(key,value);
    },
    setJson: function (key,value){
        settings.set(key,JSON.stringify(value));
    },
    get: function (key){
        var val = chrome.extension.getBackgroundPage().localStorage.getItem(key);
        console.log('settings.get key: ' + key + ' val: ' + val);
        return val;
    },
    getJson: function (key){
        return JSON.parse(settings.get(key));
    },

    remove: function(key){
        chrome.extension.getBackgroundPage().localStorage.removeItem(key);
    }
};
