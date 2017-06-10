"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tokenizeHTMLString(html) {
    let res = new Array();
    let breakChars = ["<", ">"];
    let add = true;
    let str = "";
    for (let i = 0; i != html.length; ++i) {
        add = true;
        if (html[i] == "<") {
            if (str != "")
                res.push(str);
            str = "";
        }
        if (html[i] == ">") {
            str += html[i];
            if (str != "")
                res.push(str);
            str = "";
            add = false;
        }
        if (add)
            str += html[i];
    }
    return res;
}
exports.default = tokenizeHTMLString;
