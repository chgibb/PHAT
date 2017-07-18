import * as dataMgr from "./dataMgr";
import * as winMgr from "./winMgr";
import * as atomicOp from "./../operations/atomicOperations";
import {getReadableAndWritable} from "./../getAppPath";
import {ProjectManifest} from "./../projectManifest";
//final steps to load project after OpenProject operation has unpacked the project tarball
export function finishLoadingProject(proj : ProjectManifest) : void
{
	dataMgr.setKey("application","finishedSavingProject",false);

	dataMgr.clearData();
	dataMgr.loadData(getReadableAndWritable("rt/rt.json"));
	
	//If we're loading an internal project, set the project object in the runtime manifest accordingly
	//If we're loading externally, openProjectProcess will detect and patch it in appropriately
	//openProjectProcess patches it with the appropriate tar ball path on each load in case the project file has been moved since it was last used.
	//This ensures that when saveProjectProcess looks for a tar ball path to save to, that it is up to date.
	if(proj)
		dataMgr.setKey("application","project",proj);

	dataMgr.setKey("application","jobErrorLog",getReadableAndWritable("jobErrorLog.txt"));
	dataMgr.setKey("application","jobVerboseLog",getReadableAndWritable("jobVerboseLog.txt"));

	winMgr.windowCreators["toolBar"].Create();
	winMgr.closeAllExcept("toolBar");

}