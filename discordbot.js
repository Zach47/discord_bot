var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var steamApi = require("steam-api");
var jsonMapId = {};
var maplist = [];
var STEAM_API_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var optionalSteamId = "";
var TPKZTTime = "NA";
var ProKZTTime = "NA";
var TPKZTPlayer = "NA";
var ProKZTPlayer = "NA";

var TPSKZTime = "NA";
var ProSKZTime = "NA";
var TPSKZPlayer = "NA";
var ProSKZPlayer = "NA";

var ProVNLTime = "NA";
var TPVNLTime = "NA";
var ProVNLPlayer = "NA";
var TPVNLPlayer = "NA";
var kzstatsLink = "https://www.jacobwbarrett.com/kreedz/gokzstats.html";

// https://www.npmjs.com/package/steam-api
var user = new steamApi.User(STEAM_API_KEY, optionalSteamId);
var userStats = new steamApi.UserStats(STEAM_API_KEY, optionalSteamId);
var news = new steamApi.News(STEAM_API_KEY);
var app = new steamApi.App(STEAM_API_KEY);
var player = new steamApi.Player(STEAM_API_KEY, optionalSteamId);
var inventory = new steamApi.Inventory(STEAM_API_KEY, optionalSteamId);
var items = new steamApi.Items(STEAM_API_KEY, optionalSteamId);


const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "!"

/* https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds */
function str_pad_left(string,pad,length) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}

function timeConvert(time) {
  ms = time.toString().split(".");
  // API sends a time that ends with ".000" as just a whole number (Discovery: 12.000 is sent as 12). This fixes that.
  if (!ms[1]) {
    ms[1] = "000";
  }
  if (ms[1].length === 1) {
    ms[1] += "0";
  }
  if (time >= 3600.00) {
    hours = Math.floor(time / 3600.00);
    minutes = Math.floor(time % 3600.00 /60.00);
    seconds = Math.floor(time % 60.00);
    return str_pad_left(hours,'',2)+':'+str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2) +'.'+ ms[1].substr(0,2);
  }
  else if (time === "NA") {
    return "NA";
  }
  else if (time < 60) {
    seconds = Math.floor(time % 60.00);
    return str_pad_left(seconds,'0',2)+"."+ms[1].substr(0,2);
  }
  else {
    minutes = Math.floor(time % 3600.00 /60.00);
    seconds = Math.floor(time % 60.00);
    return str_pad_left(minutes,'',2)+':'+str_pad_left(seconds,'0',2)+'.'+ ms[1].substr(0,2); // "time" is milliseconds
  }
}


function loadMap(map) {
  for (i=0;i<maplist.length;i++) {
    if (maplist[i].indexOf(map) !== -1) {
      mapName = maplist[i];
      return true;
    }
  }
}

function printToChat(message, map) {


  message.channel.send({embed: {
    color: 0xE45051,
    title: mapName,
    url: kzstatsLink + "?map=" + mapName,
    thumbnail: {
      url: "http://www.kzstats.com/img/map/" + mapName + ".jpg"
    },
    fields: [
      {
        name: "Pro Record",
        value: "- - - - - - - -",
        inline: true
      },
      {
        name: "Overall Record",
        value: "- - - - - - - -",
        inline: true
      },
      {
        name: "KZTimer",
        value: (ProKZTTime === "NA" ? "NA" : timeConvert(ProKZTTime) + " - " + ProKZTPlayer),
        inline: true
      },
      {
        name: "KZTimer",
        value: (TPKZTTime === "NA" ? "NA" : timeConvert(TPKZTTime) + " - " + TPKZTPlayer),
        inline: true
      },
      {
        name: "SimpleKZ",
        value: (ProSKZTime === "NA" ? "NA" : timeConvert(ProSKZTime) + " - " + ProSKZPlayer),
        inline: true
      },
      {
        name: "SimpleKZ",
        value: (TPSKZTime === "NA" ? "NA" : timeConvert(TPSKZTime) + " - " + TPSKZPlayer),
        inline: true
      },
      {
        name: "Vanilla",
        value: (ProVNLTime === "NA" ? "NA" : timeConvert(ProVNLTime) + " - " + ProVNLPlayer),
        inline: true
      },
      {
        name: "Vanilla",
        value: (TPVNLTime === "NA" ? "NA" : timeConvert(TPVNLTime) + " - " + TPVNLPlayer),
        inline: true
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: "https://i.imgur.com/BAgjSOP.png",
      text: "Created by Zach47"
    }
  }
});
TPKZTTime = "NA";
TPSKZTime = "NA";
TPVNLTime = "NA";
ProKZTTime = "NA";
ProSKZTime = "NA";
ProVNLTime = "NA";
ProVNLPlayer = "NA";
TPVNLPlayer = "NA";
TPSKZPlayer = "NA";
ProSKZPlayer = "NA";
TPKZTPlayer = "NA";
ProKZTPlayer = "NA";
}

function mapInfoRequest() {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://www.jacobwbarrett.com/js/mapListNew.js', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var maps = JSON.parse(request.responseText);
      for (i=0;i<maps.length;i++) {
        if (maps[i].Global === 0) { return; }
        else if (maps[i].id === undefined) { return; }
        else {
          jsonMapId[maps[i].id] = [maps[i].mapname,maps[i].workshop_id,maps[i].difficulty_id];
          maplist.push(jsonMapId[maps[i].id][0]);
        }
      }
    } else { console.log("brokered"); }
  };
  request.onerror = function() { console.log("mega brokered"); };
  request.send();
}

function getProKZTRecord(map) {
  var request = new XMLHttpRequest();
  var APIRecordLink = "https://kztimerglobal.com/api/v1/records/top?map_name=" + mapName + "&tickrate=128&stage=0&modes_list_string=kz_timer&has_teleports=false&limit=1";
  request.open('GET', APIRecordLink, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      data = JSON.parse(request.responseText);

      if(data[0] === void 0) {
        return;
      }

      else if (!data[0].time.toString().length > 0) {
        ProKZTTime = "NA";
      } else{
        ProKZTTime = data[0].time;
        if (data[0].player_name.length < 20) {
          ProKZTPlayer = data[0].player_name;
        } else {
          ProKZTPlayer = data[0].player_name.substr(0, 17) + "...";
        }
      }
    }
    request.onerror = function() {
      console.log("mega brokered");
    }
  }
  request.send();
}

function getProSKZRecord(map) {
  var request = new XMLHttpRequest();
  var APIRecordLink = "https://kztimerglobal.com/api/v1/records/top?map_name=" + mapName + "&tickrate=128&stage=0&modes_list_string=kz_simple&has_teleports=false&limit=1";
  request.open('GET', APIRecordLink, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      data = JSON.parse(request.responseText);

      if(data[0] === void 0) {
        return;
      }


      else if (!data[0].time.toString().length > 0) {
        ProSKZTime = "NA";
      } else{
        ProSKZTime = data[0].time;
        if (data[0].player_name.length < 20) {
          ProSKZPlayer = data[0].player_name;
        } else {
          ProSKZPlayer = data[0].player_name.substr(0, 17) + "...";
        }
      }
    }
    request.onerror = function() {
      console.log("mega brokered");
    }
  }
  request.send();
}

function getProVNLRecord(map) {
  var request = new XMLHttpRequest();
  var APIRecordLink = "https://kztimerglobal.com/api/v1/records/top?map_name=" + mapName + "&tickrate=128&stage=0&modes_list_string=kz_vanilla&has_teleports=false&limit=1";
  request.open('GET', APIRecordLink, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      data = JSON.parse(request.responseText);

      if(data[0] === void 0) {
        return;
      }


      else if (!data[0].time.toString().length > 0) {
        ProVNLTime = "NA";
      } else{
        ProVNLTime = data[0].time;
        if (data[0].player_name.length < 20) {
          ProVNLPlayer = data[0].player_name;
        } else {
          ProVNLPlayer = data[0].player_name.substr(0, 17) + "...";
        }
      }
    }
    request.onerror = function() {
      console.log("mega brokered");
    }
  }
  request.send();
}

function getTPKZTRecord(map) {
  var request = new XMLHttpRequest();
  var APIRecordLink = "https://kztimerglobal.com/api/v1/records/top?map_name=" + mapName + "&tickrate=128&stage=0&modes_list_string=kz_timer&limit=1";
  request.open('GET', APIRecordLink, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      data = JSON.parse(request.responseText);

      if(data[0] === void 0) {
        return;
      }


      else if (!data[0].time.toString().length > 0) {
        TPKZTTime = "NA";
      } else{
        TPKZTTime = data[0].time;
        if (data[0].player_name.length < 20) {
          TPKZTPlayer = data[0].player_name;
        } else {
          TPKZTPlayer = data[0].player_name.substr(0, 17) + "...";
        }
      }
    }
    request.onerror = function() {
      console.log("mega brokered");
    }
  }
  request.send();
}

function getTPSKZTRecord(map) {
  var request = new XMLHttpRequest();
  var APIRecordLink = "https://kztimerglobal.com/api/v1/records/top?map_name=" + mapName + "&tickrate=128&stage=0&modes_list_string=kz_simple&limit=1";
  request.open('GET', APIRecordLink, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      data = JSON.parse(request.responseText);

      if(data[0] === void 0) {
        return;
      }


      else if (!data[0].time.toString().length > 0) {
        TPSKZTime = "NA";
      } else{
        TPSKZTime = data[0].time;
        if (data[0].player_name.length < 20) {
          TPSKZPlayer = data[0].player_name;
        } else {
          TPSKZPlayer = data[0].player_name.substr(0, 17) + "...";
        }
      }
    }
    request.onerror = function() {
      console.log("mega brokered");
    }
  }
  request.send();
}

function getTPVNLRecord(map) {
  var request = new XMLHttpRequest();
  var APIRecordLink = "https://kztimerglobal.com/api/v1/records/top?map_name=" + mapName + "&tickrate=128&stage=0&modes_list_string=kz_vanilla&limit=1";
  request.open('GET', APIRecordLink, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      data = JSON.parse(request.responseText);

      if(data[0] === void 0) {
        return;
      }


      else if (!data[0].time.toString().length > 0) {
        TPVNLTime = "NA";
      } else{
        TPVNLTime = data[0].time;
        if (data[0].player_name.length < 20) {
          TPVNLPlayer = data[0].player_name;
        } else {
          TPVNLPlayer = data[0].player_name.substr(0, 17) + "...";
        }
      }
    }
    request.onerror = function() {
      console.log("mega brokered");
    }
  }
  request.send();
}


client.on('ready', () => {
  console.log('I am ready!');
  mapInfoRequest();
});


client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (!message.content.indexOf("!") === 0 || message.content.indexOf("!") === -1) {
    return;
  }

  if(command === "servers") {
    message.channel.send("List of KZ Servers | http://www.kzstats.com/servers/");
    return;
  }

  if(command === "kzstats") {
    message.channel.send("KZStats | http://www.kzstats.com/");
    return;
  }

  if(command === "gokzstats") {
    message.channel.send("GOKZStats | https://www.jacobwbarrett.com/kreedz/gokzstats.html");
    return;
  }

  if (command === "help") {
    message.channel.send("Need to know the commands? Go here! | <https://github.com/Zach47/discord_bot>")
  }

  if (command === 'maptop') {
    if (message.content.split(" ")[1] == void 0) {
      message.channel.send("You forgot a map name! " + message.author);
      return;
    }
    else if (!loadMap(message.content.split(" ")[1].toLowerCase())) {
      message.channel.send("That's not a map! " + message.author);
    }
    else {
      getTPKZTRecord(mapName);
      getProKZTRecord(mapName);
      getTPSKZTRecord(mapName);
      getProSKZRecord(mapName);
      getTPVNLRecord(mapName);
      getProVNLRecord(mapName);
      setTimeout(function() {printToChat(message,mapName);}, 1500);
    }
  }
});

client.login('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
