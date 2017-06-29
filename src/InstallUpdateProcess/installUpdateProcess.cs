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
        public static int Main(String[] args)
        {
            Process notification = new Process();
            try
            {
                notification.StartInfo.UseShellExecute = true;
                notification.StartInfo.FileName = "resources\\app\\installUpdateNotificationWin32.exe";
                notification.StartInfo.Verb = "runas";
                notification.Start();
                Thread.Sleep(5000);
                Stream inStream = File.OpenRead("phat.update");
    	        Stream gzipStream = new GZipInputStream(inStream);
    
    	        TarArchive tarArchive = TarArchive.CreateInputTarArchive(gzipStream);
    	        tarArchive.ExtractContents(".");
    	        tarArchive.Close();
    
    	        gzipStream.Close();
    	        inStream.Close();

            }
            //Adapted from answer by ekad http://stackoverflow.com/questions/21307789/how-to-save-exception-in-txt-file
            catch(Exception ex)
            {
                using (StreamWriter writer = new StreamWriter("updateerrorlog.txt", true))
                {
                    writer.WriteLine("Message :" + ex.Message + "<br/>" + Environment.NewLine + "StackTrace :" + ex.StackTrace +
                    "" + Environment.NewLine + "Date :" + DateTime.Now.ToString());
                    writer.WriteLine(Environment.NewLine + "-----------------------------------------------------------------------------" + Environment.NewLine);
                }
                notification.Kill();
                return 1;
            }
            notification.Kill();
            return 0;
        }
    }
}
