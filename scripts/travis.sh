#!/usr/bin/env bash
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  sudo pat-get install xvfb
  export DISPLAY=:99.0
  Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
  sleep 3
fi
