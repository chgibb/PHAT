if [[ "$OSTYPE" == "linux-gnu" ]]; then
    target="phat-linux-x64/resources/app"
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    target="phat-win32-x64/resources/app"
fi

bash scripts/opt/collapseBundle.bash
bash scripts/opt/optIIFE.bash
bash scripts/opt/asi.bash
bash scripts/opt/minify.bash

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