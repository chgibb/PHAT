/**
 * Displays a generic loading spinner in the nav bar
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

/**
 * Hides all spinners in the nav bar
 * 
 * @export
 */
export function hideSpinnerInNavBar() : void
{
    if(document.getElementById("navBarLoadingSpinner").classList.contains("spinner-loader"))
    {
        document.getElementById("navBarLoadingSpinner").classList.remove("spinner-loader");
    }
}