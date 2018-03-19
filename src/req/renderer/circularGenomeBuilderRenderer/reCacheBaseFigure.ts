import * as cf from "./../circularFigure";
/**
 * Rerenders figure's template cache, resets SVG cache
 * 
 * @export
 * @param {cf.CircularFigure} figure 
 */
export function reCacheBaseFigure(figure : cf.CircularFigure) : void
{
    cf.cacheBaseFigureTemplate(figure);
    cf.deleteBaseFigureSVGFromCache(figure);
}