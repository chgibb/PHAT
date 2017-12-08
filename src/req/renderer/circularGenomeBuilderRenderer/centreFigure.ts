import * as cf from "./../circularFigure";
/**
 * Center div based on the dimensions of figure and the window
 * 
 * @export
 * @param {HTMLElement} div 
 * @param {cf.CircularFigure} figure 
 */
export function centreInteractiveFigure(div : HTMLElement,figure : cf.CircularFigure) : void
{
    if(div)
    {
        if(figure.zoomFactor === undefined)
            figure.zoomFactor = 1;
        
        //expand the div to the new window size
        div.style.zIndex = "-1";
        div.style.position = "absolute";
        div.style.height = `${document.documentElement.clientHeight}px`;
        div.style.width = `${document.documentElement.clientWidth}px`;
        div.style.zoom = `${figure.zoomFactor}`;

        let x = 0;
        let y = 0;
        //center the div in the window
        x = ($(window).width()/2)-(figure.width/2);
        y = ($(window).height()/2)-(figure.height/2);
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
    }
}

export function centreNonInteractiveFigure(figure : cf.CircularFigure) : void
{
    let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("nonInteractiveFigureCanvas");
    if(canvas)
    {
        if(figure.zoomFactor === undefined)
            figure.zoomFactor = 1;

        let x = 0;
        let y = 0;
 
        x = ($(window).width()/2)-(figure.width/2);
        y = ($(window).height()/2)-(figure.height/2);
        canvas.style.left = `${x}px`;
        canvas.style.top = `${y}px`;
    }
}