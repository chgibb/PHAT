 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

#remove rt folder
rm -rf phat-linux-x64/resources/app/rt

#build then run
bash build.bash
sh run.sh