(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

mv not_node_modules node_modules

rm -rf tests
rm -rf guiTests

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    target="phat-linux-x64/resources/app"
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    target="phat-win32-x64/resources/app"
fi

rm -rf $target/rt
rm -rf $target/projects
rm -rf $target/projectManifests.json
rm -rf $target/logs