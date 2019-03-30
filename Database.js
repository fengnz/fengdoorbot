function debugDatabase(){
  var collectionName = Const.updateTimeColl;
  var data = {"x": 1}
  //insertToDB(collectionName, data);
  //
  
  var result = getLatestItemFromColl(collectionName);
  Logger.log(result);  
}


function getLatestItemFromColl(coll){
 var latestItems =  mongo.get(coll, 'sort={$natural:-1}&pagesize=1');
 if (latestItems.length > 0){
   return latestItems[0];
 }
 return null;
}

function clearCollection(collectionName){
  mongo.replace(collectionName, null, []);
}
// This function inserts a javascript object directly to a mongo db collection
function insertToDB(collectionName, data) {
  if (collectionName && data){  
    mongo.insert(collectionName, data)
  }
}

function getAllCollectionFromDB(collectionName){

  var option = getGetOption();
  var query = null;
  return mongo.get(collectionName, query);


}

