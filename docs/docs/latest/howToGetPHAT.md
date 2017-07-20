[Contents](https://chgibb.github.io/phat/docs/latest/home)

PHAT is available for both Ubuntu Linux (64-bit) and Windows (64-bit) in installed and portable (not installed) editions.

# Installing PHAT
## Windows
Downloading and running ```phat-win32-x64-setup.exe``` will install PHAT onto your PC.

## Ubuntu Linux
Downloading and running ```phat_x.x.x_amd64.deb``` will install PHAT onto your Ubuntu Linux computer.
If the installer does not successfully install using the Ubuntu Software Centre, you will need to navigate to where you downloaded the installer and run   
```sudo dpkg -i phat_x.x.x.amd64.deb```   
The ```.deb``` build of PHAT is more than likely compatible with any distribution which supports Debian packages. At the time of writing, we do not have access to the infrastructure to test and guarantee the functionality/correctness of ```.deb``` builds of PHAT on distributions other than Ubuntu. Please file an [issue](https://github.com/chgibb/PHAT/issues) and let us know about your experience using ```.deb``` builds of PHAT on other distributions and help us make them better.

## RHEL, Fedora, CentOS (experimental, not officially supported)
PHAT is available as an ```.rpm``` package for ```RPM``` based distributions. At the time of writing, we do not have access to the infrastructure to test and guarantee the functionality/correctness of these packages. Please file an [issue](https://github.com/chgibb/PHAT/issues) and let us know about your experience using ```.rpm``` builds of PHAT and help us make them better.


# Portable PHAT
For users who are not administrators on their computers or who wish to use PHAT on a USB device(not recommended for performance reasons, PHAT is considerably slower when run on a USB), portable editions are available.
## Windows
```phat-win32-x64-portable.zip```

## Linux
```phat-linux-x64-portable.tar.gz```  
Though the Linux portable edition of PHAT is built on an Ubuntu Linux machine, it should be compatible with other Linux distributions. If this is not the case or you would like to see your favourite Linux distribution supported, please let us know by filing an [issue](https://github.com/chgibb/PHAT/issues).

# Getting PHAT Updates
PHAT's release cycle is relatively fast. If you have installed PHAT for Windows, or are using a portable edition for either Windows or Linux, PHAT will automatically check for updates and prompt you to download and install them as they become available. If you are using the installed (Debian package) edition of PHAT for Ubuntu Linux, PHAT will check for updates but will not download and install them. You will need to manually download and install the latest Debian package.

# About PHAT Updates and Releases
PHAT updates are powered by Github releases. Each time PHAT is run, it will contact github.com and get the list of repository tags. It will look through the list of tags until it finds a tag version greater than it's current version. If successful, the update in the form of ```phat-plat-x64-update.tar.gz``` will be downloaded and unpacked overtop of itself. These are special packages built specifically to be used as updates. They will not function correctly if downloaded and ran by themselves.