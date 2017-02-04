module.exports.add = function(options)
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

module.exports.end = function()
{
    return `</plasmid>`;
}