var formatByteString = require('./../formatByteString');
module.exports = function(channel,arg,model)
{
    if(arg.unBufferedData)
    {
        for(let i = 0; i != model.fastqInputs.length; ++i)
        {
            if(model.fastqInputs[i].name == arg.args[0])
            {
                model.fastqInputs[i].size = parseInt(arg.unBufferedData);
                model.fastqInputs[i].sizeString = formatByteString(parseInt(arg.unBufferedData));
                model.postFastqInputs();
                return;
            }
        }
        for(let i = 0; i != model.fastaInputs.length; ++i)
        {
            if(model.fastaInputs[i].name == arg.args[0])
            {
                model.fastaInputs[i].size = parseInt(arg.unBufferedData);
                model.fastaInputs[i].sizeString = formatByteString(parseInt(arg.unBufferedData));
                model.postFastaInputs();
                return;
            }
        }
    }
}