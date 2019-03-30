function getLatestTelegramChatIds(){
 var latestTelegramChatIds =  mongo.get(Const.telegramChatIdsColl, 'sort={createdTimeInt:-1}&pagesize=1')[0].telegramChatIds;
 return latestTelegramChatIds;
}


function addOneTelegramChatId(id){
  if (!isValidTelegramChatId(id)){
    return false;
  }
  
  var latestTelegramChatIds = [];
  
  
  try{
    latestTelegramChatIds = getLatestTelegramChatIds();
  } catch (e) {
  }
  
  latestTelegramChatIds.push(id);
  latestTelegramChatIds = latestTelegramChatIds.unique();

  try{
    mongo.insert(Const.telegramChatIdsColl, { createdTimeInt: Date.now(), createdTime: new Date(), telegramChatIds: latestTelegramChatIds });
    return true;
  } catch(e) {
    return false;
  }
}
function removeOneTelegramChatId(id){
  if (!isValidTelegramChatId(id)){
    return false;
  }
  
  var latestTelegramChatIds = [];
  
  try{
    latestTelegramChatIds = getLatestTelegramChatIds();
  } catch (e) {
  }
  
  // Remove that id
  var index = latestTelegramChatIds.indexOf(id);
  if (index !== -1) {
    latestTelegramChatIds.splice(index, 1);
  }
  latestTelegramChatIds = latestTelegramChatIds.unique();

  try{
    mongo.insert(Const.telegramChatIdsColl, { createdTimeInt: Date.now(), createdTime: new Date(), telegramChatIds: latestTelegramChatIds });
    return true;
  } catch(e) {
    return false;
  }
}
