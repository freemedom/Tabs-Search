


//ngram combo
Ext.define('NgramViewModel', {
	extend: 'Ext.data.Model',
	fields: [
		{type: 'string', name: 'ngram'}
	]
});

// The data store holding the states
var ngramViewStore = Ext.create('Ext.data.Store', {
	model: 'NgramViewModel',
	data: [
		{ngram: '1'},
		{ngram: '2'},
		{ngram: '3'},
		{ngram: '4'},
		{ngram: '5'},
		{ngram: '6'},
		{ngram: '7'},
		{ngram: '8'},
		{ngram: '9'},
		{ngram: '10'}
	]
});

// Simple ComboBox using the data store
var cmbNgramView = Ext.create('Ext.form.field.ComboBox', {
	fieldLabel: 'Ngarm',
	//anchor:'100%',
	//renderTo: 'simpleCombo',
	displayField: 'ngram',
	//width: 130,
	labelWidth: 35,
	store: ngramViewStore,
	queryMode: 'local',
	typeAhead: true
//	listeners: {
//    	render : {
//            single : true,
//            buffer : 100,
//            fn     :function() {
//                this.el.setWidth(70);
//            }
//        }
//    }
});

cmbNgramView.on('select',function(combo, records, eOpts){
	//alert(JSON.stringify(records[0].get('action')));
	viewSettings.currentNgram = records[0].get('ngram');
	updateNgrams(viewSettings.selectedTabId);
	//trackEvent("ngramsToolbar.selectNgram",viewSettings.currentNgram);
	//showCloud();
	//alert(records[0].get('ngram'));
});


cmbNgramView.select(viewSettings.currentNgram);

function createNgramsToolbar(){

	var toolbar = Ext.create('Ext.toolbar.Toolbar', {

		//width: '100%',
		// anchor: '100%',
		//autoWidth: true,
//		defaults: {
//            anchor: '100%'
//        },
		items: [
//		        {
//		        	 xtype: 'fieldcontainer',
//		        	 layout: {
//	                        type: 'hbox'
//	                        //defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
//	                    },
//		        	 items: [
//				        cmbNgramView,
							{
										xtype: 'numberfield',
										padding: '2 2 2 2',
										anchor:'100%',
										labelWidth: 35,
										//hideLabel: true,
										width : 90,
										fieldLabel: ' Ngarm',
										//name: 'basic',
										value: parseInt(viewSettings.minNgram),
										minValue: 1,
										maxValue: 20,
										listeners: {
											change:{
													fn: function(that, newValue, oldValue, eOpts ){
														console.log(newValue);
														viewSettings.currentNgram = newValue;
														//viewSettings.minNgram = newValue;
														chrome.storage.local.set({"viewSettings" : viewSettings});
														updateNgrams(viewSettings.selectedTabId);
													}
											}
										}
								},
				        ' ',
				        {
			                xtype: 'numberfield',
											padding: '2 2 2 2',
			                anchor:'100%',
			                labelWidth: 20,
			                //hideLabel: true,
			                width : 90,
			                fieldLabel: ' Min',
			                //name: 'basic',
			                value: parseInt(viewSettings.minNgram),
			                minValue: 1,
			                maxValue: 10000,
			                listeners: {
			                	change:{
			                    	fn: function(that, newValue, oldValue, eOpts ){
			                    		console.log(newValue);
			                    		viewSettings.minNgram = newValue;
			                    		chrome.storage.local.set({"viewSettings" : viewSettings});
			                    		updateNgrams(viewSettings.selectedTabId);
			                    	}
			                	}
			                }
			            },
			            ' ',
			            {
			                xtype: 'numberfield',
			                padding: '2 2 2 2',
			                anchor:'100%',
			                labelWidth: 20,
			                width : 100,
			                fieldLabel: ' Max',
			                //name: 'basic',
			                value: parseInt(viewSettings.maxNgram),
			                minValue: 1,
			                maxValue: 10000,
			                listeners: {
			                	change:{
			                    	fn: function(that, newValue, oldValue, eOpts ){
			                    		console.log(newValue);
			                    		viewSettings.maxNgram = newValue;
			                    		chrome.storage.local.set({"viewSettings" : viewSettings});
			                    		updateNgrams(viewSettings.selectedTabId);

			                    	}
			                	}
//			            		,render : {
//			                        single : true,
//			                        buffer : 100,
//			                        fn     :function() {
//
//			                            this.el.setWidth(90);
//			                        }
//			                    }
			                }
			            }
//		            ]
//			    }
		    ]
		});
	return toolbar;


}
