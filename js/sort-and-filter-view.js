
var sortFilterView = {
  createSortFilerView: function(){


  },

  updateFilterViewGrid: function(){
    var storeFields =  [];
	  var gridColumns = [];

    var allText = "";

    var selectedTabsArr = getSelectedGridTabs();

    for(var i = 0;i < selectedTabsArr.length;i++){
      allText += selectedTabsArr[i].text + \n;
      selectedTabsArr[i].ngramer = new Ngramer(selectedTabsArr[i].text,[]);
      selectedTabsArr[i].ngrams[0] = selectedTabsArr[i].ngramer.getTokensCount(1,1,10000);
      var field = {};
      var column = {};

			field.type = "number";
			field.name = "count-" + i.toString();
			storeFields.push(field);

			column.text = selectedTabsArr[i].title;
			column.dataIndex = "count-" + i.toString();
			//column.hidden = !columnChecks[columnChecks.map(function(e) { return e.text; }).indexOf(column.text)].checked;
			gridColumns.push(column);
    }

    var allNgrams = new Ngramer(allText,[]);
    var allNgramsArr = allNgrams.getTokensCountJson(1,1,10000).ngrams;

    for(var i = 0;i < allNgramsArr.length;i++){
      for(var j = 0;j < selectedTabsArr.length;j++){
        if(selectedTabsArr[i].ngrams[0].containsKey(allNgramsArr[0])){

        }
      }

    }

    .push([key,value])



    var store = Ext.create('Ext.data.Store', {
			proxy: {
				type: 'memory',
				reader: {
				    type: 'json',
				    useSimpleAccessors: true
				}
			},
			fields: storeFields
		});


  },

  model: Ext.define('TabInfo', {
      extend: 'Ext.data.Model',
      fields: []
  });
};
