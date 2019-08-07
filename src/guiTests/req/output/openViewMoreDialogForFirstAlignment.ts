import {AlignData} from "../../../req/alignData";
import {getKey} from "../../../req/main/dataMgr";
import {getFreeWebContents} from "../../../req/main/winMgr";
import {AlignmentsReportTable} from "../../../req/renderer/containers/tables/alignmentsReportTable";

export async function openViewMoreDialogForFirstAlignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            console.log("Opening view more dialog for first alignment");
            let output = getFreeWebContents();
            if(!output || output.length == 0)
            {
                console.log("failed to open output window");
                process.exit(1);
            }

            setTimeout(function()
            {
                let firstAlign : AlignData = getKey("align","aligns")[0];
                console.log(AlignmentsReportTable.viewMoreId(firstAlign));
                output[0].executeJavaScript(`
                document.getElementsByClassName("${AlignmentsReportTable.viewMoreId(firstAlign)}")[0].click();
                `);
                resolve();
            },1500);
        },2000);
    });
}