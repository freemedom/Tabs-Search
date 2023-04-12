Ext.require(['*']);

var mainView = null;
var linksGrid = null;

function getLinksArr(filter){
	var tabzGrid = chrome.extension.getBackgroundPage().getTabzView().tabzGrid;
	var selectedRow = tabzGrid.getSelectionModel().getSelection()[0];

	var links = chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).links;
	var arr = [];
	for(var i = 0;i < links.length;i++){
		if(!filter
			|| (filter && links[i].text.toLowerCase().indexOf(filter) > -1)
			|| (filter && links[i].href.toLowerCase().indexOf(filter) > -1)){
				arr.push([ links[i].text,links[i].href]);
		}
	}
	return arr;
}

Ext.onReady(function() {
    var cw;
    linksGrid = createLinksGrid(getLinksArr());
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
      items: [linksGrid]
    });
});
