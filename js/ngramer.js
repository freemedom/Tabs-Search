
//Ext.define('Ngram', {
//    extend: 'Ext.data.Model',
//    fields: [
//        {name: 'str',  type: 'string'},
//        {name: 'count',   type: 'int'}
//    ]
//});

Ext.define('Ngramer', {
//    name: 'Unknown',

    constructor: function(txt,stopWords) {
        try{
			//console.log("Ngramer.initialize");

			//console.log("txt: " + txt);

			this.text = txt;
			this.tokens = [];
			//this.lowerTokens = [];
			this.lowerTokensNoSeps = [];
			//this.tokenPos = new Ext.util.HashMap();
			this.tokenPosNoSeps = new Ext.util.HashMap();
			this.ngrams = [];
			this.json = [];
			this.noSepsToSepsPos = [];
			this.ngramPos = [];
			this.stopWords = stopWords;
			this.separators = [" ",".",",",":",";","`","'"," ","\\","/","?","@","$","#","<",">","|","\"","“","”","»","©","\n","\r","\t","=","(",")","{","}","[","]","!","-","•"];
			this.tokenize();
		}
		catch(e){
			//console.log("Ngramer.initialize ERROR: " + e);
		}

        return this;
    },

   // json : [],

    isStopWord : function(word){
		return this.stopWords[this.currentNgram] ? ((this.stopWords[this.currentNgram].indexOf(word) === -1) ? false : true) : false;
	},

	isSeparator : function(ch){
		return (this.separators.indexOf(ch) === -1) ? false : true;
	},

//	addTokenPos : function(token,pos){
//		try{
//			if(this.tokenPos.containsKey(token)){
//				var arr = this.tokenPos.get(token);
//				arr.push(pos)
//				this.tokenPos.replace(token,arr);
//			}
//			else{
//				this.tokenPos.add(token,[pos]);
//			}
//		}
//		catch(e){
//			//console.log("addTokenPos ERROR: " + e + " token: '" + token + "' pos: " + pos);
//		}
//	},

	addTokenPosNoSeps : function(token,pos){
		try{
			if(this.tokenPosNoSeps.containsKey(token)){
				var arr = this.tokenPosNoSeps.get(token);
				arr.push(pos)
				this.tokenPosNoSeps.replace(token,arr);
			}
			else{
				this.tokenPosNoSeps.add(token,[pos]);
			}
		}
		catch(e){
			//console.log("addTokenPosNoSeps ERROR: " + e + " token: '" + token + "' pos: " + pos);
		}
	},

	tokenize : function(){
		try{
			var pos = 0;
			var posWithSeps = 0;
			var word = "";
			var length = 0;
			var offset = 0;

			for(var i = 0;i < this.text.length;i+=1){
				var ch = this.text[i];
				if(!this.isSeparator(ch)){
					word += ch;
					length++;
				}
				else{
					if(word.length > 0){
						//console.log("tokenize word: '" + word + "'");

						this.noSepsToSepsPos[pos] = posWithSeps;

						this.addTokenPosNoSeps(word.toLowerCase(),pos);
						this.lowerTokensNoSeps[pos] = word.toLowerCase();
						pos +=1;

						//this.addTokenPos(word.toLowerCase(),posWithSeps);
						this.tokens[posWithSeps] = {str:word,offset:offset,length:length};
						//this.lowerTokens[posWithSeps] = word.toLowerCase();
						posWithSeps += 1;



						//this.addTokenPos(ch.toLowerCase(),posWithSeps);
						this.tokens[posWithSeps] = {str:ch,offset:offset + length,length:1};
						//this.lowerTokens[posWithSeps] = ch;
						posWithSeps += 1;

						//this.lowerTokens.push(word.toLowerCase());
						//this.lowerTokens.push(ch.toLowerCase());
						word = "";
						length = 0;
						offset = i + 1;
					}
					else{//another separator
						this.tokens[posWithSeps] = {str:ch,offset:offset + length,length:1};
						posWithSeps += 1;
						offset = i + 1;
					}
				}
			}
		}
		catch(e){
			//console.log("tokenize ERROR: " + e);
		}
		//console.log("tokenize: " + JSON.stringify(this.tokens));
	},

	getNextNgram : function(pos,len){

		//console.log("getNextNgram pos: " + pos + " len: " + len);
		var tag = "";
		var lim = pos + len;
		if(lim > this.lowerTokensNoSeps.length){
			return tag;
		}
		for(var i = pos;i < lim;i++){
			tag += this.lowerTokensNoSeps[i] + " ";
		}

		//console.log("getNextNgram return: " + tag);
		return Ext.String.trim(tag);
	},

//	getTokensCountStore : function(ngramLen){
//		ngramLen = parseInt(ngramLen);
//		var ngramCount = Ext.create('Ext.data.Store', {
//			model: 'Ngram',
//		});
//
//		if(ngramLen == 1){
//			var keys = this.tokenPosNoSeps.getKeys();
//			for(var i = 0;i < keys.length;i++){
//				ngramCount.add({token:keys[i],count:this.tokenPosNoSeps.get(keys[i]).length});
//			}
//		}
//		else{
//			var keys = this.tokenPosNoSeps.getKeys();
//			for(var i = 0;i < keys.length;i++){
//				var ngram = this.getNextNgram(i,ngramLen);
//				var count = ngramCount.findRecord('token',ngram);
//				if(count == null){
//					console.log("count == null ngram: " + ngram)
//					ngramCount.add({token:ngram,count:1});
//				}
//				else{
//					console.log("ngram: " + ngram + " count: " + (count.get('count') + 1));
//					ngramCount.remove(count);
//					count.set('count',count.get('count') + 1);
//					ngramCount.add(count);
//				}
//				//ngramCount.add({token:keys[i],count:this.tokenPos.get(keys[i]).length});
//			}
//		}
//
//		return ngramCount;
//	},

	addNgramPos : function(ngramLen,token,pos){

		//console.log("addNgramPos ngramLen: " + ngramLen + " token: '" + token + "' pos: " + pos);
		try{
			//pos = this.noSepsToSepsPos[pos];
			if(this.ngramPos[ngramLen].containsKey(token)){
				var arr = this.ngramPos[ngramLen].get(token);
				arr.push(pos)
				this.ngramPos[ngramLen].replace(token,arr);
			}
			else{
				this.ngramPos[ngramLen].add(token,[pos]);
			}
		}
		catch(e){
			//console.log("addNgramPos ERROR: " + e + " token: '" + token + "' pos: " + pos);
		}
	},

  getTokensCount : function(ngramLen,minNgram,maxNgram){
		ngramLen = parseInt(ngramLen);
		this.currentNgram = ngramLen;
		minNgram = parseInt(minNgram);
		maxNgram = parseInt(maxNgram);

		var ngramCount = new Ext.util.HashMap();

		this.ngramPos[ngramLen] = new Ext.util.HashMap();

    if(ngramLen == 1){
			var keys = this.tokenPosNoSeps.getKeys();
			for(var i = 0;i < keys.length;i++){
				var ngram = keys[i];

				//this.addNgramPos(ngramLen, ngram, i);
				this.ngramPos[1].add(ngram,this.tokenPosNoSeps.get(ngram));
				ngramCount.add(ngram,this.tokenPosNoSeps.get(ngram).length);
			}
		}
		else{
			//var keys = this.tokenPosNoSeps.getKeys();
			for(var i = 0;i < this.lowerTokensNoSeps.length;i++){
				var ngram = this.getNextNgram(i,ngramLen);

				this.addNgramPos(ngramLen, ngram, i);

				if(!ngramCount.containsKey(ngram)){
					//console.log("!ngramCount.containsKey ngram: " + ngram)
					ngramCount.add(ngram,1);
				}
				else{
					//console.log("ngram: " + ngram + " count: " + (ngramCount.get(ngram) + 1));
					ngramCount.replace(ngram,ngramCount.get(ngram) + 1);

				}
				//ngramCount.add({token:keys[i],count:this.tokenPos.get(keys[i]).length});
			}
		}

    return ngramCount;
  },

	getTokensCountJson : function(ngramLen,minNgram,maxNgram){
		ngramLen = parseInt(ngramLen);
		this.currentNgram = ngramLen;
		minNgram = parseInt(minNgram);
		maxNgram = parseInt(maxNgram);

		var ngramCount = this.getTokensCount(ngramLen,minNgram,maxNgram);
		var js = {ngrams:[],stopWords:[]};
		var that = this;

		ngramCount.each(function(key, value, length){
			if(value >= minNgram && value <= maxNgram){
				if(that.isStopWord(key)){
					js.stopWords.push([key,value]);
				}
				else{
					js.ngrams.push([key,value]);
				}
			}
		});

		this.json[ngramLen] = js;



		return js;
	},


	getSnippets : function(ngram,len){
		//var nPosMap = this.ngramPos[len];
		len = parseInt(len);

		var snippets = [];
		var positions = this.ngramPos[len].get(ngram);
		for(var i = 0;i < positions.length;i++){

			var strNgram = "";
			var ngramPos = this.noSepsToSepsPos[positions[i]];
			var lastWordPos =  this.noSepsToSepsPos[positions[i] + len] - 1;

			for(var j = ngramPos; j < lastWordPos;j++){
				strNgram += this.tokens[j].str;
			}

			var snip = this.getLeftSnippet(this.noSepsToSepsPos[positions[i]],20)
            + "<font style=\"color:blue; background-color:yellow;\">"
            + "<a href='#' id='snip" + ngramPos + "'>" + strNgram + "</a>"
            + "</font>"
            + this.getRightSnippet(lastWordPos - 1 ,20);

			snippets.push([snip]);
		}
		return snippets;
	},

	getLeftSnippet : function(pos,len){
		var left = "";
		var i = pos - len;
		if(i < 0){
			i = 0;
		}
		for(i;i < pos;i++){
			left += this.tokens[i].str;
		}
		return left;
	},

	getRightSnippet : function(pos,len){
		var right = "";
		var i = pos + 1;
		var limit = i + len;
		if(limit > this.tokens.length - 1){
			limit = this.tokens.length - 1;
		}

		for(i;i < limit;i++){
			right += this.tokens[i].str;
		}
		return right;
	},

	getTextWithHighlightedKeywords : function(ngram,len){
		len = parseInt(len);

		var positions = this.ngramPos[len].get(ngram.toLowerCase());

		positions.sort(function(a, b) {return a - b;});
		positions.reverse();

		var arr = this.tokens.map(function(item){
			return item.str;
		});

		for(var i = 0;i < positions.length;i++){
			var pos = this.noSepsToSepsPos[positions[i]];
			var endPos = this.noSepsToSepsPos[positions[i] + len];


			//"<font style=\"color:blue; background-color:yellow;\">" + item.anchor(item + "_" + this.replace_count) + "</font>";
			arr.splice(endPos,0,"</a></font>");
			arr.splice(pos,0,"<font style=\"color:blue; background-color:yellow;\"><a name='" + pos + "'>");
		}

		return arr.join("");
	}

//	loadTokensCount : function(store,ngramLen){
//		ngramLen = parseInt(ngramLen);
//		store.removeAll();
//
//		if(ngramLen == 1){
//			var keys = this.tokenPos.getKeys();
//			for(var i = 0;i < keys.length;i++){
//				store.add({str:keys[i],count:this.tokenPos.get(keys[i]).length});
//			}
//		}
//		else{
//			var keys = this.tokenPos.getKeys();
//			for(var i = 0;i < keys.length;i++){
//				var ngram = this.getNextNgram(i,ngramLen);
//				var count = store.findRecord('str',ngram);
//				if(count == null){
//					console.log("count == null ngram: " + ngram)
//					store.add({str:ngram,count:1});
//				}
//				else{
//					console.log("ngram: " + ngram + " count: " + (count.get('count') + 1));
//					store.remove(count);
//					count.set('count',count.get('count') + 1);
//					store.add(count);
//				}
//				//ngramCount.add({token:keys[i],count:this.tokenPos.get(keys[i]).length});
//			}
//		}
//
//	}


});
