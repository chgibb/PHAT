let dialog = require("electron").remote.dialog;
let fs = require("fs");

let tokenizeHTMLString = require("./../tokenizeHTMLString");
let tokenizedHTMLArrayToCSV = require("./../tokenizedHTMLArrayToCSV");
module.exports = function(htmlString)
{
    dialog.showSaveDialog
    (
        {
            filters:
                [
                    {
                        name : 'comma separated values',
                        extensions : ['csv']
                    }
                ]
        },
        function(fileName)
        {
            if(fileName === undefined)
                return;
            fs.writeFileSync
            (
                fileName,
                tokenizedHTMLArrayToCSV
                (
                    tokenizeHTMLString
                    (
                        htmlString
                    )
                )
            );
        }
    );
}