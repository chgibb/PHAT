export function add(
    options? : {
        trackStyle? : string,
        width? : string,
        radius? : string
    }
) : string
{
    let res = `
        <plasmidtrack ${
            (
                ()=>
                {
                    if(options && options.trackStyle)
                        return `trackstyle="${options.trackStyle}"`;
                    return "";
                })()} ${
                    (
                        ()=>
                        {
                            if(options && options.width)
                                return `width="${options.width}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.radius)
                                return `radius="${options.radius}"`;
                            return "";
                        })()}>
            
    `;
    return res;
}

export function end() : string
{
    return `</plasmidtrack>`;
}