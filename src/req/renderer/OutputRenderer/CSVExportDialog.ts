import * as electron from "electron";

const dialog = electron.remote.dialog;
import * as fs from "fs";

import tokenizeHTMLString from "./../tokenizeHTMLString";
import tokenizedHTMLArrayToCSV from "./../tokenizedHTMLArrayToCSV";
export function CSVExportDialog(htmlString : string) : void
{
    dialog.showSaveDialog(
        {
            filters:
                [
                    {
                        name : "comma separated values",
                        extensions : ["csv"]
                    }
                ]
        },
        function(fileName)
        {
            if(fileName === undefined)
                return;
            fs.writeFileSync(
                fileName,
                tokenizedHTMLArrayToCSV(
                    tokenizeHTMLString(
                        htmlString
                    )
                )
            );
        }
    );
}