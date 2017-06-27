import * as electron from "electron";
const dialog = electron.remote.dialog;

export function importProjectBrowseDialog() : Promise<string>
{
    return new Promise((resolve,reject) => {
        dialog.showOpenDialog(
            {
                title : "Import PHAT Project",
                filters : [
                    {
                        name : "PHAT Project",
                        extensions : [
                            "phat"
                        ]
                    }
                ],
                properties : [
                    "openFile"
                ]
            },
            function(files : Array<string>)
            {
                if(!files)
                    resolve(undefined);
                if(files[0])
                    resolve(files[0]);
                else
                    resolve(undefined);
            }
        )
    });
}