import * as winMgr from "./../../../req/main/winMgr";

/**
 * Triggers indexing for every ref seq in the first input window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function indexRefs() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => {
        setTimeout(async function(){
            console.log("indexing ref seqs");
            let input = winMgr.getFreeWebContents();
            if(!input || input.length == 0)
            {
                console.log("Failed to open input window");
                process.exit(1);
            }
            await input[0].executeJavaScript(`
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