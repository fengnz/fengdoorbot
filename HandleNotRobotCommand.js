function debugNotRobotCommand() {
  debug()
}

function generateSelfUnlockButtonMarkup() {
  var buttons = [];
  var button1 = {
    text: "点击这里解禁",
    callback_data: "notRobot:self"
  };

  buttons.push(button1);
  var inlineKeyboardMarkup = generateInlineKeyboardMarkup(buttons, 3);
  return inlineKeyboardMarkup;
}

function handleNotRobotCommand(body, paras, origParas) {

  var share =  getShareObject(body);
  var payload = share.payload;
  var chat = share.chat;
  var callback_query_id = share.callback_query_id;

  var payloads = [];

  if (chat.type.indexOf("group") < 0) {
    payload.text += "请将本机器人加入您的群中再使用此命令";
    return payload; 
  }

  var targetUser = origParas[1];

  if (paras[1] == "allowme") {
    payload.text = "如果你被禁言了，请点击以下按钮自助解禁";
    payload.reply_markup = generateSelfUnlockButtonMarkup();
    return payload;
  }

  if (targetUser == "self"){
    targetUser = share.from.id;
  }

  if (!/-?[0-9]+/.test(targetUser + "")) {
    return null;
  }

  targetUser = parseInt(targetUser);

  var isAdmin = isAdminOrCreator(share.from.id, share.chat.id);
  var isNotRobotCallback = (share.from.id + "") === origParas[1] && body.callback_query;

  if (isAdmin || isNotRobotCallback || origParas[1] =="self") {
    // update the member stats in db
    var find = {
      "user.id": targetUser,
    };

    var findString = JSON.stringify(find);
    var res = mongo.setMany(Const.memberColl, "filter=" + findString, { status: "normal" });
    var payload2 = {
      "method": "restrictChatMember",
      "chat_id": chat.id,
      "user_id": targetUser,
      "can_send_messages": true,
      "can_send_media_messages": true,
      "can_send_other_messages": true,
      "can_add_web_page_previews": true,
    };

    payload2.callback = function(res) {
      if (res.ok) {
        var chatMember = getChatMember(share.chat.id, targetUser);
        var username = getName(chatMember.user);
        var payload7 = {
          "method": "answerCallbackQuery",
          "callback_query_id": callback_query_id,
          "text": "解禁成功，" + username + "可以发言了",
        };
        payloads.push(payload7);

        // Send welcome message if needed
        var groupSettings = getGroupSettings(share.chat);
        share.new_chat_member = chatMember.user;
        // will send a seperate welcome message rather than edit message
        setWelcomePayload(share, groupSettings, payloads);

      }
    };

    payloads.push(payload2);

  } else {
    if (body.callback_query) {
      var answerCallBackQueryPayload = {
        "method": "answerCallbackQuery",
        "callback_query_id": callback_query_id,
        "text": "只有本群管理才可以使用此命令",
      };
      return answerCallBackQueryPayload;
    } else {
      payload.text += "只有本群管理才可以使用此命令";
      return payload;
    }
  }



  if (origParas[1] !="self") {
    // Delete this message when callback received
    var payload4 = {
      "method": "deleteMessage",
      "message_id": share.messageId,
      "chat_id": chat.id
    };

    payloads.push(payload4);
  } else {
    if (share.origText) {
      payload.text += share.origText;
      payload.text += "\n";
    }
    payload.text += getName(share.from) + "点了本按钮";
    payload.reply_markup = generateSelfUnlockButtonMarkup();
    payloads.push(payload);
  }


  return payloads;
}