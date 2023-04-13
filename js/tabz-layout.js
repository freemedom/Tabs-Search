Ext.require(['*']);

var mainView = null;
var tabzGrid = null;

window.addEventListener('resize', function(){
	// console.log('window.innerHeight: ' + window.innerHeight + ' window.outerHeight: ' + window.outerHeight);
	// console.log('window.innerWidth: ' + window.innerWidth + ' window.outerWidth: ' + window.outerWidth);
	settings.setJson('tabz.window.outerHeight', window.outerHeight);
	settings.setJson('tabz.window.outerWidth', window.outerWidth);
});

function getTabsArr(filter){
	var tabs = chrome.extension.getBackgroundPage().allTabs.getValues();
	var arr = [];
	for(var i = 0;i < tabs.length;i++){
		tabs[i].url = tabs[i].url || "";
		tabs[i].title = tabs[i].title || tabs[i].url;
		tabs[i].links = tabs[i].links || [];
		tabs[i].text = tabs[i].text || "";
		tabs[i].lastActivated,
		tabs[i].lastUpdated,
		tabs[i].createdTime,
		tabs[i].images = tabs[i].images || [];

		var bShowTab = false;

		if(settings.getJson('tabz.search.title')){
			if(filter && tabs[i].title.toLowerCase().indexOf(filter) > -1){
				bShowTab = true;
			}
		}

		if(!bShowTab && settings.getJson('tabz.search.url')){
			if(filter && tabs[i].url.toLowerCase().indexOf(filter) > -1){
				bShowTab = true;
			}
		}

		if(!bShowTab && settings.getJson('tabz.search.text')){
			// if(filter && tabs[i].text.toLowerCase().indexOf(filter) > -1){
			// 	bShowTab = true;
			// }
			var reg = new RegExp(filter);
			if(filter && reg.test(tabs[i].text.toLowerCase())){
				bShowTab = true;
			}
		}


		if(!filter || bShowTab){
				arr.push([false,
					tabs[i].favIconUrl ? "<img src='" + tabs[i].favIconUrl + "' width='16' height='16' alt='" + tabs[i].title + "' />" :
					"<img src='" + chrome.extension.getURL('images/icon.png') + "' width='16' height='16' />",
				tabs[i].title,
				tabs[i].links.length || -1,
				tabs[i].text.split(" ").length || -1,
				tabs[i].lastActivated,
				tabs[i].lastUpdated,
				tabs[i].createdTime,
				tabs[i].images.length || -1,
				tabs[i].url,
				tabs[i].id]);
		}
	}
	return arr;
}

Ext.onReady(function() {
//    var cw;
    tabzGrid = createTabzGrid(getTabsArr());
    mainView = Ext.create('Ext.Viewport', {//

	  	listeners: {
	  		afterrender:{
	          	fn: function(that){
	          		//ngramsToolbar.doAutoRender();

	          		// var index = tabzGrid.getStore().find("id",backGroundPage.activeTabId);
	          		// if(index != -1){
	          		// 	tabzGrid.getSelectionModel().select(index);
	          		// }

	      			//ngramsGrid.getStore()
	          	}
	      	}
	  	},

      layout: {
          type: 'border',
          padding: 5
      },
      defaults: {
          split: true
      },
      items: [tabzGrid]
    });
});
