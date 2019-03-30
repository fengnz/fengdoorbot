function getAllTelegramChatInfo() {
  Const.clearCollection(Const.telegramChatsColl);
  var telegramChatIds = getLatestTelegramChatIds();
  var telegramChatInfos = [];
  for (var i = 0; i < telegramChatIds.length; i++) {
    var telegramChatId = telegramChatIds[i].trim();
    if (telegramChatId){
      var payload = {
        "method": "getChat",
        "chat_id": telegramChatId
      };
      var chat = postTelegram(payload);
      if (chat.ok){
        telegramChatInfos.push(chat.result);
      }
    }
  }
  
  if (telegramChatInfos.length > 0){
    insertToDB(Const.telegramChatUpdateTimeColl, {updateTime: new Date()});
    insertToDB(Const.telegramChatsColl, telegramChatInfos); 
    return true;
  }
  return false;
}

function getChatTitlesWithLinks(){
  var dataTGChats = getAllCollectionFromDB(Const.telegramChatsColl);
  var tgChatTitleWithLinks = dataTGChats.map(function(chat){
    return chat.title + " - @" + chat.username;
  });
  
  return tgChatTitleWithLinks;

}

function getChatById(chatId){
  if (chatId) {
    var payload = {
      "method": "getChat",
      "chat_id": chatId
    };
    var res = postTelegram(payload);
    if (res.ok) {
      return res.result;
    }
  }
  return null;
}


function getChatMember(chatId, userId) {
  var payload = {
    "method": "getChatMember",
    "chat_id": chatId,
    "user_id": userId
  };
  var chatMember = postTelegram(payload);

  if (chatMember.result) {
    return chatMember.result;
  }
  return null;

}