var canRead = require('./../canRead').default;
module.exports = function(channel,arg,model)
{
    if(arg.done)
    {
        if(arg.args[0] == "view")
        {
            if(!canRead(model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.bam")))
                throw new Error("Could not write "+model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.bam"));
            let args = [];
            if(process.platform == "linux")
            {
                args = [
                    "sort",
                    model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.bam"),
                    "-o",
                    model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.sorted.bam")
                ];
            }
            //samtools sort options are slightly different on windows for some reason
            else if(process.platform == "win32")
            {
                args = [
                    "sort",
                    model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.bam"),
                    model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.sorted")
                ];
            }
            model.spawnHandle
            (
                'spawn',
                {
                    action : 'spawn',
                    replyChannel : model.channel,
                    processName : model.samTools,
                    args : args,
                    unBuffer : true,
                    extraData : arg.extraData
                }
            );
        }
    }
}