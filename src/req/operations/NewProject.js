"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonFile = require("jsonfile");
const uuidv4 = require("uuid/v4");
const atomic = require("./atomicOperations");
const newProject_1 = require("./../newProject");
class NewProject extends atomic.AtomicOperation {
    constructor() {
        super();
    }
    setData(data) {
        this.proj = data;
    }
    run() {
        let self = this;
        newProject_1.newProject(this.proj).then(() => {
            self.setSuccess(self.flags);
            self.update();
        }).catch((err) => {
            self.abortOperationWithMessage(err);
            self.update();
        });
    }
}
exports.NewProject = NewProject;
