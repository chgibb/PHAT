var url = require('url')
var path = require('path');

module.exports = function(path)
{
    return url.format
    (
        {
            protocol: 'file',
            slashes: true,
            pathname: path.join(process.cwd(), html)
        }
    );
}