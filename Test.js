var testObject = {
   message_id: 4620,
   from_id: 539065210,
   chat_id: -1001226042286,
   new_chat_member_id: 605149962,
   callback_query_id: "2315267451523235823",
   text: "/admin",
   data: "notRobot:605149962",
};

var testNewMember = getNewMemberJoinJson(testObject);
var testGroupAdmin = getTextMessageJson(testObject);
var testCallback = getCallbackJson(testObject);


function debug() {
   Const.telegramChatIdsColl += "Debug";
   Const.telegramChatsColl += "Debug";
   Const.updateTimeColl += "Debug";
   Const.telegramChatUpdateTimeColl += "Debug";
   Const.drawColl += "Debug";
   Const.logColl += "Debug";
   Const.contextColl += "Debug";
   Const.groupSettingsColl += "Debug";
   Const.toTelegram += "Debug";
   Const.fromTelegram += "Debug";
   var e = {};
   e.postData = {};

   e.postData.contents = testNewMember;
   doPost(e);

}
function quickTest() {
   var payload = {
      "method": "sendMessage",
      "chat_id": "@FengDraw",
      "text": "Yes, will do",
      "parse_mode": "markdown",
      "disable_web_page_preview": false,
   };

   postTelegram(payload);

}
