import * as fs from "fs";
import {getReadableAndWritable} from "./../getAppPath";
export function rebuildRTDirectory() : void
{
	try
	{
    	fs.mkdirSync(getReadableAndWritable("rt"));
		fs.mkdirSync(getReadableAndWritable("rt/QCReports"));
		fs.mkdirSync(getReadableAndWritable("rt/indexes"));
		fs.mkdirSync(getReadableAndWritable("rt/AlignmentArtifacts"));
		fs.mkdirSync(getReadableAndWritable("rt/circularFigures"));
		fs.mkdirSync(getReadableAndWritable("rt/imported"));
	}
	catch(err){}
}