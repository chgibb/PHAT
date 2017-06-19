export default function tokenizedHTMLArrayToXLS(html : Array<string>) : string
{
    let isTable = new RegExp("(<table)","i");
    let isTableEnd = new RegExp("(</table>)","i");

    let isTableRow = new RegExp("(<tr)","i");
    let isTableRowEnd = new RegExp("(</tr>)","i");

    let isTableData = new RegExp("(<td)","i");
    let isTableDataEnd = new RegExp("(</td>)","i");

    let isTableHeader = new RegExp("(<th)","i");
    let isTableHeaderEnd = new RegExp("(</th>)","i");

    let isTBody = new RegExp("<tbody>","i");
    let isTBodyEnd = new RegExp("</tbody>","i");

    let hasNewLine = new RegExp("\\n","i");
    let xls = `<?xml version="1.0"?>
        <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
        xmlns:html="http://www.w3.org/TR/REC-html40">
        <Worksheet ss:Name="Sheet1">
        ${(()=>{
            let res = "";
            let inCell = false;
            for(let i = 0; i != html.length; ++i)
            {
                if(isTBody.test(html[i]) ||
                    isTBodyEnd.test(html[i]) ||
                    html[i] == "\n") 
                        continue;
                if(hasNewLine.test(html[i]))
                    continue;
                if(isTable.test(html[i]))
                {
                    res += `<Table>`;
                    continue;
                }
                else if(isTableEnd.test(html[i]))
                {
                    res += `</Table>`;
                    continue;
                }
                else if(isTableRow.test(html[i]))
                {
                    res += `<Row>`;
                    continue;
                }
                else if(isTableRowEnd.test(html[i]))
                {
                    res += `</Row>`;
                    continue;
                }
                else if(isTableData.test(html[i]))
                {
                    res += `<Cell>`;
                    inCell = true;
                    continue;
                }
                else if(isTableDataEnd.test(html[i]))
                {
                    res += `</Data></Cell>`;
                    inCell = false;
                    continue;
                }
                else if(isTableHeader.test(html[i]))
                {
                    res += `<Cell>`;
                    inCell = true;
                    continue;
                }
                else if(isTableHeaderEnd.test(html[i]))
                {
                    res += `</Data></Cell>`;
                    inCell = false;
                    continue;
                }
                else if(html[i] && i != 0 && inCell)
                {
                    res += `<Data ss:Type="String">${html[i]}`;
                    continue;
                }
            }
            res += `</Worksheet></Workbook>`;
            return res;
        })()}
    `;
    return xls;
}