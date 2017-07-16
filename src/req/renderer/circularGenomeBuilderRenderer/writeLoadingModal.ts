export function writeLoadingModal() : void
{
    let title = `Loading...`;
    let body = `
        <h3 id="loadingText"></h3>
    `;
    let footer = `
            <button type="button" class="btn btn-secondary" data-dismiss="modal" id="footerClose">Got It</button>
        `;

    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;
}