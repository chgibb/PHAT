module.exports = function(grunt)
{
    grunt.initConfig({
        'create-windows-installer': {
        x64: {
        appDirectory: 'phat-win32-x64',
        outputDirectory: 'phatinst',
        authors: 'My App Inc.',
        exe: 'phat.exe'
    }
    }
});
    grunt.loadNpmTasks('grunt-electron-installer');
}