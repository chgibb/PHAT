#include <fstream>
int main(int argc,char*argv[])
{
    if(argc < 3)
        return -1;
    std::ifstream src(argv[1],std::ios::binary);
    std::ofstream dest(argv[2],std::ios::binary);

    if(src.bad() || dest.bad())
        return 1;
    
    char byte;
    while(src.get(byte))
        dest<<byte;
    return 0;
}