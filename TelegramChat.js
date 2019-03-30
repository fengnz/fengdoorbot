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