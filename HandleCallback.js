function debugCallback(){
  debug();
}

function handleCallback(body) {
 
  var chatId = body.callback_query.message.chat.id + "";
  var chat = body.callback_query.message.chat;
  var from = body.callback_query.from;
  var messageId = body.callback_query.message.message_id;
  var payload = {
    "method": "editMessageText",
    "chat_id": chatId,
    "message_id": messageId,
    "text": "Callback received: " + body.callback_query.data,
    "parse_mode": "markdown",
    "disable_web_page_preview": false,
  };

  // remove carried info
  body.callback_query.data = body.callback_query.data.split('|||')[0];

  var lowerData = body.callback_query.data.toLowerCase();
  var paras = lowerData.split(":");
  var origParas = body.callback_query.data.split(":");

  var queryType = paras[0];

  switch(queryType){
    case "delchannelmsg": 
      if (paras.length > 0 && isDrawOwner(from.id, paras[1])) {
        var joinCode = paras[1];
        paras[0] = "delmsg";
        paras[1] = messageId + '';
        var payload = handleDelMsgCommand(body, paras, origParas);
        payload.callback = function(res) {
          if (res.ok) {
            //Find Draw by channel id and message id 
            var draw = findDrawsByJoinCode(joinCode);
            var chatId = body.callback_query.message.chat.id;
            var data = {
              "$pull": {
                "channelMsgs": {
                  "channelId": parseInt(chatId),
                  "messageId": messageId,
                }
              }
            };
            if (draw) {
                mongo.setOne(Const.drawColl + "/" + draw._id.$oid, data);
            }
          }
        };
        return payload;
      }
      return null;
    break;
    case "delme": 
      paras[0] = "delmsg";
      paras.push(messageId + "");
      return handleDelMsgCommand(body, paras, origParas);
    break;
    case "video":
      var pageToken = paras[1];
      var queryValue = paras[2];
      var keywordsArray = queryValue.split(" ");
      var videos = searchVideosByTitleKeyWords(keywordsArray, pageToken);
      if (videos.length > 0) {
        payload.text = "第" + pageToken + "页\n";
        payload = generateVideoPayload(payload, videos, queryValue, pageToken);
      }
      return payload;
      break;
    case "searchme":
      // var channelId = paras[1];
      // var pageToken = paras[2];
      // var queryValue = paras[3];
      // var keywordsArray = queryValue.split(" ");
      // var videos = searchAllVideosByTitleKeyWords(channelId, keywordsArray, pageToken);
      // if (videos.length > 0) {
      //   payload.text = "第" + pageToken + "页\n";
      //   payload = generateAllVideoPayload(payload, channelId, videos, queryValue, pageToken);
      // }

      // if (videos.length != 1) {
      //   payload.disable_web_page_preview = true;
      // }

        return handleSearchMeCommand(body, paras, origParas);
      break;
      case "draw":
        return handleDrawCommand(body, paras, origParas);
      break;
      case "updateme":
        return handleUpdateMeCommand(body, paras, origParas);
      break;
      case "ls":

        payload.text = "";

        var groupId = parseInt(chatId);
        var keywords = [""];

        var pageToken = paras[1];

        if (paras[2]) {
          keywords = paras.splice(2);
        }

        var channels = searchChannelsByKeywords(groupId, keywords, pageToken);
        if (channels && channels.length > 0) {
          payload = generateListPayload(payload, chat, channels, keywords.join(" "), pageToken);
        } else {
          payload.text += '啥也没找到！';
        }
        return payload;

      break;
      case "history":

        payload.text = "";

        var groupId = parseInt(chatId);
        var keywords = [""];

        var pageToken = paras[1];

        if (paras[2]) {
          keywords = paras.splice(2);
        }
        var messages = searchChatHistoryByKeywords(groupId, keywords, pageToken);
        if (messages && messages.length > 0) {
          payload = generateHistoryPayload(payload, chat, messages, keywords.join(" "), pageToken);
        } else {
          payload.text += '啥也没找到！';
        }
        return payload;

      break;
      case "admin":
        return handleAdminCommand(body, paras, origParas);
      break;
      case "notrobot":
        return handleNotRobotCommand(body, paras, origParas);
      break;
  }

  return payload;
}
  

