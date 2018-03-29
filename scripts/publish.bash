#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

rm lib/*.js
rm __tests__/*.js

npm version $1
git push origin --tags
npm publish --access public
npm pack