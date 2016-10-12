/*
	Part of the PHAT Project
	Author : gibbc@tbh.net
*/
//copy artifacts out of a larger FastQC artifact directory
//will copy fastqc_report.html, summary.txt, fastqc_data.txt
module qcartifacts;
import std.file;
import std.stdio;
bool copyArtifacts(ref string src,ref string dest)
{
	try
	{
		std.file.copy(src~"/fastqc_report.html",dest~"/fastqc_report.html");
		std.file.copy(src~"/summary.txt",dest~"/summary.txt");
		std.file.copy(src~"/fastqc_data.txt",dest~"/fastqc_data.txt");
	}
	catch(std.file.FileException e)
	{
		
		std.file.rmdirRecurse(dest);
		writeln("failed to copy\n");
		return false;
	}
	return true;
}

//attempt to create dest dir, overwrite if it already exists.
bool makeDestDir(ref string destination)
{
	//D is dumb and doesnt allow conditional compilation of try/catch blocks.
	//Also bewildering that different platforms will throw different error types.
	//Would be fine if D allowed catching a base class or a generic catch statement a la C++
	version(Windows)
	{
		try
		{
			std.file.mkdir(destination);
		}
		catch(std.window.syserror.WindowsException e)
		{
			std.file.rmdirRecurse(dest);
			makeDestDir(destination);
			return false;
		}
	}
	version(linux)
	{
		try
		{
			std.file.mkdir(destination);
		}
		catch(std.file.FileException e)
		{
			std.file.rmdirRecurse(destination);
			makeDestDir(destination);
			return false;
		}
	}
	return true;
}
//remove source directory and source.zip
void removeSourceReport(ref string source)
{
	std.file.rmdirRecurse(source);
	std.file.remove(source~".zip");
	return;
}