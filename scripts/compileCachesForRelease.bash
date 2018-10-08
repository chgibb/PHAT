(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    target="phat-linux-x64/resources/app"
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    target="phat-win32-x64/resources/app"
fi

cd "$target"

mv main.js realMain.js

mv AOTCompileCodeCaches.js main.js

cd ../

cd ../

./phat

cd resources

cd app

mv realMain.js main.js

rm -rf rt
rm -rf projects
rm -rf projectManifests.json
rm -rf logs