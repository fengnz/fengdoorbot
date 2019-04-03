var groupSettings;
function debugGroup() {
  debug();
}

var defaultWelcome = {
  status: "on",
  desc: "on",
  pinned: "on",
  killme: "on",
  custom: "off",
  customtext: "您还没有设置自定义欢迎词"
};

var defaultNotRobot = {
  status: "on",
  timeout: 0
};


//Field is a string (can use dot notation), value is a json object 
function gpSetFieldValue(group, field, value) {
  try {
    // will return a default group settings in memory if not found
    var groupSettings = getGroupSettings(group);
    var data = {};
    data[field] = value;
    if (!groupSettings._id) {
      mongo.insert(Const.groupSettingsColl, groupSettings);
    }
    
    var setData = {"$set": data};
    
    var res = mongo.setOne(Const.groupSettingsColl + "/" + groupSettings._id.$oid, setData);
    if (res.getResponseCode() != 200) {
      console.log(res.getContentText());
    }
    return true;
  } catch (e) {
    return false;
  }
}

function getGroupSettings(group)
{
  var query = {
    "group.id": group.id + "",
  };

  var q = JSON.stringify(query);
  var groupSettingss = mongo.get(Const.groupSettingsColl, "filter=" + q);
  if (groupSettingss.length > 0) {
    groupSettings =  groupSettingss[0];
  }

  if (!groupSettings) {
    groupSettings = {};
    groupSettings.group= group;
    groupSettings.welcome = defaultWelcome;
    groupSettings.notRobot = defaultNotRobot;
  }

  return groupSettings;
}