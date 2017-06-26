import tarfile
import time
import os
import subprocess

time.sleep(5);
try:
    tar = tarfile.open("phat.update")
    tar.extractall()
    tar.close()
except IOError as e:
    pass

