"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const atomic = require("./atomicOperations");
const getAppPath_1 = require("./../getAppPath");
class RenderSNPTrackForContig extends atomic.AtomicOperation {
    constructor() {
        super();
    }
    setData(data) {
        this.circularFigure = data.circularFigure;
        this.contiguuid = data.contiguuid;
        this.alignData = data.alignData;
        this.colour = data.colour;
    }
    run() {
        let self = this;
        this.renderSNPTrackProcess = cp.fork(getAppPath_1.getReadable("RenderSNPTrack.js"));
        self.renderSNPTrackProcess.on("message", function (ev) {
            if (ev.finishedSettingData == true) {
                self.renderSNPTrackProcess.send({
                    run: true
                });
            }
            if (ev.update == true) {
                self.extraData = ev.data;
                self.flags = ev.flags;
                if (ev.flags.success == true) {
                    self.circularFigure = ev.data.circularFigure;
                    self.contiguuid = ev.data.contiguuid;
                    self.alignData = ev.data.alignData;
                    self.colour = ev.data.colour;
                }
                self.update();
            }
        });
        setTimeout(function () {
            self.renderSNPTrackProcess.send({
                setData: true,
                data: {
                    alignData: self.alignData,
                    contiguuid: self.contiguuid,
                    circularFigure: self.circularFigure,
                    colour: self.colour
                }
            });
        }, 500);
    }
}
exports.RenderSNPTrackForContig = RenderSNPTrackForContig;
