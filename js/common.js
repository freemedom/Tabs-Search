if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.lastIndexOf(str, 0) === 0;
  };
}

function isSupportedUrl (url){
	if(url.startsWith("http://")
			|| url.startsWith("https://")
		//	|| url.startsWith("chrome://newtab")
			|| url.startsWith("file:///")){
		return true;
	}
	else{
		return false;
	}
}

function launchCenter(url, name, height, width, screenX, screenY){
		var str = "height=" + height + ",innerHeight=" + height;
		str += ",width=" + width + ",innerWidth=" + width;
		if (window.screen)
		{
			var ah = screen.availHeight - 30;
			var aw = screen.availWidth - 10;

			var xc = screenX || (aw - width) / 2;
			var yc = screenY || (ah - height) / 2;

			str += ",left=" + xc + ",screenX=" + xc;
			str += ",top=" + yc + ",screenY=" + yc;
		}
		return window.open(url, name, str);
	}

function count_keywords(str){
	   var words = str.toLowerCase().replace(/[:;,`'\.\\\/\?<>\|\"\t=\(\)\{\}\[\]\!]/g,' ').split(' ');//[^a-zA-Z0-9]
	   var assoc = new Array();
	   total_words=words.length;
	   for (i=0; i<total_words; i++)
	   {
		  if (!words[i])
			 continue;
		  if (assoc[words[i]] == null)
			 assoc[words[i]]=0;
		  assoc[words[i]]++;

		  //console.log("count_keywords -- " + words[i] + " : " + assoc[words[i]]);
	   }
	   return sort_by_num_val(assoc);
	}

function sort_by_num_val(assoc){//using objects
		var dict = new Array();
		for (k in assoc)
		{
			//console.log("sort_by_num_val -- " + k + " : " + assoc[k]);
			dict.push([k,assoc[k]]);
		}

		var arr = new Array();
		for (var i = 0;i < dict.length;i++)
		{
			arr.push({k:dict[i][0],v:dict[i][1]});
		}
		return arr.sort(function(x,y){return y.v-x.v})
	}

function setLS(key, value){
		try
		{
			//console.log("Inside setItem: " + key + ":" + value);
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}
		catch(e)
		{
			console.log("Error inside setItem");
			console.log(e);
		}
		//console.log("Return from setItem: " + key + ":" +  value);
	}

function getLS(key){
		var value = null;
		//console.log('Get Item:' + key);
		try
		{
			value = localStorage.getItem(key);
		}
		catch(e)
		{
			console.log("Error inside localStorage.getItem() for key:" + key);
			console.log(e);
			value = null;
		}
		//console.log("Returning value: " + value);
		return value;
    }

function remove_ls(key){
	try
	{
		window.localStorage.removeItem(key);
	}
	catch(e)
	{
		console.log("Error inside remove_ls() for key:" + key);
		console.log(e);
	}
}

function get_ls_json(key){
	var val = get_ls(key);

	console.log("get_ls_json val: " + val);

	if(null == val)
	{
		val = {};
	}

	try
	{
		val = JSON.parse(val);
	}
	catch(e)
	{
		console.log("get_ls_json: error in JSON.parse(val)");
		console.log(e);
	}
	return val;
}

function getViewFromPageName(pageName){
	var views = chrome.extension.getViews();

	if(!pageName.startsWith("/")){
		pageName = "/" + pageName;
	}

	for(var i = 0;i < views.length;i++){
		if(views[i].location.pathname == pageName){
			return views[i];
		}
	}
	return null;
}

function getTabzView(){
		var views = chrome.extension.getViews();

		for(var i = 0;i < views.length;i++){
			if(views[i].location.pathname == "/tabz.html"){
				return views[i];
			}
		}
		return null;
	}

function getLinksView(){
	var views = chrome.extension.getViews();

	for(var i = 0;i < views.length;i++){
		if(views[i].location.pathname == "/links.html"){
			return views[i];
		}
	}
	return null;
}

function getNgramsView(){
	var views = chrome.extension.getViews();

	for(var i = 0;i < views.length;i++){
		if(views[i].location.pathname == "/ngrams.html"){
			return views[i];
		}
	}
	return null;
}

function addTabData(data){
  if(!data || !Array.isArray(data)){
    return;
  }
  console.log("addTabData data length: " + data.length);

	var allTabs = chrome.extension.getBackgroundPage().allTabs;
  var tab = allTabs.get(data[0].tab_id);

  tab.text = "";
  tab.links = [];
  tab.images = [];
	tab.lastUpdated = new Date().toISOString();
	// .toLocaleString(undefined, {
	// 	day: 'numeric',
	// 	month: 'numeric',
	// 	year: 'numeric',
	// 	hour: '2-digit',
	// 	minute: '2-digit',
	// });

  for(var i = 0; i < data.length; i++){
    //console.log("data " + i + " -- " + JSON.stringify(data[i]));
		if(data[i]){
			data[i].text = data[i].text || "";
	    tab.text += data[i].text + "\n";
	    tab.links = tab.links.concat(data[i].links);
	    tab.images = tab.images.concat(data[i].images);
		}

  }

  tab.text.trim();

	//console.log(">>> addTabData tab b4 allTabs.replace: " + JSON.stringify(tab));
  allTabs.replace(tab.id,tab);

	//tab.ngramer = new Ngramer(data.innerText,viewSettings.stopWords);

	var tabzView = getTabzView();

	if(tabzView == null){
		console.log("addUrlData - tabzView == null");
		return;
	}
	var grid = tabzView.tabzGrid;

	var rec = grid.getStore().findRecord('id',tab.id);

	if(rec == null){
		console.log("addUrlData rec = grid.getStore().findRecord rec == null");
		grid.getStore().add({
      icon:"<img src='" + tab.favIconUrl + "' width='16' height='16' alt='" + tab.title + "' />",
      title:tab.title || tab.url,
      links:tab.links.length,
      words:tab.text.split(" ").length,
			links:tab.lastActivated,
			links:tab.lastUpdated,
			links:tab.createdTime,
      images:0,
      url:tab.url,
      id:tab.id});
	}
	else{
		rec.beginEdit();
		rec.set("icon","<img src='" + tab.favIconUrl + "' width='16' height='16' alt='" + tab.title + "' />");
		rec.set("title",tab.title);
    rec.set("links",tab.links.length);
    rec.set("words",tab.text.split(" ").length);
		rec.set("lastActivated",tab.lastActivated);
		rec.set("lastUpdated",tab.lastUpdated);
		rec.set("createdTime",tab.createdTime);
    rec.set("images",0);
		rec.set("url",tab.url);
		rec.endEdit();
	}

}//addTabData
