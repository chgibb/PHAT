/*
	Process management functions. Provides wrapper over Job class.
	Maintains a job queue which gets worked on from both ends simultaneously to prevent starving 
	of one end. Jobs get added to the bottom of the queue with addJob. runJobs must be run 
	periodically in order to update the queue and spawn new jobs.

	TODO: maxJobs is currently hardcoded. This should be togglable through a state channel

	Part of the PHAT Project
	Author: gibbc@tbh.net
*/
var jobs = new Array();
var switchEnds = false;
var Job = require('./Job.js');
/*
	Updates job queue.
	Removes completed jobs and starts new ones.
*/
module.exports.runJobs = function()
{
	var maxJobs = 4;
	var runningJobs = 0;
	for(var i in jobs)
	{
		if(jobs[i].running)
			runningJobs++;
		if(runningJobs >= maxJobs)
			return;
		if(jobs[i].done)
		{
			jobs.splice(i,1);
		}
	}
	//available thread for new job
	//start next job at the front of the queue
	if(!switchEnds)
	{
		for(var i in jobs)
		{
			if(!jobs[i].running && !jobs[i].done)
			{
				jobs[i].Run();
				runningJobs++;
			}
			if(runningJobs >= maxJobs)
				break;
		}
	}
	//start last job in the queue
	if(switchEnds)
	{
		for(var i = jobs.length-1; i > 0; i--)
		{
			if(!jobs[i].running && !jobs[i].done)
			{
				jobs[i].Run();
				runningJobs++;
			}
			if(runningJobs >= maxJobs)
				break;
		}
	}
	if(switchEnds)
	{
		switchEnds = false;
		return;
	}
	if(!switchEnds)
	{
		switchEnds = true;
		return;
	}
}
/*
	Wrapper over Job creation. See Job.js for more details.
*/
module.exports.addJob = function(processName,args,callBackChannel,unBuffer,callBackObj,extraData)
{
    jobs.push(new Job(processName,args,callBackChannel,unBuffer,callBackObj,extraData));
}