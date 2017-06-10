"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require("uuid/v4");
let dFormat = require('./dateFormat');
class alignData {
    constructor() {
        this.fastqs = new Array();
        this.dateStampString = "";
        this.dateStamp = "";
        this.alias = "";
        this.invokeString = "";
        this.type = "";
        this.summaryText = "";
        this.dateStamp = dFormat.generateFixedSizeDateStamp();
        this.dateStampString = dFormat.formatDateStamp(this.dateStamp);
        this.uuid = uuidv4();
    }
}
exports.default = alignData;
