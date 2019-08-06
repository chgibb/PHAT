export default function tokenizedHTMLArrayToCSV(html : Array<string>) : string
{
    let isTableRowEnd = new RegExp("(</tr>)","i");

    let isTableData = new RegExp("(<td>)|(<td class=\\\"cellHover\\\")","i");
    let isTableDataEnd = new RegExp("(</td>)","i");

    let isTableHeader = new RegExp("(<th>)","i");
    let isTableHeaderEnd = new RegExp("(</th>)","i");
    let csv = `${(()=>
    {
        let res = "";
        let inCell = false;
        for(let i = 0; i != html.length; ++i)
        {
            if(isTableRowEnd.test(html[i]))
            {
                res += "\n";
                continue;
            }
            else if(isTableData.test(html[i]))
            {
                inCell = true;
                continue;
            }
            else if(isTableDataEnd.test(html[i]))
            {
                inCell = false;
                continue;
            }
            else if(isTableHeader.test(html[i]))
            {
                inCell = true;
                continue;
            }
            else if(isTableHeaderEnd.test(html[i]))
            {
                inCell = false;
                continue;
            }
            else if(html[i] && i != 0 && inCell)
            {
                res += `${html[i]},`;
                continue;
            }
        }
        return res;
    })()}
    `;
    return csv;
}