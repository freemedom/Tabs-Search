Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
//    'Ext.ux.grid.FiltersFeature',
//    'Ext.toolbar.Paging'
]);


//ngram combo
Ext.define('TabzViewModel', {
	extend: 'Ext.data.Model',
	fields: [
		{type: 'string', name: 'tabzview'}
	]
});

// The data store holding the states
var tabzViewStore = Ext.create('Ext.data.Store', {
	model: 'TabzViewModel',
	data: [
		{tabzview: 'Window'},
		{tabzview: 'Tab'},
		{tabzview: 'Drop Down'}
	]
});

// Simple ComboBox using the data store
var cmbTabzView = Ext.create('Ext.form.field.ComboBox', {
	//fieldLabel: 'Ngarm',
	//anchor:'100%',
	//renderTo: 'simpleCombo',
	displayField: 'tabzview',
	//width: 130,
	labelWidth: 35,
	store: tabzViewStore,
	queryMode: 'local',
	typeAhead: true
});

function createTabzOptionsGrid(){
  return Ext.create('Ext.grid.property.Grid', {
      title: 'Tabz Options',
      region: "center",
      autoScroll: true,
      layout: 'fit',

      source: {
          openTabzIn: "Window",
          // "(name)": "My Object",
          // "Created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
           "Available": false,
           "Version": 0.01
          // "Description": "A test object"
      },
      sourceConfig: {
        openTabzIn: {
          editor: cmbTabzView,
          displayName: 'Open Tabz in:'
          }
      },
      listeners: {
        propertychange:{
            fn: function(source, recordId, value, oldValue, eOpts ){
              console.log("source: " + source + " recordId: " + recordId + " value: " + value + " oldValue: " + oldValue)
            }
          }
      }
    });
}
