import * as fs from "fs";

export function rebuildRTDirectory() : void
{
    try
	{
	    fs.mkdirSync("resources/app/rt");
		fs.mkdirSync("resources/app/rt/QCReports");
		fs.mkdirSync("resources/app/rt/indexes");
		fs.mkdirSync("resources/app/rt/AlignmentArtifacts");
		fs.mkdirSync("resources/app/rt/circularFigures");
	}
	catch(err){}
}