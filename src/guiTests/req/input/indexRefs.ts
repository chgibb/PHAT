import * as winMgr from "./../../../req/main/winMgr";
export async function indexRefs() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("indexing ref seqs");
            let input = winMgr.getFreeWebContents();
            if(!input || input.length == 0)
            {
                console.log("Failed to open input window");
                process.exit(1);
            }
            input[0].executeJavaScript(`
                let els = document.getElementsByTagName("td");
                let isIndex = /Index/;
                for(let i = 0; i != els.length; ++i)
                {
                    console.log(els[i]);
                    if(els[i].id && isIndex.test(els[i].id))
                    {
                        console.log("clicked "+els[i]);
                        els[i].click();
                        break;
                    }
                }
            `);
            resolve();
        },500);
    });
}