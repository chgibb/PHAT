 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

mv node_modules not_node_modules

cd tests

node tests.js
if [ $? != 0 ]; then
	cat jobVerboseLog.txt
	cat jobErrorLog.txt
	exit 1
fi

cd ../

bash scripts/cleanTests.bash