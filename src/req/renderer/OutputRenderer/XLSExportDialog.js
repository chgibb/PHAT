let dialog = require("electron").remote.dialog;
let fs = require("fs");

let tokenizeHTMLString = require("./../tokenizeHTMLString");
let tokenizedHTMLArrayToXLS = require("./../tokenizedHTMLArrayToXLS");
module.exports = function(htmlString)
{
    dialog.showSaveDialog
    (
        {
            filters:
            [
                {
                    name : 'Spread Sheet',
                    extensions : ['xls'] 
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
                tokenizedHTMLArrayToXLS
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