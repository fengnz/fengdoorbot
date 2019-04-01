// 如果你要使用Mlab 而不是 Restheart 的话， 请把以下的KEY改成你自己的KEY
var mlabKey = "WULdZqaqxqikzrGePcLC5uWBeyvGZqBp";

var baseUrl = "https://api.mlab.com/api/1/";
var dbUrl = baseUrl + "databases/mongo/";
var collectionUrl = dbUrl + "collections/";

var logColl = "logs";
var groupSettingsColl = "group-settings";
var toTelegram = "to-telegram";
var fromTelegram = "from-telegram";

var mlab = {};

if (Const.useMlab) {
    mongo = mlab;
  
}

function debugMLab(){
  debug();
}

function convertRestHeartParasToMlabParas(query) {
    query = query.replace("filter=", "q=");
    query = query.replace("sort=", "s=");
    query = query.replace("pagesize=", "l=");
    // query = query.replace("page=", "sk=");
    // Pagination is not supported yet
    // We don't have pagination feature so far
    return query;
}

mlab.insert = function(collection, data) {
  var db = apendAPI(collectionUrl + collection);
  var option = getMlabInsertOption(data);
  UrlFetchApp.fetch(db, option);
};


// Warning, put will override the whole collectoin, put empty array data will clear the whole collection
mlab.replace = function(collection, query, data) {
  query = convertRestHeartParasToMlabParas(query);
  var db = apendAPI(collectionUrl + collection);
  if (query){
    db += "&" + query;
  }
  var option = getMlabPutOption(data);
  var url = encodeURI(db);
  UrlFetchApp.fetch(url, option);
};
mlab.get = function(collection, query) {
  query = convertRestHeartParasToMlabParas(query);
  var db = apendAPI(collectionUrl + collection);
  if (query){
    db += "&" + query;
  }
  var option = getMlabGetOption();
  var response = UrlFetchApp.fetch(encodeURI(db), option);
  var  object = JSON.parse(response);
  return  object;
};

mlab.setOne = function(urlWithId, data) {
  if (urlWithId && urlWithId.indexOf("/") > 0) {    
    return this.replace(urlWithId, null, data);
  }
  throw "Please provide document id";
}

mlab.setMany = function(collection, query, data) {
  if (query && query.indexOf("filter=") == 0) {    
    return this.replace(collection, query, []);
  }
  throw "query cannot be null, it will replace the whole collection";
};

mlab.set = mlab.setMany;
mlab.remove = function(collection, query) {
  if (query && query.indexOf("filter=") == 0) {    
    return this.replace(collection, query, []);
  }
  throw "query cannot be null, it will clear the whole collection";
}


function apendAPI(url){
  return url + "?apiKey=" + mlabKey;
}


function getMlabInsertOption(data){
  var option = {
    "method": "post",
    'contentType': 'application/json',
    "payload": JSON.stringify(data)
  };
  return option;
}
function getMlabPutOption(data){
  var option = {
    "method": "put",
    'contentType': 'application/json',
    "payload": JSON.stringify(data)
  };
  return option;
}
function getMlabGetOption(){
  var option = {
    "method": "get",
  };
  return option;
}







