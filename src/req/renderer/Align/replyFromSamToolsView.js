var canRead = require('./../canRead');
module.exports = function(channel,arg,model)
{
    if(arg.done)
    {
        if(arg.args[0] == "view")
        {
            if(!canRead(model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.bam")))
                throw new Error("Could not write "+model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.bam"));
            model.spawnHandle
            (
                'spawn',
                {
                    action : 'spawn',
                    replyChannel : model.channel,
                    processName : model.samTools,
                    args : 
                    [
                        "sort",
                        model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.bam"),
                        "-o",
                        model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.sorted.bam")
                    ],
                    unBuffer : true,
                    extraData : arg.extraData
                }
            );
        }
    }
}