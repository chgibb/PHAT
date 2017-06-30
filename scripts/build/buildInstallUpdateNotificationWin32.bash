 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

if [[ "$OSTYPE" == "cygwin" ]]; then
    ./scripts/build/buildInstallUpdateNotificationWin32.bat
fi