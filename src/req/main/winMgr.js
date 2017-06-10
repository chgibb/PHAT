"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const dataMgr = require("./dataMgr");
class WindowRef {
    constructor(name, window) {
        this.name = name;
        this.window = window;
    }
}
exports.WindowRef = WindowRef;
let windows = new Array();
exports.windowCreators = {};
function pushWindow(refName, ref) {
    windows.push(new WindowRef(refName, ref));
}
exports.pushWindow = pushWindow;
function closeAllExcept(refName) {
    for (let i = windows.length - 1; i >= 0; --i) {
        try {
            windows[i].window.isResizable();
        }
        catch (err) {
            windows.splice(i, 1);
        }
    }
    for (let i = 0; i != windows.length; ++i) {
        if (windows[i].name != refName)
            windows[i].window.close();
    }
}
exports.closeAllExcept = closeAllExcept;
function getWindowsByName(refName) {
    let res = new Array();
    for (let i = windows.length - 1; i >= 0; --i) {
        try {
            windows[i].window.isResizable();
        }
        catch (err) {
            windows.splice(i, 1);
        }
    }
    for (let i = 0; i != windows.length; ++i) {
        if (windows[i].name == refName) {
            res.push(windows[i].window);
        }
    }
    return res;
}
exports.getWindowsByName = getWindowsByName;
function pushKeyTo(channel, key, refName, sender) {
    if (dataMgr.getChannel(channel)) {
        sender.send(refName, {
            replyChannel: refName,
            channel: channel,
            key: key,
            val: dataMgr.getKey(channel, key),
            action: "getKey"
        });
    }
}
exports.pushKeyTo = pushKeyTo;
function publishChangeForKey(channel, key) {
    for (let i = 0; i != dataMgr.keySubs.length; ++i) {
        if (dataMgr.keySubs[i].channel == channel) {
            let windows = getWindowsByName(dataMgr.keySubs[i].replyChannel);
            for (let k = 0; k != windows.length; ++k) {
                windows[k].webContents.send(dataMgr.keySubs[i].replyChannel, {
                    action: "keyChange",
                    channel: channel,
                    key: key,
                    val: dataMgr.getKey(channel, key)
                });
            }
        }
    }
}
exports.publishChangeForKey = publishChangeForKey;
function createWithDefault(title, refName, width, height, html, debug, alwaysOnTop, minWidth, minHeight) {
    let windowOptions = dataMgr.getKey(refName, "windowOptions");
    if (!windowOptions) {
        let display = electron.screen.getPrimaryDisplay();
        if (refName == "toolBar") {
            width = display.workArea.width / 4;
            height = display.workArea.height / 8;
        }
        let x = (display.workArea.width / 2) - (width / 2);
        let y = 0;
        windowOptions =
            {
                x: x,
                y: y,
                width: width,
                height: height,
                useContentSize: false,
                center: true,
                minWidth: minWidth,
                minHeight: minHeight,
                resizable: true,
                movable: true,
                minimizable: true,
                maximizable: true,
                closable: true,
                alwaysOnTop: alwaysOnTop,
                fullscreen: false,
                title: title,
                icon: './../icon.png'
            };
        dataMgr.setKey(refName, "windowOptions", windowOptions);
    }
    let ref = new BrowserWindow(windowOptions);
    ref.loadURL(html);
    if (debug)
        ref.webContents.openDevTools();
    ref.on('close', function () {
        saveBounds(ref, refName);
    });
    ref.on('move', function () {
        saveBounds(ref, refName);
    });
    ref.on('resize', function () {
        saveBounds(ref, refName);
    });
    return ref;
}
exports.createWithDefault = createWithDefault;
function saveBounds(ref, refName) {
    let x;
    let y;
    let width;
    let height;
    let pos = ref.getPosition();
    let dimensions = ref.getSize();
    x = pos[0];
    y = pos[1];
    width = dimensions[0];
    height = dimensions[1];
    let windowOptions = dataMgr.getKey(refName, "windowOptions");
    if (!windowOptions) {
        return;
    }
    let change = false;
    if (windowOptions.x != x) {
        windowOptions.x = x;
        change = true;
    }
    if (windowOptions.y != y) {
        windowOptions.y = y;
        change = true;
    }
    if (windowOptions.width != width) {
        windowOptions.width = width;
        change = true;
    }
    if (windowOptions.height != height) {
        windowOptions.height = height;
        change = true;
    }
    if (change)
        dataMgr.setKey(refName, "windowOptions", windowOptions);
}
exports.saveBounds = saveBounds;
