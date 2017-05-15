using System;
using System.IO;
using System.Diagnostics;

using ICSharpCode.SharpZipLib.GZip;
using ICSharpCode.SharpZipLib.Tar;
namespace phat
{
    public class procMain
    {
        //Adapted from https://github.com/icsharpcode/SharpZipLib/wiki/GZip-and-Tar-Samples
        public static void Main(String[] args)
        {
            Stream inStream = File.OpenRead("phat.update");
    	    Stream gzipStream = new GZipInputStream(inStream);
    
    	    TarArchive tarArchive = TarArchive.CreateInputTarArchive(gzipStream);
    	    tarArchive.ExtractContents(".");
    	    tarArchive.Close();
    
    	    gzipStream.Close();
    	    inStream.Close();
            
            Process.Start(new ProcessStartInfo("phat.exe"));
        }
    }
}
