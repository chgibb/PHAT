[Home](https://chgibb.github.io/PHAT/)

#### For $TAGNAME$
[Contents](https://chgibb.github.io/PHAT/docs/latest/home)

# Repository Structure

## forDist/
For prebuilt binaries/third party files meant for distribution with PHAT. Will also hold files and binaries created/downloaded by running ```scripts/install.bash```. A full breakdown of what is contained in this folder is [here](https://github.com/chgibb/PHAT/blob/master/bundledThirdPartyDependencies.md).

### forDist/win32  

#### forDist/win32/cygwin.tar.gz
Contains those [Cygwin](https://cygwin.com/) components necessary for third-party cross compiled binaries to run on Windows.

#### forDist/win32/python.tar.gz
Contains a full [WinPython](https://winpython.github.io/) distribution.   

#### forDist/win32/win32.tar.gz
Contains a full [Strawberry Perl](http://strawberryperl.com/) distribution as well as two MinGW DLLs and associated bioinformatics tools.

### forDist/linux

#### forDist/linux/linux.tar.gz
Contains necessary bioinformatics tools for Linux.

## scripts
Contains all scripts necessary to build and test the application.

### scripts/build  
Contains all scripts necessary to build application.

### scripts/clean
Contains cleaning scripts.

### scripts/install
Contains scripts necessary to prepare a development environment to use to develop PHAT.

### scripts/opt
Contains scripts used to optimize a built PHAT application package.

## src
Contains all first party application code. Every ```.ts``` file in the top level of this directory will be bundled by ```Browserify``` at build time.   

Files in the top level represent the entry point of a process/helpers for that process. For instance, for some process ```foo``` which will run in the ```renderer``` context of ```Electron``` (an application window), there will be ```foo.html```, ```foo.ts``` and ```fooRenderer.ts```. ```foo.html``` being the initial HTML file loaded upon invocation of the window, ```foo.ts``` will be loaded by ```foo.html``` in order to load or compile a code cache for ```fooRenderer.ts```. ```fooRenderer.ts``` should contain all code needed to make the window function.  


For some process ```bar``` which should run in a standard ```Node``` context (usually as part of an [atomic operation](https://github.com/chgibb/PHAT/blob/master/src/req/operations/atomicOperations.ts) though not strictly necessary), there will be ```bar.ts``` and ```barProcess.ts```. ```bar.ts``` will be invoked in order to load or compile a code cache for ```barProcess.ts```. All process logic should reside in ```barProcess.ts```.

In all cases ```foo.ts``` and ```bar.ts``` should be nothing more than dumb bootstrappers for their corresponding ```*Renderer.ts```/```*Process.ts``` files.

### src/req
All modules ```import```ed by other modules. Nothing under this directory represents an entry point for an individual process.

### src/main
Modules used by the ```main process```. Each ```fooRenderer.ts``` file in the top level has a corresponding ```foo.ts``` file under this directory to register the window with the main process at application startup.

### src/operations
Each file in the top level of this directory contains a single operation. Sub directories correspond to helper modules/pieces of their corresponding operation. Some operations use modules which are not stored here.

[Contents](https://chgibb.github.io/PHAT/docs/latest/home)