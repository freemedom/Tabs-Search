// Ext.Loader.setConfig({enabled: true});
// //Ext.Loader.setPath('Ext.ux', '../ux');
// Ext.require([
//     'Ext.grid.*',
//     'Ext.data.*',
// //    'Ext.ux.grid.FiltersFeature',
// //    'Ext.toolbar.Paging'
// ]);

Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', '../ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.ux.grid.FiltersFeature',
    'Ext.toolbar.Paging',
    'Ext.ux.ajax.JsonSimlet',
    'Ext.ux.ajax.SimManager'
]);

function getSelectedGridTabs(){
	var tabzGrid = chrome.extension.getBackgroundPage().getTabzView().tabzGrid;

	var selectedArr = [];

	tabzGrid.getStore().each(function(record){
			if(record.get('selected') === true){
					selectedArr.push(record.data);
			}
	});

	console.log("selectedArr.length: " + selectedArr.length);

	if(selectedArr.length == 0){
		//tabzGrid
    if(tabzGrid.getSelectionModel().selected.items.length == 1){
      selectedArr.push(tabzGrid.getSelectionModel().selected.items[0].data);
    }
	}

	return selectedArr;
}

Ext.define('TabInfo', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'selected',   type: 'boolean'},
        {name: 'icon',  type: 'string'},
        {name: 'title',  type: 'string'},
        {name: 'links',  type: 'int'},
        {name: 'words',  type: 'int'},
        {name: 'lastActivated', type: 'string'}, // type: "date", dateFormat: 'c'},
        {name: 'createdTime', type: 'string'},// type: "date", dateFormat: 'c'},
        {name: 'lastUpdated',type: 'string'}, // type: "date", dateFormat: 'c'},//, format: 'YYYY-MM-DDTHH:mm:ss'
        {name: 'images',  type: 'int'},
        {name: 'url',  type: 'string'},
        //{name: 'wndId',  type: 'int'},
        {name: 'id',  type: 'int'}
    ]
});


function createTabzGrid(arrData){//ngramDir

	// create the Data Store
	var store = Ext.create('Ext.data.ArrayStore', {
		model: 'TabInfo',
		autoLoad: true,
		autoSync: true,
		data: arrData
	});

	// create the grid
	var grid = Ext.create('Ext.grid.Panel', {
	    store: store,
	    region: "center",
      // plugins: [{
      //          ptype: 'gridfilters'
      // }],
	    //height: '100%',
      dockedItems: [{
          xtype: 'toolbar',
          dock: 'top',
          items: [
          //   {
          //     xtype: 'button',
          //     text: 'Left Button'
          // },
          {
            xtype    : 'textfield',
            name     : 'txtSearch',
            itemId   : 'txtSearch',
            emptyText: 'enter search term',
            maxValue: 10000,
            listeners: {
              change:{
                  fn: function(that, newValue, oldValue, eOpts ){
                    console.log("tabz-grid textfield: " + newValue);
                    var store = this.up().up().getStore();
                    store.loadData(getTabsArr(newValue));
                  }
              }
            }
        },
        {
            text: "Search in",
            menu:{
              xtype: 'menu',
              width: 100,

              //height: 110,
              //floating: false,  // usually you want this set to True (default)
              //renderTo: Ext.getBody(),  // usually rendered by it's containing component
              items: [{
                  xtype: 'menucheckitem',
                  text: 'title',
                  checked: settings.getJson('tabz.search.title'),
                  handler: function(item,e){
                    console.log('menucheckitem handler title item:' + item.checked + ' e: ' + e);
                    settings.setJson('tabz.search.title', item.checked);
                    var newValue = this.up().up().up().getComponent('txtSearch').lastValue;
                    var store = this.up().up().up().up().getStore();
                    store.loadData(getTabsArr(newValue));
                  }
                },{
                    xtype: 'menucheckitem',
                    text: 'url',
                    checked: settings.getJson('tabz.search.url'),
                    handler: function(item,e){
                        console.log('menucheckitem handler url item:' + item.checked + ' e: ' + e);
                        settings.setJson('tabz.search.url', item.checked);
                        var newValue = this.up().up().up().getComponent('txtSearch').lastValue;
                        var store = this.up().up().up().up().getStore();
                        store.loadData(getTabsArr(newValue));
                    }
                },{
                    xtype: 'menucheckitem',
                    text: 'text',
                    checked: settings.getJson('tabz.search.text'),
                    handler: function(item,e){
                      console.log('menucheckitem handler text item:' + item.checked + ' e: ' + e);
                      settings.setJson('tabz.search.text', item.checked);
                      var newValue = this.up().up().up().getComponent('txtSearch').lastValue;
                      var store = this.up().up().up().up().getStore();
                      store.loadData(getTabsArr(newValue));
                    }
                }
            ]
            }

          },// menu button
          // { xtype: 'tbtext', text: 'My Text' },
          // {
          //     xtype: 'tbfill'
          // }, {
          //     xtype: 'button',
          //     text: 'Right Button'
          // }
        ]
      }],

	    split: true,
	    //autoRender: true,
	    autoScroll: true,
	    layout: 'fit',

        flex: 1,
        minHeight: 80,
//        split: true,
//	    autoRender: true,
//	    autoScroll: true,
//	    layout: 'fit',
	    columns: [
          {
            xtype: 'checkcolumn',
            header: 'selected',
            dataIndex: 'selected',
            width: 55,
            stopSelection: false,
            menuDisabled: true,
            listeners: {
                checkchange: function( that, rowIndex, checked, eOpts ) {
                    //Ext.Msg.alert('Editing' + (record.get('selected') ? ' completed task' : '') , record.get('text'));
                    console.log("checkchange: " + rowIndex + " checked: " + checked);


                   //  var arrSelected = [];
                   //
                   //  var findSelected = function(node){
                   //      node.eachChild(function(n){
                   //          //console.log(n.data.text + " " + n.data.selected);
                   //          if(n.data['selected'] == true){
                   //              console.log(">>>> " + n.data.text + " " + n.data.selected);
                   //              arrSelected.push(n.getPath('text'));
                   //          }
                   //      });
                   //
                   //      if(node.childNodes.length > 0){
                   //          node.eachChild(findSelected);
                   //      }
                   //  }
                   //
                   // findSelected( that.up().up().getStore().getRootNode());
                   //
                   // console.log("arrSelected: " + JSON.stringify(arrSelected));

                }
            }
          },
	        {text: " ", dataIndex: 'icon',width:30},
	        {text: "Title", dataIndex: 'title', flex: 2,sortable: true},
          {text: "Links", dataIndex: 'links', flex: 0.5,sortable: true},
          {text: "Words", dataIndex: 'words', flex: 0.5,sortable: true},
          {
              text: 'Activated',
              flex: 1,
              sortable: true,
              dataIndex: 'lastActivated'//,    // the name of the field in the model
              // xtype: 'datecolumn',      // the column type
              // format: 'YYYY-MM-DDTHH:mm:ss'           // the displayed format
          },
          {
              text: 'Updated',
              flex: 1,
              sortable: true,
              dataIndex: 'lastUpdated'//,    // the name of the field in the model
              // xtype: 'datecolumn',      // the column type
              // format: 'YYYY-MM-DD HH:mm:ss'           // the displayed format
          },
          {
              text: 'Created',
              sortable: true,
              flex: 1,
              dataIndex: 'createdTime',    // the name of the field in the model
              hidden:true
              //xtype: 'datecolumn'//,      // the column type
              //format: 'YYYY-MM-DDTHH:mm:ss.sssZ'           // the displayed format
          },
          {text: "Images", dataIndex: 'images', flex: 0.5,sortable: true, hidden:true},
	        {text: "Url", dataIndex: 'url', sortable: true, hidden:true},
	        {text: "id", dataIndex: 'id', sortable: true, hidden:true}
	    ],

      listeners: {
        	selectionchange:{
            	fn: function( /*Ext.selection.Model*/ that, /* Ext.data.Model[]*/ selected,/* Object*/ eOpts ){
            		//alert(JSON.stringify(selected[0].data));
            		if(selected.length > 0){
                  //Update NgramsView
                  var ngramsView = getNgramsView();
                	if(ngramsView == null){
                		console.log("TabzGrid selectionchange - ngramsView == null");
                		return;
                	}
                	var grid = ngramsView.ngramsGrid;
                  var ngrams = ngramsView.getNgramsArr();
                  grid.getStore().loadData(ngrams);

                  //Update linksView
                  var linksView = getLinksView();
                	if(linksView == null){
                		console.log("TabzGrid selectionchange - linksView == null");
                		return;
                	}
                	var grid = linksView.linksGrid;
                  var links = linksView.getLinksArr();
                  grid.getStore().loadData(links);

            		}
            	}
            },
            //(  )
            celldblclick:{
              	fn: function( td, cellIndex, record, tr, rowIndex, e, eOpts ){
              		//launchCenter(chrome.extension.getURL('links.html'), "Links", 300, 450);

                  var selectedRow = tabzGrid.getSelectionModel().getSelection()[0];

                  var activateWndId = chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).windowId;
                  chrome.windows.update(activateWndId, {"focused": true, "state": "maximized"}, function(w){
                    console.log("itemcontextmenu Activate chrome.windows.update");
                  });

                  chrome.tabs.update(selectedRow.get("id"),{active:true});
              	}
              },
              itemcontextmenu: function(view,record,item,index,e,eOpts){
                e.stopEvent();

                var menu = new Ext.menu.Menu({
                     items: [
                       {
                         text: 'Activate',
                //       'iconCls' : 'icon-erase',
                       handler: function(item,e){
                         var selectedRow = tabzGrid.getSelectionModel().getSelection()[0];

                         var activateWndId = chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).windowId;
                         chrome.windows.update(activateWndId, {"focused": true, "state": "maximized"}, function(w){
                           console.log("itemcontextmenu Activate chrome.windows.update");
                         });

                         chrome.tabs.update(selectedRow.get("id"),{active:true});
                         //var links = chrome.extension.getBackgroundPage().allTabs.get(selectedRow.get("id")).links;
                         }
                       },
                       {
                         text: 'Text metrics',
                    //     "iconCls" : 'icon-add',
                         handler: function(item,e){
                             var selectedRecord = this.parentMenu.selectedRecord;
                             launchCenter(chrome.extension.getURL('ngrams.html'), "Text metrics", 300, 450);
                            //  var path = selectedRecord.getPath('text','/').replace('/Root/','');
                            //  http.get('/api/files?op=index&path=' + path ,function(res){
                            //      console.log(res);
                            // });
                         }
                       },
                       {
                         text: 'Links',
                //       'iconCls' : 'icon-erase',
                       handler: function(item,e){
                            launchCenter(chrome.extension.getURL('links.html'), "Links", 300, 450);
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
                         },

                   //      {text: 'Edit'},

                         {
                           text: 'Close',
                  //       'iconCls' : 'icon-erase',
                         handler: function(item,e){
                              var selectedRow = tabzGrid.getSelectionModel().getSelection()[0];
                              chrome.tabs.remove(selectedRow.get("id"));
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
