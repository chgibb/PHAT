using System;
using System.Threading;
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
            Thread.Sleep(5000);
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
