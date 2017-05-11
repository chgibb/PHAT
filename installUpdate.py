import time
import os
from subprocess import Popen, PIPE

DETACHED_PROCESS = 0x00000008
CREATE_NEW_PROCESS_GROUP = 0x00000200
#pid = Popen(["python", "resources/app/installUpdateProcess.py"], shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE, creationflags=DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP)
#pid = Popen(["nohup","python", "resources/app/installUpdateProcess.py"])
os.system("nohup python resources/app/installUpdateProcess.py &")
#os.execv("phat","")
