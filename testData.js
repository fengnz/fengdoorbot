
function getNewMemberJoinJson (testObject) {
    var json = {
        "update_id": 220377717,
        "message": {
            "message_id": testObject.message_id,
            "from": {
                "id": testObject.from_id,
                "is_bot": false,
                "first_name": "Yufeng Deng",
                "last_name": "峰哥",
                "username": "fennng",
                "language_code": "en"
            },
            "chat": {
                "id": testObject.chat_id,
                "title": "机器人测试",
                "username": "botTestingGroup1",
                "type": "supergroup"
            },
            "date": 1553848321,
            "new_chat_participant": {
                "id": testObject.new_chat_member_id,
                "is_bot": false,
                "first_name": "峰哥",
                "last_name": "新西兰",
                "username": "fennng1",
                "language_code": "en"
            },
            "new_chat_member": {
                "id": testObject.new_chat_member_id,
                "is_bot": false,
                "first_name": "峰哥",
                "last_name": "新西兰",
                "username": "fennng1",
                "language_code": "en"
            },
            "new_chat_members": [
                {
                    "id": testObject.new_chat_member_id,
                    "is_bot": false,
                    "first_name": "峰哥",
                    "last_name": "新西兰",
                    "username": "fennng1",
                    "language_code": "en"
                }
            ]
        },
    };
    
    return JSON.stringify(json);

}

function getReplyTextMessageJson (testObject) {
    var json = {
        "update_id": 943707030,
        "message": {
          "message_id": 5487,
          "from": {
            "id": 539065210,
            "is_bot": false,
            "first_name": "Yufeng Deng",
            "last_name": "峰哥",
            "username": "fennng",
            "language_code": "en"
          },
          "chat": {
            "id": "-1001226042286",
            "title": "机器人测试",
            "username": "botTestingGroup1",
            "type": "supergroup"
          },
          "date": 1556633609,
          "reply_to_message": {
            "message_id": 5481,
            "from": {
              "id": 646807833,
              "is_bot": true,
              "first_name": "YoutubeChannels",
              "username": "YoutubeChannelsBot"
            },
            "chat": {
              "id": -1001226042286,
              "title": "机器人测试",
              "username": "botTestingGroup1",
              "type": "supergroup"
            },
            "date": 1556631162,
            "text": "欢迎来到机器人设置有什么我可以帮您的吗？"
          },
          "text": "/ban",
          "entities": [
            {
              "offset": 0,
              "length": 6,
              "type": "bot_command"
            }
          ]
        }
      };
    
    return JSON.stringify(json);

}
function getTextMessageJson (testObject) {
    var json = {
        "update_id": 220377809,
        "message": {
            "message_id": testObject.message_id,
            "from": {
                "id": testObject.from_id,
                "is_bot": false,
                "first_name": "Yufeng Deng",
                "last_name": "峰哥",
                "username": "fennng",
                "language_code": "en"
            },
            "chat": {
                "id": testObject.chat_id,
                "title": "机器人测试",
                "username": "botTestingGroup1",
                "type": "supergroup"
            },
            "date": 1553870116,
            "text": testObject.text,
            "entities": [
                {
                    "offset": 0,
                    "length": 6,
                    "type": "bot_command"
                }
            ]
        },
    };
    
    return JSON.stringify(json);

}

function getCallbackJson (testObject) {
    var json = {
        "update_id": 220377918,
        "callback_query": {
            "id": testObject.callback_query_id,
            "from": {
                "id": testObject.from_id,
                "is_bot": false,
                "first_name": "Yufeng Deng",
                "last_name": "峰哥",
                "username": "fennng",
                "language_code": "en"
            },
            "message": {
                "message_id": testObject.message_id,
                "from": {
                    "id": Const.myId,
                    "is_bot": true,
                    "first_name": "大掌门",
                    "username": Const.myName
                },
                "chat": {
                    "id": testObject.chat_id,
                    "title": "机器人测试",
                    "username": "botTestingGroup1",
                    "type": "supergroup"
                },
                "date": 1553891404,
                "edit_date": 1553896150,
                "text": "设置成功"
            },
            "chat_instance": "-5740812822820918856",
            "data": testObject.data,
        },
    };
    
    return JSON.stringify(json);

}