import * as electron from "electron";
const dialog = electron.remote.dialog;
import * as fs from "fs";

import tokenizeHTMLString from "./../tokenizeHTMLString";
import tokenizedHTMLArrayToXLS from "./../tokenizedHTMLArrayToXLS";

export default function XLSExportDialog(htmlString : string) : void
{
    dialog.showSaveDialog(
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
            fs.writeFileSync(
                fileName,
                tokenizedHTMLArrayToXLS(
                    tokenizeHTMLString(
                        htmlString
                    )
                )
            );
        }
    ); 
}