Ext.Loader.setConfig({enabled: true});
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
]);

Ext.define('Ngram', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'str',  type: 'string'},
        {name: 'count',   type: 'int'}
    ]
});

function createNgramsGrid(arrData){//ngramDir

	// create the Data Store
	var store = Ext.create('Ext.data.ArrayStore', {
	//var store = Ext.create('Ext.data.Store', {
		sortInfo: { field: "count", direction: "DESC" },
		autoLoad: true,
		autoSync: true,
		fields: [
		         {name: 'str',  type: 'string'},
		         {name: 'count',   type: 'int'}
		     ],
		data: arrData
	    //model: 'Ngram',
	});

	// create the grid
	var grid = Ext.create('Ext.grid.Panel', {
	    store: store,
//	    title : "Ngrams",
	    region: "center",
      dockedItems: [createNgramsToolbar()],
//	    //height: '50%',
        flex: 1,
        minHeight: 80,
      split: true,
//	    autoRender: true,
	    autoScroll: true,
	    layout: 'fit',
	    columns: [
	        {text: "String", flex: 1, dataIndex: 'str', sortable: true},
	        {text: "Count", width: 180, dataIndex: 'count', sortable: true}
	    ],
	    //tbar: [	createNgramsToolbar()],
      listeners: {
        selectionchange:{
            	fn: function( /*Ext.selection.Model*/ that, /* Ext.data.Model[]*/ selected,/* Object*/ eOpts ){

            		if(!selected || selected.length == 0){
            			return;
            		}

            		// var ngram = selected[0].data.str;
            		// var tabs = chrome.extension.getBackgroundPage().allTabs;
                //
            		// var ngramer = tabs.get(viewSettings.selectedTabId).ngramer;
            		// var len = parseInt(viewSettings.currentNgram);
            		// var snips = ngramer.getSnippets(ngram,len);
                //
            		// snippetsGrid.getStore().loadData(snips);
                //
            		// textContent.update("<pre>" + ngramer.getTextWithHighlightedKeywords(ngram,viewSettings.currentNgram) + "</pre>");
                //
            		// var positions = ngramer.ngramPos[len].get(ngram);
            		// for(var i = 0;i < positions.length;i++){
            		// 	var ngramPos = ngramer.noSepsToSepsPos[positions[i]];
                //
            		// 	var a = document.getElementById('snip' + ngramPos);
            		// 	a.addEventListener('click', scrollToTextSelection);
            		// }


            	}
            },

        itemdblclick : {
            	fn: function( that, record, item, index, e, eOpts ){

            		// that.getStore().remove(record);
            		// stopWordsGrid.getStore().add(record);
                //
            		// if(viewSettings.stopWords[viewSettings.currentNgram]){
            		// 	viewSettings.stopWords[viewSettings.currentNgram].push(record.data.str);
            		// }
            		// else{
            		// 	viewSettings.stopWords[viewSettings.currentNgram] = [record.data.str];
            		// }
                //
            		// chrome.storage.local.set({"viewSettings" : viewSettings});


            	}
            },

        itemcontextmenu: function(view,record,item,index,e,eOpts){
          e.stopEvent();

          var menu = new Ext.menu.Menu({
            items: [
              {
                text: 'Snippets',
          //       'iconCls' : 'icon-erase',
                handler: function(item,e){
                   // var selectedRow = tabzGrid.getSelectionModel().getSelection()[0];
                   // chrome.tabs.update(selectedRow.get("id"),{active:true});
                   //var links = chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).links;
                   }
              },
              {
                text: 'Find in tabs',
          //       'iconCls' : 'icon-erase',
                handler: function(item,e){
                   // var selectedRow = tabzGrid.getSelectionModel().getSelection()[0];
                   // chrome.tabs.update(selectedRow.get("id"),{active:true});
                   //var links = chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).links;
                   }
              },
              {
                text: 'Find in links',
          //       'iconCls' : 'icon-erase',
                handler: function(item,e){
                   // var selectedRow = tabzGrid.getSelectionModel().getSelection()[0];
                   // chrome.tabs.update(selectedRow.get("id"),{active:true});
                   //var links = chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).links;
                   }
              },
              {
                text: 'Search web (New tab)',
          //       'iconCls' : 'icon-erase',
                handler: function(item,e){

                  var ngramsGrid = chrome.extension.getBackgroundPage().getNgramsView().ngramsGrid;
                  var selectedRow = ngramsGrid.getSelectionModel().getSelection()[0];
                  //chrome.tabs.update(selectedRow.get("str"),{active:true});

                  var url = "https://www.google.com/search?q="+ selectedRow.get("str");

                  chrome.windows.getCurrent(function(wnd) {
                      chrome.tabs.create({"url": url}, function(tab) {
                        //console.log("wnd: " + JSON.stringify(wnd));
                        chrome.windows.update(tab.windowId, {"focused": true, "state": "maximized"}, function(w) {
                          chrome.windows.update(wnd.id, {"focused": true, "state": "normal"}, function(w) {
                            // var tabzView = getTabzView();
                            //
                            // //tabzView.tabzGrid.getSelectionModel().select(0);
                            // var rowIndex = tabzView.tabzGrid.store.find('id', tab.id);
                            // tabzView.tabzGrid.getSelectionModel().select(rowIndex);
                            //tabzView.tabzGrid.getView().focusRow(rowIndex);
                          })
                        })
                      });
                  })

                   // var selectedRow = tabzGrid.getSelectionModel().getSelection()[0];
                   // chrome.tabs.update(selectedRow.get("id"),{active:true});
                   //var links = chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).links;
                 }
              },
              {
                text: 'Search web (Source tab)',
          //       'iconCls' : 'icon-erase',
                handler: function(item,e){
                   // var selectedRow = tabzGrid.getSelectionModel().getSelection()[0];
                   // chrome.tabs.update(selectedRow.get("id"),{active:true});
                   //var links = chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).links;
                   }
              },
              {
                text: 'Update',
          //       'iconCls' : 'icon-erase',
                 handler: function(item,e){
                     var selectedRow = tabzGrid.getSelectionModel().getSelection()[0];
                     //chrome.tabs.remove(selectedRow.get("id"));
                       chrome.tabs.executeScript(selectedRow.get("id"),{ file : 'js/tabz-content.js',	"allFrames" : true },
                         function( result){
                           addTabData(result);
                         }
                       );
                     }
                   }

               ]
           });

           menu.selectedRecord = record;
           menu.showAt(e.getXY());
      }
    }
	});

  return grid;
}
