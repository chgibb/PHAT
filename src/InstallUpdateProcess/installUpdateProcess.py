import tarfile
import time
import os
import subprocess
time.sleep(5);
tar = tarfile.open("phat.update")
tar.extractall()
tar.close()
pid = subprocess.call(["./phat"])
