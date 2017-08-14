import * as cf from "./../circularFigure";
export function centreFigure(div : HTMLElement,figure : cf.CircularFigure) : void
{
    if(div)
    {
        //expand the div to the new window size
        div.style.zIndex = "-1";
        div.style.position = "absolute";
        div.style.height = `${$(window).height()}px`;
        div.style.width = `${$(window).width()}px`;

        let x = 0;
        let y = 0;
        //center the div in the window
        x = ($(window).width()/2)-(figure.width/2);
        y = ($(window).height()/2)-(figure.height/2);
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
    }
}