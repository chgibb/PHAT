import * as cf from "./../circularFigure";
export async function reCacheBaseFigure(figure : cf.CircularFigure) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        (async function() : Promise<void> {
            return new Promise<void>((resolve,reject) => {
                setImmediate(function(){
                    setImmediate(function(){
                        cf.cacheBaseFigure(figure);
                        cf.deleteBaseFigureSVGFromCache(figure);
                        resolve();
                    });
                });
            });
        })().then(() => {
            resolve();
        });
    });
}