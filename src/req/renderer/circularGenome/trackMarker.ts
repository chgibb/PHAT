export function add(
    options? : {
        start? : string,
        end? : string,
        markerStyle? : string,
        class? : string,
        arrowStartLength? : string,
        arrowEndLength? : string,
        vAdjust? : number,
        wAdjust? : string,
        uuid? : string,
        onClick? : string
    }
) : string
{
    let res = `
        <trackmarker 
        markerclass="trackMarkerHover" markerclick="${options.onClick}($event,$marker,'${options.uuid}')" ${
            (
                ()=>
                {
                    if(options && options.start)
                        return `start="${options.start}"`;
                    return "";
                })()} ${
                    (
                        ()=>
                        {
                            if(options && options.end)
                                return `end="${options.end}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.markerStyle)
                                return `markerstyle="${options.markerStyle}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.class)
                                return `class="${options.class}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.arrowStartLength)
                                return `arrowstartlength="${options.arrowStartLength}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.arrowEndLength)
                                return `arrowendlength="${options.arrowEndLength}"`;
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

export function end() : string
{
    return `</trackmarker>`;
}