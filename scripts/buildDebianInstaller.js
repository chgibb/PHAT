const installer = require("electron-installer-debian");

let options = {
    src : "phat-linux-x64",
    dest : "deb/",
    arch : "amd64",
    bin : "phat",
    icon : "icons/48x48.png"
};
installer(options,function(err){
    if(err)
    {
        console.error(err,err.stack);
        process.exit(1);
    }
});