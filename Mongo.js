function debugMLab(){
  debug();
}

var mongo = {};
var restheart = {};

function request(db, option) {
  try {
    option.muteHttpExceptions = true;
    var response = UrlFetchApp.fetch(db, option);
    var headers = response.getAllHeaders().toSource();
    if (response) {
      if (response.getResponseCode() == 404) {
        if (content.message) {
          var regex = /Collection '([A-z0-9_-]+)' does not exist/;
          var found = content.message.match(regex);
          if (found.length > 0) {
            var collectionName = found[1];
            mongo.replace(collectionName, {"desc": "created by bot"});
          }
        }
      }
      // var contentText = response.getContentText();
      // var content = {};
      // if (contentText) {
      //   content = JSON.parse(contentText);
      // }
      // var log = {
      //   type: "restheart-response",
      //   // headers: JSON.parse(headers.substring(1, headers.length - 1)),
      //   status: response.getResponseCode(),
      //   headers: headers.substring(1, headers.length - 1),
      //   content: content
      // };
      // mongo.insert(Const.logsColl, log);
    }
    return response;
  } catch (e) {
    if (e) {
      var exceptionLog = {
        type: "error",
        error: e
      };
      mongo.insert(Const.logsColl, exceptionLog);
    }
    return null;
  }
}




restheart.insert = function(collection, data) {
  var db =Const.restheartUrl + collection;
  var option = getInsertOption(data);
  var response = UrlFetchApp.fetch(db, option);
  return response;
};

function testRestHeart(){
//  var data = {test: 'test'};
//  restheart.insert("Const.testColl", data);

//  var data = {test: 'test replace'};
//  restheart.replace("Const.testColl/5c75be5e294610d3cbaa39f9", null, data);

//  var data = {test: 'test get'};
//  restheart.get("Const.testColl/5c75be5e294610d3cbaa39f9", null, data);
//
//  var data = {test: 'test set'};
//  restheart.set("Const.testColl/5c75be5e294610d3cbaa39f9", null, data);


  var data = {"$addToSet":{"array" : "bar2"}};
  restheart.setOne("Const.testColl/5c75be5e294610d3cbaa39f9", data);
}

restheart.replace = function(collection, query, data) {
  var db =Const.restheartUrl + collection;
  if (query){
    db += "?" + query;
  }
  var option = getPutOption(data);
  var url = encodeURI(db);
  return request(url, option);
};

restheart.setOne = function(urlWithId, data) {
  var db =Const.restheartUrl + urlWithId;
  var option = getPatchOption(data);
  option.muteHttpExceptions = true;
  var url = encodeURI(db);
  return request(url, option);
}

restheart.setMany = function(collection, query, data) {
  var db =Const.restheartUrl + collection;
  if (query){
    db += "/*?" + query;
  }
  var option = getPatchOption(data);
  var url = encodeURI(db);
  return request(url, option);
};

restheart.set = restheart.setMany;
restheart.remove = function(collection, query) {
  var db =Const.restheartUrl + collection;
  if (query){
    db += "/*?" + query;
  }
  var option = getDeleteOption();
  var url = encodeURI(db);
  return request(url, option);
}

restheart.get = function(collection, query) {
  var db =Const.restheartUrl + collection;

  if (query){
    db += "?" + query;
  }

  var option = getGetOption();
  var url = encodeURI(db);
  
  var response = request(url, option);
  var  object = JSON.parse(response);
  if (object._embedded) {
    var result = object._embedded;
    return result;
  }
  return  object;
}

mongo = restheart;

function getInsertOption(data){
  var option = {
    "method": "post",
    'contentType': 'application/json',
    'headers': {"Authorization": "Basic " + Utilities.base64Encode(Const.restheartUser + ":" + Const.restheartPass)},
    "muteHttpExceptions": true, 
    "payload": JSON.stringify(data)
  }
  return option;
}
function getDeleteOption(){
  var option = {
    "method": "delete",
    'contentType': 'application/json',
    'headers': {"Authorization": "Basic " + Utilities.base64Encode(Const.restheartUser + ":" + Const.restheartPass)},
  }
  return option;
}
function getPutOption(data){
  var option = {
    "method": "put",
    'contentType': 'application/json',
    'headers': {"Authorization": "Basic " + Utilities.base64Encode(Const.restheartUser + ":" + Const.restheartPass)},
    "payload": JSON.stringify(data)
  }
  return option;
}
function getPatchOption(data){
  var option = {
    "method": "patch",
    'contentType': 'application/json',
    'headers': {"Authorization": "Basic " + Utilities.base64Encode(Const.restheartUser + ":" + Const.restheartPass)},
    "payload": JSON.stringify(data)
  }
  return option;
}
function getGetOption(){
  var option = {
    "method": "get",
    'headers': {"Authorization": "Basic " + Utilities.base64Encode(Const.restheartUser + ":" + Const.restheartPass)},
  }
  return option;
}
