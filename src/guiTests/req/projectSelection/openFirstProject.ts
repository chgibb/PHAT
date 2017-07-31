import * as winMgr from "./../../../req/main/winMgr"

export async function openFirstProject() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("opening first project");
            let projSelection = winMgr.getWindowsByName("projectSelection");
            projSelection[0].webContents.executeJavaScript(`
                let els = document.getElementsByClassName("activeHover");
                let isOpenLink = /Open/;
                for(let i = 0; i != els.length; ++i)
                {
                    if(isOpenLink.test(els[i].id))
                    {
                        els[i].click();
                        break;
                    }
                }
            `);
            setTimeout(function(){
                resolve();
            },5000);
        },5000);
    });
}