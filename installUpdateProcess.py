import tarfile
import time
import os
from subprocess import Popen, PIPE
time.sleep(5);
tar = tarfile.open("phat.update")
tar.extractall()
tar.close()
pid = Popen(["phat"])
