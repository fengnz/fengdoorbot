function debugHandleNewMember() {
  debug();
}

function handleNewMember(body) {
  console.log("handleNewMember called");
  var share = getShareObject(body);
  var groupSettings = getGroupSettings(share.chat);
  var payloads = [];

  if (groupSettings.notRobot.status && groupSettings.notRobot.status == "on") {
    setVerifyPayload(share, groupSettings, payloads);
  } else {
    // Welcome will only be shown after user verify them
    setWelcomePayload(share, groupSettings, payloads);
  }

  return payloads;
}


function getMessageUrl(messageId, chatUsername) {
  var url = "https://t.me/";
  url += escapeMarkDown(chatUsername) + "/";
  url += messageId;
  return url;
}

function setWelcomePayload(share, groupSettings, payloads) {
  if (!share.new_chat_member) {
    share.new_chat_member = share.from;
  }
  var mentionName = getMentionName(share.new_chat_member);
  if (groupSettings.welcome.status == "on") {
    var payload = share.payload;
    // For sending welcome message, always send a new message rather than update a message
    payload.method = "sendMessage";
    delete payload.message_id;
    payloads.push(payload);

    if (groupSettings.welcome.killme === "on") {
      payload.text += "本消息将在30秒后自毁";
      payload.text += "\n";

      payload.callback = function (res) {
        if (res.ok) {
          var deleteWelcomePayload = {
            "method": "deleteMessage",
            "message_id": res.result.message_id,
            "chat_id": share.chat.id,
          };

          deleteWelcomePayload.delay = 30;
          payloads.push(deleteWelcomePayload);
        }
      };
    }

    var chat = getChatById(share.chat.id);
    if (groupSettings.welcome.custom === "on") {
      if (groupSettings.welcome.customtext) {
        var text = groupSettings.welcome.customtext;
        text = escapeMarkDown(text);


        if (chat.description) {
          text = text.replace(/\$\(desc\)/g, escapeMarkDown(chat.description));
        } else {
          text = text.replace(/\$\(desc\)/g, "");
        }
        if (chat.pinned_message) {
          text = text.replace(/\$\(pinnedMessage\)/gi, escapeMarkDown(chat.pinned_message.text));
          text = text.replace(/\$\(pinnedId\)/gi, chat.pinned_message.message_id);
          if (chat.username) {
            text = text.replace(/\$\(pinnedUrl\)/gi, getMessageUrl(chat.pinned_message.message_id, chat.username));
          } else {
            text = text.replace(/\$\(pinnedUrl\)/gi, "");
          }
        } else {
          text = text.replace(/\$\(pinnedMessage\)/gi, "");
          text = text.replace(/\$\(pinnedId\)/gi, "");
          text = text.replace(/\$\(pinnedUrl\)/gi, "");
        }

        text = text.replace(/\$\(newMemberName\)/gi, mentionName);

        payload.text += text;

      } else {
        return null;
      }

    } else {
      payload.text += "本BOT代表本群所有人热烈欢迎新成员: " + mentionName;
      payload.text += "\n";
      if (groupSettings.welcome.desc === "on") {
        if (chat.description) {
          payload.text += "\n";
          payload.text += "请遵循本群规则";
          payload.text += "\n";
          payload.text += escapeMarkDown(chat.description);
        }
      }

      if (groupSettings.welcome.pinned === "on") {
        if (chat.pinned_message) {
          payload.text += "\n";
          if (chat.username) {
            payload.text += "请务必读一下置顶消息";
            payload.text += "\n";
            payload.text += getMessageUrl(chat.pinned_message.message_id, chat.username);

          } else {
            payload.text += "\n";
            payload.text += escapeMarkDown(chat.pinned_message.text);
          }
        }
      }
    }
  }
}

function setVerifyPayload(share, groupSettings, payloads) {
  if (groupSettings.notRobot.status && groupSettings.notRobot.status == "on") {

    var me = getChatMember(share.chat.id, Const.myId);
    if (me.can_restrict_members) {
      var restrictPayload = {
        method: 'restrictChatMember',
        chat_id: share.chat.id,
        user_id: share.new_chat_member.id,
        can_send_messages: false,
        can_send_media_messages: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false
      };
      payloads.push(restrictPayload);
      var askVerifyPayload = {
        method: 'sendMessage',
        chat_id: share.chat.id,
        text: '',
        parse_mode: 'markdown',
        disable_web_page_preview: true
      };
      askVerifyPayload.text = '进群验证已启用\n';
      askVerifyPayload.text +=
        '您好! ' + getMentionName(share.new_chat_member) + '!';
      askVerifyPayload.text += ' 别忘了点击以下按钮获取发言权限!';
      askVerifyPayload.text += '\n';

      if (groupSettings.notRobot.timeout > 0) {
        askVerifyPayload.text += '如果 *';
        askVerifyPayload.text += groupSettings.notRobot.timeout;
        askVerifyPayload.text += "* 秒内你没有点击以下按钮，你将被踢出群，你可以在一分钟后重新加入, ";
        askVerifyPayload.text += "如果无法加入请重启Telegram";
        askVerifyPayload.text += "\n";
        askVerifyPayload.text += "注: 管理员点以下按钮也可放行";
      }

      var buttons = [];
      var button1 = {
        text: "🈸" + ' - 申请入群',
        callback_data: 'notRobot:' + share.new_chat_member.id
      };

      buttons.push(button1);

      var inlineKeyboardMarkup = generateInlineKeyboardMarkup(buttons, 3);

      askVerifyPayload.reply_markup = inlineKeyboardMarkup;

      // Add this guy to pending list

      var timeout = 30;

      if (groupSettings.notRobot && groupSettings.notRobot.timeout) {
        timeout = groupSettings.notRobot.timeout;
      }

      var newMember = {
        status: 'pending',
        date: parseInt(Date.now() / 1000),
        timeout: timeout,
        user: share.new_chat_member,
        chat: share.chat
      };

      var query = {
         'user.id': newMember.user.id,
         'chat.id': share.chat.id
      };

      // Remove old entries of this user from db
      mongo.remove(Const.memberColl, 'filter=' + JSON.stringify(query));
      // Add this user to db
      mongo.insert(Const.memberColl, newMember);

      if (
        groupSettings.notRobot.timeout > 0 &&
        groupSettings.notRobot.timeout <=  50
      ) {
        setAskVerifyCallBackPayloads(share, askVerifyPayload, payloads, timeout);
      }

      //make sure askVerifyPayload is the last one pushed.
      payloads.push(askVerifyPayload);

    }
  }
}


function setAskVerifyCallBackPayloads(share, askVerifyPayload, payloads, timeout){
  askVerifyPayload.callback = function (res) {
    // Wait till timeout before decide to kick
    Utilities.sleep(timeout * 1000);
    if (res.ok) {
      var find = {
        "user.id": share.new_chat_member.id,
        "chat.id": share.chat.id,
        "status": "pending",
      };

      var findString = JSON.stringify(find);
      var members = mongo.get(Const.memberColl, "filter=" + findString);
      if (members.length > 0) {
        var member = members[0];

        //based on the gap between now and member join date, we decided whether need to add the kick payload
        var pending_time = Date.now() / 1000 - member.date;
        if (pending_time > member.timeout && member.timeout != 0) {
          // The user will be kicked and ban for 1 minute
          var kickPayload = {
            "method": "kickChatMember",
            "chat_id": member.chat.id,
            "user_id": member.user.id,
            "until_date": Date.now() / 1000 + 60,
          };

          kickPayload.callback = function(res) {
            if (res.ok) {
              var data = { status: "kicked" };
              var setData = { "$set": data };
              mongo.setOne(Const.memberColl + "/" + member._id.$oid, setData);
            }
          };


          var deleteAskVerifyPayload = {
            "method": "deleteMessage",
            "message_id": res.result.message_id,
            "chat_id": share.chat.id,
          };

          // Add kick and delete payload, which will be sent after deleting welcome message (if has)
          payloads.push(kickPayload);
          payloads.push(deleteAskVerifyPayload);
        }
      }
    }
  };
}