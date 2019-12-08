export function startPlasmid(
    options? : {
        sequenceLength : string,
        plasmidHeight : number | string,
        plasmidWidth : number | string
    }
) : string
{
    let res = `
        <plasmid ${
    (
        ()=>
        {
            if(options && options.sequenceLength)
                return `sequencelength="${options.sequenceLength}"`;
            return "";
        })()} ${
    (
        ()=>
        {
            if(options && options.plasmidHeight)
                return `plasmidheight="${options.plasmidHeight}"`;
            return "";
        })()} ${
    (
        ()=>
        {
            if(options && options.plasmidWidth)
                return `plasmidwidth="${options.plasmidWidth}"`;
            return "";
        })()}>
            
    `;
    return res;
}

export function endPlasmid() : string
{
    return `</plasmid>`;
}