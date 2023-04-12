var allTabs = new Ext.util.HashMap();
var url_to_tab = new Ext.util.HashMap();

var mainWnd = null;
var tabzWndId = null;

var mainTabId = null;

var activeTabId = null;
var activeWndId = null;

//var stopWords = [];
console.log("Background.html");



var viewSettings = null;
chrome.storage.local.get("viewSettings",function(o){
	viewSettings = o.viewSettings || {currentNgram:1,stopWords:[],minNgram:2,maxNgram:100000};

});


chrome.windows.getAll({populate:true}, function (arrWnd){
  console.log("chrome.windows.getAll");

  for(var i = 0;i < arrWnd.length;i+=1){
    for(var j = 0;j < arrWnd[i].tabs.length;j+=1){
      var tab = arrWnd[i].tabs[j];
      tab.text = "";
      tab.links = [];
      tab.images = [];
      tab.createdTime = new Date().toISOString();
      tab.lastUpdated = tab.createdTime;
      tab.lastActivated = tab.createdTime;

      console.log("chrome.windows.getAll tab id: " + tab.id + " tab: " + JSON.stringify(tab));

      allTabs.add(tab.id,tab);

      if(isSupportedUrl(tab.url)){
        updateTabContent(tab.id);
      }// if(isSupportedUrl
    }
  }
});//chrome.windows.getAll

function updateTabContent(tab_id){
  chrome.tabs.executeScript(tab_id, { code: "var tab_id = " + tab_id + ";tab_id;", "allFrames" : true },
  function(res) {
    if(res){
      var tab_id = res[0];
      console.log("updateTabContent: " + tab_id);
      chrome.tabs.executeScript(tab_id,{ file : 'js/tabz-content.js',	"allFrames" : true },
        function( result){
          //console.log("updateTabContent: result" + JSON.stringify(result));
          addTabData(result);
        }
      );
    }
  });// executeScript tab_id
}


chrome.runtime.onInstalled.addListener(function(details) {
  console.log("chrome.runtime.onInstalled" + JSON.stringify(details));

	settings.setJson('tabz.search.title', true);
	settings.setJson('tabz.search.url', true);
	settings.setJson('tabz.search.text', false);

});// onInstalled

chrome.browserAction.onClicked.addListener(function(tab) {

	console.log("chrome.browserAction.onClicked Hello from text Tabz");

  //getViewFromPageName('tabz.html');

  var tabs = allTabs.getValues();
  for(var i = 0;i < tabs.length;i+=1){
    if(tabs[i].url === chrome.runtime.getURL('tabz.html')){
      tabzWndId = tabs[i].windowId;
      break;
    }
  }

  console.log("chrome.browserAction.onClicked chrome.runtime.getURL url: " + chrome.runtime.getURL('tabz.html'));

  if(tabzWndId){
    chrome.windows.update(tabzWndId, {"focused": true/*, "state": "maximized"*/}, function(w){
      console.log("chrome.browserAction.onClicked tabzView chrome.windows.update");
    });
  }
  else{
    launchCenter(chrome.extension.getURL('tabz.html'), "Tabz",
									settings.getJson('tabz.window.outerHeight'),
									settings.getJson('tabz.window.outerWidth'),
									settings.getJson('tabz.window.screenX'),
									settings.getJson('tabz.window.screenY'));
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo){
	console.log("chrome.tabs.onActivated activeInfo: " + JSON.stringify(activeInfo));
  var tab = allTabs.get(activeInfo.tabId);
  tab.lastActivated = new Date().toISOString();

  console.log("chrome.tabs.onActivated tab: " + JSON.stringify(tab));
  allTabs.replace(tab.id,tab);

  var tabzView = getTabzView();

  if(tabzView && tabzView.tabzGrid ){
    var grid = tabzView.tabzGrid;
    var rec = grid.getStore().findRecord('id',tab.id);
    if(rec){
      rec.beginEdit();
      rec.set("lastActivated",tab.lastActivated);
      rec.endEdit();
    }
  }

});


chrome.tabs.onCreated.addListener(function(tab) {
	//console.log("chrome.tabs.onCreated tab: " + JSON.stringify(tab));

  tab.text = "";
  tab.links = [];
  tab.images = [];

  tab.createdTime = new Date().toISOString();
  tab.lastUpdated = tab.createdTime;
  tab.lastActivated = tab.createdTime;

  //console.log("chrome.tabs.onCreated tab b4 allTabs.add : " + JSON.stringify(tab));
  allTabs.add(tab.id,tab);

  var tabzView = getTabzView();

	if(tabzView == null){
		console.log("addUrlData - tabzView == null");
		return;
	}

	var grid = tabzView.tabzGrid;

	if(grid){
		grid.getStore().add({
	    icon:"<img src='" + tab.favIconUrl + "' width='16' height='16' alt='" + tab.title + "' />",
	    title:tab.title || tab.url,
	    links:tab.links.length,
	    words:tab.text.split(" ").length,
	    links:tab.lastActivated,
	    links:tab.lastUpdated,
	    links:tab.createdTime,
	    images:0,
	    url:tab.url,
	    id:tab.id});
	}


	// if(!isSupportedUrl(tab.url)){
	// 	return;
	// }

  //updateTabContent(tab.id);

});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  var storedTab = allTabs.get(tab.id);
  tab.createdTime = storedTab.createdTime;
  tab.lastActivated = storedTab.lastActivated;
  tab.text = storedTab.text;
  tab.links = storedTab.links;
  tab.images = storedTab.images;

  tab.lastUpdated = new Date().toISOString();
  //console.log("chrome.tabs.onUpdated b4 allTabs.replace: " + JSON.stringify(changeInfo) + " tab: " + JSON.stringify(tab));
  allTabs.replace(tab.id,tab);
	//console.log("chrome.tabs.onUpdated : " + JSON.stringify(changeInfo) + " tab: " + JSON.stringify(tab));

    var tabzView = getTabzView();

    if(tabzView && tabzView.tabzGrid ){
      var grid = tabzView.tabzGrid;

      var rec = grid.getStore().findRecord('id',tabId);
      if(rec){
        rec.beginEdit();
        rec.set("lastUpdated",tab.lastUpdated);
        rec.set("url",tab.url);
        rec.endEdit();
      }

      if(changeInfo.title){
        tab.title = changeInfo.title;

        var rec = grid.getStore().findRecord('id',tabId);
        if(rec){
          rec.beginEdit();
          rec.set("title",tab.title);
          rec.endEdit();
        }
      }
      if(changeInfo.favIconUrl){
        tab.favIconUrl = changeInfo.favIconUrl;

        var rec = grid.getStore().findRecord('id',tabId);
        if(rec){
          rec.beginEdit();
          rec.set("icon","<img src='" + tab.favIconUrl + "' width='16' height='16' alt='" + tab.title + "' />");
          rec.endEdit();
        }
      }

      allTabs.replace(tab.id,tab);

  }

	if (changeInfo.status == "complete") {
    tab.text = "";
    tab.links = [];
    tab.images = [];

		if(tab.url == chrome.runtime.getURL('tabz.html')){
			tabzWndId = tab.windowId;
		}

		if(!isSupportedUrl(tab.url)){
			return;
		}

	   updateTabContent(tab.id);
	}
});//chrome.tabs.onUpdated


chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	console.log("chrome.tabs.onRemoved : " + tabId);
	console.log("chrome.tabs.onRemoved : " + allTabs[tabId]);

	allTabs.removeAtKey(tabId);
  var tabzView = getTabzView();

	if(tabzView == null){
		console.log("addUrlData - tabzView == null");
		return;
	}
	var grid = tabzView.tabzGrid;
	var rec = grid.getStore().findRecord('id',tabId);

	grid.getStore().remove(rec);
});

chrome.windows.onFocusChanged.addListener(function(wndId){
	console.log('chrome.windows.onFocusChanged wndId: ' + wndId)
	var tabzView = getTabzView();
	if(tabzView){
		// console.log(tabzView.window.screenX);
		// console.log(tabzView.window.screenY);
		settings.setJson('tabz.window.screenX', tabzView.screenX);
		settings.setJson('tabz.window.screenY', tabzView.screenY);
	}
});

chrome.windows.onRemoved.addListener(function(wndId){
	console.log('chrome.windows.onRemoved wndId: ' + wndId);
	console.log('chrome.windows.onRemoved tabzWndId: ' + tabzWndId);
	if(tabzWndId == wndId){
		tabzWndId = null;
		var tabzView = getTabzView();
		if(tabzView){
			// console.log(tabzView.window.screenX);
			// console.log(tabzView.window.screenY);
			settings.setJson('tabz.window.screenX', tabzView.screenX);
			settings.setJson('tabz.window.screenY', tabzView.screenY);
		}
	}
});
