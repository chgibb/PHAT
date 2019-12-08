export function startTrackLabel(
    options : {
        text? : string,
        labelStyle? : string,
        vAdjust? : string,
        wAdjust? : string,
        onClick? : string,
        isInteractive : boolean
    }
) : string
{
    let res = `
        <tracklabel ${options.isInteractive ?  `class="trackLabelHover" ${(()=>
    {
        return options.onClick ? `ng-click="${options.onClick}()"` : "";
    })()}` : ""} ${
    (
        ()=>
        {
            if(options && options.text)
                return `text="${options.text}"`;
            return "";
        })()} ${
    (
        ()=>
        {
            if(options && options.labelStyle)
                return `labelstyle="${options.labelStyle}"`;
            return "";
        })()} ${
    (
        ()=>
        {
            if(options && options.vAdjust)
                return `vadjust="${options.vAdjust}"`;
            return "";
        })()} ${
    (
        ()=>
        {
            if(options && options.wAdjust)
                return `wadjust="${options.wAdjust}"`;
            return "";
        })()}>
            
    `;
    return res;
}

export function endTrackLabel() : string
{
    return `</tracklabel>`;
}