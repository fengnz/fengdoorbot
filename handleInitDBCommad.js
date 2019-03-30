function debugInitDB() {
    debug();
}

function handleInitDBCommand(body, paras, origParas) {
    var share = getShareObject(body);
    var payload = share.payload;

    try {
        mongo.replace(Const.memberColl, { "desc": "created by bot" });
        mongo.replace(Const.channelColl, { "desc": "created by bot" });
        mongo.replace(Const.channelIdsColl, { "desc": "created by bot" });
        mongo.replace(Const.telegramChatIdsColl, { "desc": "created by bot" });
        mongo.replace(Const.telegramChatsColl, { "desc": "created by bot" });
        mongo.replace(Const.updateTimeColl, { "desc": "created by bot" });
        mongo.replace(Const.telegramChatUpdateTimeColl, { "desc": "created by bot" });
        mongo.replace(Const.drawColl, { "desc": "created by bot" });
        mongo.replace(Const.contextColl, { "desc": "created by bot" });
        mongo.replace(Const.videoColl, { "desc": "created by bot" });
        mongo.replace(Const.logColl, { "desc": "created by bot" });
        mongo.replace(Const.videoDetailsColl, { "desc": "created by bot" });
        mongo.replace(Const.allVideosColl, { "desc": "created by bot" });
        mongo.replace(Const.groupSettingsColl, { "desc": "created by bot" });
        mongo.replace(Const.toTelegram, { "desc": "created by bot" });
        mongo.replace(Const.fromTelegram, { "desc": "created by bot" });
        payload.text += "数据库初始化成功";
    } catch (e) {
        payload.text += "数据库初始化失败";
        var exceptionLog = {
            type: "error",
            text: payload.text,
            error: e
        };
        console.log(exceptionLog);
    }
    return payload;
}