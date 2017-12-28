import * as winMgr from "./../../../req/main/winMgr";
export async function startAligningSelected() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("starting to align selected reads against selected ref seq");
            let align = winMgr.getFreeWebContents();
            if(!align || align.length == 0)
            {
                console.log("Failed to open align window");
                process.exit(1);
            }
            align[0].executeJavaScript(`
                document.getElementById("alignButton").click();
            `);
            resolve();
        },500);
    });
}