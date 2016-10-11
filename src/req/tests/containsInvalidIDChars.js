//Check for any characters that would be invalid in an HTML id.
module.exports = function(str)
{
    if
    (
        str.includes(" ") ||
        str.includes(".") ||
        str.includes("/") ||
        str.includes("\\") ||
        str.includes("(") ||
        str.includes(")")
    )
        return true;
    return false;
}