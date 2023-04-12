Ext.require(['*']);


var tabzOptionsGrid = null;


Ext.onReady(function() {
    var cw;
    tabzOptionsGrid = createTabzOptionsGrid();
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
      items: [tabzOptionsGrid]
    });
});
