/**
 * @module req/sleep
 */
/**
 * Spin thread for seconds
 * @function sleep
 * @param {number} seconds - number of seconds to spin thread for
 */
module.exports = function(seconds)
{
	var stop = new Date(new Date().getTime() + seconds * 1000);
	while(stop > new Date()){}
}
