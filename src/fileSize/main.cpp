
/*
    fileSize
        Prints the size of the file in bytes specified by argument 1 to stdout.
        Returns 0 if the file is of non zero size.
        Returns 1 if the file is zero.

        Part of the PHAT Project
	    Author : gibbc@tbh.net
*/
#include <iostream>
using namespace std;
#ifdef __linux
    #include <sys/stat.h>
    #include <fcntl.h>
    int getFileSize(char*name)
    {
        struct stat stbuf;
        int fd = open(name,O_RDONLY);
        if(fd == -1)
            return 0;
        if(fstat(fd,&stbuf) != 0)
            return 0;
        return stbuf.st_size;
    }
#endif
#ifdef _WIN32
    #include <io.h>
    int getFileSize(char*name)
    {
        int fd = _sopen_s(&fd,name,_O_RDONLY)
        return _fileLengthi64(fd);
    }
#endif
int main(int argc, char*argv[])
{
    //std::ofstream log("fileSizeLog",std::ios::out | std::ios::app);
    if(argv[1])
    {
        int res = getFileSize(argv[1]);
        if(res != 0)
        {
            std::cout<<res;
            return 0;
        }
        if(res == 0)
            return 1;
    }
    //log<<argv[1]<<std::endl;
    return 1;
}
