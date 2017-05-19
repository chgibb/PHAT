"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keySubs = new Array();
function subToKey(sub) {
    exports.keySubs.push({
        channel: sub.channel,
        key: sub.key,
        replyChannel: sub.replyChannel
    });
}
exports.subToKey = subToKey;
function unSubToKey(sub) {
    for (let i = exports.keySubs.length - 1; i >= 0; --i) {
        if (exports.keySubs[i].channel == sub.channel &&
            exports.keySubs[i].key == sub.key &&
            exports.keySubs[i].replyChannel == sub.replyChannel) {
            exports.keySubs.splice(i, 1);
        }
    }
}
exports.unSubToKey = unSubToKey;
