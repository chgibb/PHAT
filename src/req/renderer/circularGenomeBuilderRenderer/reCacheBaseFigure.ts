import * as cf from "./../circularFigure";
export function reCacheBaseFigure(figure : cf.CircularFigure) : void
{
    cf.cacheBaseFigure(figure);
    cf.deleteBaseFigureSVGFromCache(figure);
}