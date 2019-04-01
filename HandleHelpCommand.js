function debugHelp() {
  debug();
}
function handleHelpCommand(body, paras, origParas) {
  var payload = {
    "method": "sendMessage",
    "chat_id": body.message.chat.id,
    "text": "",
    "parse_mode": "markdown",
    "disable_web_page_preview": true,	
  };
      payload.text += "欢迎使用群管机器人！！\n\n";
      payload.text += "以下是本BOT的独家命令："
        + "\n\n"
        + "/help - 输出帮助" + "\n"
        + "/admin - 机器人设置" + "\n"
        + "\n"
        ;

        

      payload.text += "本机器人由YuFeng Deng峰哥开发" + "\n"
        + "点击[此处](https://www.youtube.com/channel/UCG6xoef2xU86hnrCsS5m5Cw?sub_confirmation=1)订阅我的Youtube频道" + "\n"
        + "点击[此处](https://t.me/fengsharegroup)加入我的电报群" + "\n"
        ;
      return payload;

}
