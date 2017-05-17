(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
if [[ "$OSTYPE" == "cygwin" ]]; then
    wget "https://github.com/icsharpcode/SharpZipLib/releases/download/0.86.0.518/ICSharpCode.SharpZipLib.dll"
    cp --preserve=all ICSharpCode.SharpZipLib.dll src/installUpdateProcess
    rm ICSharpCode.SharpZipLib.dll
fi