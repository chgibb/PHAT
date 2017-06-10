"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atomicOperationsIPC_1 = require("./req/atomicOperationsIPC");
const cf = require("./req/renderer/circularFigure");
let align;
let contiguuid;
let circularFigure;
let colour;
let flags = new atomicOperationsIPC_1.CompletionFlags();
process.on("message", function (ev) {
    if (ev.setData == true) {
        align = ev.data.alignData;
        contiguuid = ev.data.contiguuid;
        circularFigure = ev.data.circularFigure;
        colour = ev.data.colour;
        process.send({ finishedSettingData: true });
        return;
    }
    if (ev.run == true) {
        cf.cacheCoverageTrack(circularFigure, contiguuid, align, function (status, coverageTracks) {
            if (status == true) {
                flags.done = true;
                flags.success = true;
                process.send({
                    update: true,
                    flags: flags,
                    data: {
                        alignData: align,
                        contiguuid: contiguuid,
                        circularFigure: circularFigure,
                        colour: colour
                    }
                });
                process.exit(0);
            }
        }, colour);
    }
});
process.on("uncaughtException", function (err) {
    flags.done = true;
    flags.failure = true;
    flags.success = false;
    process.send({
        update: true,
        flags: flags,
        data: err
    });
    process.exit(1);
});
