Ext.Loader.setConfig({enabled: true});
//Ext.Loader.setPath('Ext.ux', '../ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
//    'Ext.ux.grid.FiltersFeature',
//    'Ext.toolbar.Paging'
]);


Ext.define('LinkInfo', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'text',  type: 'string'},
        {name: 'url',  type: 'string'}
    ]
});


function createLinksGrid(arrData){

	// create the Data Store
	var store = Ext.create('Ext.data.ArrayStore', {
		model: 'LinkInfo',
		autoLoad: true,
		autoSync: true,
		data: arrData
	});

	// create the grid
	var grid = Ext.create('Ext.grid.Panel', {
	    store: store,
	    region: "center",
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
            name     : 'field1',
            emptyText: 'enter search term',
            maxValue: 10000,
            listeners: {
              change:{
                  fn: function(that, newValue, oldValue, eOpts ){
                    console.log("link-grid textfield: " + newValue);
                    var store = this.up().up().getStore();
                    store.loadData(getLinksArr(newValue));
                  }
              }
            }
        }
        // ,
        //   {
        //       xtype: 'tbfill'
        //   }, {
        //       xtype: 'button',
        //       text: 'Right Button'
        //   }
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
	        {text: "Text", dataIndex: 'text', flex: 1,sortable: true},
          {text: "Url", dataIndex: 'url', flex: 1,sortable: true},
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
                    console.log("checkchange" + rowIndex + " checked " + checked);

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
        }
	    ],
        listeners: {
        	selectionchange:{
            	fn: function( /*Ext.selection.Model*/ that, /* Ext.data.Model[]*/ selected,/* Object*/ eOpts ){
            		//alert(JSON.stringify(selected[0].data));
            		if(selected.length > 0){

            			// var tabId = selected[0].data.id;
                	// viewSettings.selectedTabId = tabId;


            		}



            		//var tabs = chrome.extension.getBackgroundPage().tabs;
            		//ngramsGrid.getStore().loadData(tabs.get(selected[0].data.id).ngramer.getTokensCountJson(viewSettings.currentNgram));


    				//showExtensions(selected[0].data.Name);
            	}
            }
        }

	});

	return grid;
}
