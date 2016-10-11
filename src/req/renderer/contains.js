module.exports.containsElement = function(arr,val)
{
    for(var i = arr.length; i != -1; --i)
    {
        if(arr[i] === val)
            return true;
    }
    return false;
}