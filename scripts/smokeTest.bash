 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility


for f in guiTests/*.js
do

	bash scripts/runSmokeTest.bash $f	

done