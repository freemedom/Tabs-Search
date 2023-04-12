Ext.require(['*']);

var mainView = null;
var ngramsGrid = null;



function getNgramsArr(){
	//var ngramer = new Ngramer(chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).text,[]);
	//var links = chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).text;
	var selectedArr = backGroundPage.getTabzView().getSelectedGridTabs();
	var arr = [];

	var allTabs = chrome.extension.getBackgroundPage().allTabs;//.get(selectedRow.get("id")).text

	if(selectedArr.length > 0){
		var text = "";
		for(var i = 0;i < selectedArr.length;i++){
			//arr.push([ links[i].text,links[i].href]);
			tab = allTabs.get(selectedArr[i].id);
			if(tab){
				text += tab.text + "\n";
			}

			//console.log(JSON.stringify(selectedArr[i].data));
		}

		var ngramer = new Ngramer(text,[]);

		var tokensCount = ngramer.getTokensCountJson(viewSettings.currentNgram,viewSettings.minNgram,viewSettings.maxNgram);

		console.log(JSON.stringify(tokensCount));
	}

	return tokensCount.ngrams;
}

Ext.onReady(function() {
    var cw;
		//var ngramsToolbar = createNgramsToolbar();
    ngramsGrid = createNgramsGrid(getNgramsArr());
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
			//tbar: [ngramsToolbar],
      items: [ngramsGrid]
    });
});
