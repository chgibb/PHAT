"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonFile = require("jsonfile");
let data = {};
let dataPath = "";
function loadData(path) {
    try {
        dataPath = path;
        data = jsonFile.readFileSync(path);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
exports.loadData = loadData;
function saveData() {
    console.log("Called save" + dataPath);
    try {
        try {
            data["application"]["operations"] = {};
        }
        catch (err) {
            console.log(err);
        }
        jsonFile.writeFileSync(dataPath, data, { spaces: 4 });
    }
    catch (err) {
        console.log(err);
    }
}
exports.saveData = saveData;
function getChannel(channel) {
    try {
        return data[channel];
    }
    catch (err) {
        return undefined;
    }
}
exports.getChannel = getChannel;
function createChannel(channel) {
    try {
        data[channel] = {};
        return true;
    }
    catch (err) {
        console.log("Could not get" + channel);
        return false;
    }
}
exports.createChannel = createChannel;
function getKey(channel, key) {
    try {
        return data[channel][key];
    }
    catch (err) {
        return undefined;
    }
}
exports.getKey = getKey;
function createKey(channel, key) {
    try {
        if (!getChannel(channel)) {
            createChannel(channel);
        }
        data[channel][key] = {};
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
exports.createKey = createKey;
function setKey(channel, key, val) {
    try {
        if (!getChannel(channel))
            createChannel(channel);
        if (!getKey(channel, key))
            createKey(channel, key);
        data[channel][key] = val;
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
exports.setKey = setKey;
function clearData() {
    data = {};
}
exports.clearData = clearData;
function stringifyData(replacer, space) {
    return JSON.stringify(data, replacer, space);
}
exports.stringifyData = stringifyData;
exports.keySubs = new Array();
function addSubscriberToKey(sub) {
    for (let i = 0; i != exports.keySubs.length; ++i) {
        if (exports.keySubs[i].replyChannel == sub.replyChannel &&
            exports.keySubs[i].channel == sub.channel &&
            exports.keySubs[i].key == sub.key)
            return;
    }
    exports.keySubs.push({
        channel: sub.channel,
        key: sub.key,
        replyChannel: sub.replyChannel
    });
}
exports.addSubscriberToKey = addSubscriberToKey;
function removeSubscriberFromKey(sub) {
    for (let i = exports.keySubs.length - 1; i >= 0; --i) {
        if (exports.keySubs[i].channel == sub.channel &&
            exports.keySubs[i].key == sub.key &&
            exports.keySubs[i].replyChannel == sub.replyChannel) {
            exports.keySubs.splice(i, 1);
        }
    }
}
exports.removeSubscriberFromKey = removeSubscriberFromKey;
