/**
 * Writes a generic loading message into the modal. May be modified by #loadingText after being written
 * 
 * @export
 */
export function showGenericLoadingSpinnerInNavBar() : void
{
    if(!document.getElementById("navBarLoadingSpinner").classList.contains("spinner-loader"))
    {
        document.getElementById("navBarLoadingSpinner").classList.add("spinner-loader");
    }
}

export function hideSpinnerInNavBar() : void
{
    if(document.getElementById("navBarLoadingSpinner").classList.contains("spinner-loader"))
    {
        document.getElementById("navBarLoadingSpinner").classList.remove("spinner-loader");
    }
}