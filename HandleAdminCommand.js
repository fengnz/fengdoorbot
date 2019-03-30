function debugAdminCommand() {
  debug()
}

function handleAdminCommand(body, paras, origParas) {

  var share =  getShareObject(body);
  var payload = share.payload;
  var chat = share.chat;
  var callback_query_id = share.callback_query_id;

  delete payload.parse_mode;

  if (chat.type.indexOf("group") < 0) {
    payload.text += "请将本机器人加入您的群中再使用此命令";
    return payload; 
  }

  if (!isAdminOrCreator(share.from.id, share.chat.id)) {
    if (body.callback_query) {
      var answerCallBackQueryPayload = {
        "method": "answerCallbackQuery",
        "callback_query_id": callback_query_id,
        "text": "只有本群管理才可以使用此命令",
      };
      return answerCallBackQueryPayload;
    } else {
      payload.text += "只有本群管理才可以使用此命令";
      addDeleteMeButton(payload);
      return payload;
    }
  }

  var groupSettings = getGroupSettings(chat);

  if (paras[1]) {
    switch (paras[1]) {
      case 'notrobot':
        //设置进群验证
        if (paras[2]) {
          if (paras[2] == "status") {
            if (paras[3]) {
              if (paras[3] == "on") {
                if (gpSetFieldValue(chat, "notRobot.status", "on")) {
                  payload.text = "进群验证按钮启用成功";
                  groupSettings.notRobot.status = "on";
                } else {
                  payload.text = "进群验证按钮启用失败";
                }
              } else {
                if (gpSetFieldValue(chat, "notRobot.status", "off")) {
                  payload.text = "进群验证按钮禁用成功";
                  groupSettings.notRobot.status = "off";
                } else {
                  payload.text = "进群验证按钮禁用失败";
                }
              }
              payload.text += "\n";
            }

            if (groupSettings.notRobot.status && groupSettings.notRobot.status == "on") {
              groupSettings.notRobot.status = "on";
              payload.text += "进群验证按钮已打开, 点击以下按钮关闭";
            } else {
              groupSettings.notRobot.status = "off";
              payload.text += "进群验证按钮已关闭, 点击以下按钮打开";
            }

          }

          if (paras[2] == "timeout") {
            if (paras[3]) {
              if (/[0-9]+/.test(paras[3] + "")) {
                var timeout = parseInt(paras[3]);
                if (gpSetFieldValue(chat, "notRobot.timeout", timeout)) {
                  payload.text += "进群验证倒计时已经设置为: ";
                  payload.text += timeout;
                  groupSettings.notRobot.timeout = timeout;
                  payload.text += "\n";
                  if (timeout > 50) {
                    payload.text += "注意，超过50秒的倒计时需要在谷歌GAS设置触发器调用 removePendingUsers() 函数, 如果无法自动踢人请联系机器人服务器架设者";
                  }
                  if (timeout == 0) {
                    payload.text += "倒计时设置为0时，将不会自动踢除未验证的用户";
                  }
                } else {
                  payload.text = "进群验证倒计时设置失败";
                }
              } else {
                payload.text += "倒计时只能是数字，单位为妙钟";
              }
            }
          }
        } else {
          payload.text += "使用以下命令设置进群验证";
          payload.text += "\n";
          payload.text += "\n";
          payload.text += "/admin notRobot status - 开关进群验证，值可以是 on 或 off";
          payload.text += "\n";
          payload.text += "/admin notRobot timeout - 设置验证倒计时，可以是任何正数(秒)";
          payload.text += "\n";
          payload.text += "超过这个时间还没验证的用户会被踢出群. 设置成0则不踢";
          payload.text += "\n";
          payload.text += "注意！ 这个设置只对50秒以下的倒计时有效，超过这个时间, 你可以设置，但需要使用触发器定期踢出未验证的用户";
          //原因是超过1分钟后Telegram会一直重试，而GAS不支持异步
          payload.text += "\n";
        }

        setButtonsForAdminNotRobot(payload, groupSettings);
      break;
      case 'welcome':
        if (paras[3]) {
          var value = "off";
          if (paras[3] === "on") {
            value = "on";
          }
          switch (paras[2]) {
            case "customtext":
              // custom text uses different value rather than on or off
              value = origParas.splice(3).join(" ");
            case "status":
            case "desc":
            case "pinned":
            case "killme":
            case "custom":
              var success = gpSetFieldValue(chat, "welcome." + paras[2], value);
              if (success) {
                payload.text += "设置成功 - ";
                payload.text += paras[2] + ": " + value;
                payload.text += "\n";
                groupSettings.welcome[paras[2]] = value;
              } else {
                payload.text += "设置失败";
              }   
           
            break;
            default:
              payload.text += "不支持的参数\n";
            break;
          }
        }  

        var status = {};
        status["on"] = "【开】";
        status["off"] = "【关】";

        var toggle = {};
        toggle["on"] = "off";
        toggle["off"] = "on";

        if (!paras[3] && paras[2] === "customtext") {
          payload.text += '明白，要设置自定义欢迎词，请回复本消息把欢迎词发给我，你可以在欢迎词中使用以下变量：\n';
          payload.text += '$(desc) - 代表群描述\n';
          payload.text += '$(pinnedMessage) - 代表置顶消息\n';
          payload.text += '$(pinnedId) - 代表置顶消息的ID\n';
          payload.text += '$(pinnedUrl) - 代表置顶消息的链接（只有公开群有）\n';
          payload.text += '$(newMemberName) - 代表新成员的名字\n';
        } else {
          payload.text += '在这里可以打开欢迎词，欢迎词可选包含群描述和置顶消息，如果30秒自毁开启，欢迎词将在30秒后被删除\n';
          payload.text += '请问还有什么我可以帮你的吗？';
        }

        var buttons = [
          {
            text: "切换欢迎词" + status[groupSettings.welcome.status],
            callback_data: "admin:welcome:status:" + toggle[groupSettings.welcome.status]
          },
        ];


        if (groupSettings.welcome.status === "on") {
          if (groupSettings.welcome.custom === "on") {
            buttons.push(
              {
                text: "自定义消息" + status[groupSettings.welcome.custom],
                callback_data: "admin:welcome:custom:" + toggle[groupSettings.welcome.custom]
              }
            );

            buttons.push(
              {
                text: "编辑自定义消息",
                callback_data: "admin:welcome:customtext"
              }
            );

          } else {
            buttons.push(
              {
                text: "群描述" + status[groupSettings.welcome.desc],
                callback_data: "admin:welcome:desc:" + toggle[groupSettings.welcome.desc]
              }
            );

            buttons.push(
              {
                text: "置顶消息" + status[groupSettings.welcome.pinned],
                callback_data: "admin:welcome:pinned:" + toggle[groupSettings.welcome.pinned]
              }
            );

            buttons.push(
              {
                text: "自定义消息" + status[groupSettings.welcome.custom],
                callback_data: "admin:welcome:custom:" + toggle[groupSettings.welcome.custom]
              }
            );

          }

          buttons.push(
            {
              text: "30秒自毁" + status[groupSettings.welcome.killme],
              callback_data: "admin:welcome:killme:" + toggle[groupSettings.welcome.killme]
            }
          );


        }

        buttons.push(
          {
            text: "返回主菜单",
            callback_data: "admin"
          }
        );

        var inlineKeyboardMarkup = generateInlineKeyboardMarkup(buttons, 2);

        payload.reply_markup = inlineKeyboardMarkup;

        break;
      default:
        payload.text = "欢迎使用Admin命令\n"
          + "\n"
          + "输入 admin welcome 设置欢迎词"
          + "\n"
          + "输入 admin notRobot 设置进群验证"
          ;
        break;
    }

  } else {
    payload.text += "欢迎来到机器人设置\n";
    payload.text += "有什么我可以帮您的吗？\n";
    var buttons = [
      {
        text: "欢迎词设置",
        callback_data: "admin:welcome"
      },
      {
        text: "进群验证",
        callback_data: "admin:notrobot"
      }
    ];

    var inlineKeyboardMarkup = generateInlineKeyboardMarkup(buttons, 2);

    payload.reply_markup = inlineKeyboardMarkup;

  }
  return payload;

}



function setButtonsForAdminNotRobot(payload, groupSettings) {

  var status = {};
  status["on"] = "【开】";
  status["off"] = "【关】";

  var toggle = {};
  toggle["on"] = "off";
  toggle["off"] = "on";

  var buttons = [
  ];

  buttons.push(
    {
      text: "进群验证按钮" + status[groupSettings.notRobot.status],
      callback_data: "admin:notrobot:status:" + toggle[groupSettings.notRobot.status]
    }
  );


  if (groupSettings.notRobot.status == "on") {
    buttons.push(
      {
        text: "踢出倒计时【" + groupSettings.notRobot.timeout + "秒】" + "✅",
        callback_data: "admin:notrobot:timeout:" + groupSettings.notRobot.timeout,
      }
    );

    if (groupSettings.notRobot.timeout !== 0) {
      buttons.push(
        {
          text: "踢出倒计时【" + 0 + "秒】",
          callback_data: "admin:notrobot:timeout:" + 0,
        }
      );
    }
    if (groupSettings.notRobot.timeout !== 30) {
      buttons.push(
        {
          text: "踢出倒计时【" + 30 + "秒】",
          callback_data: "admin:notrobot:timeout:" + 30,
        }
      );
    }

    if (groupSettings.notRobot.timeout !== 50) {
      buttons.push(
        {
          text: "踢出倒计时【" + 50 + "秒】",
          callback_data: "admin:notrobot:timeout:" + 50,
        }
      );
    }

  }



  buttons.push(
    {
      text: "返回主菜单",
      callback_data: "admin"
    }
  );

  var inlineKeyboardMarkup = generateInlineKeyboardMarkup(buttons, 2);
  payload.reply_markup = inlineKeyboardMarkup;
}