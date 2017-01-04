module.exports = function(seconds)
{
	var stop = new Date(new Date().getTime() + seconds * 1000);
	while(stop > new Date()){}
}
