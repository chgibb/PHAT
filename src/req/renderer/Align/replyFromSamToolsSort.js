var canRead = require('./../canRead');
module.exports = function(channel,arg,model)
{
    
    if(!canRead(model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.sorted.bam")))
        throw new Error("Could not write "+model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.sorted.bam"));
    model.spawnHandle
    (
        'spawn',
        {
            action : 'spawn',
            replyChannel : model.channel,
            processName : model.samTools,
            args : 
            [
                "index",
                model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.sorted.bam"),
                model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.sorted.bam.bai")
            ],
            unBuffer : true,
            extraData : arg.extraData
        }
    );
}