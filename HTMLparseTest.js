let html = `<table style="width:100%">
                    <tbody><tr>
                        <th>Alias</th>
                        <th>Directory</th>
                        <th>Size In Bytes</th>
                        <th>Formatted Size</th>
                        
                        
                        
                        
                        
                        
                    </tr>
                    <tr><td>L6R12.R1.fastq</td><td>/home/gibbsticks/fastq/L6R12.R1.fastq</td><td>1018672</td><td>1.02mb</td></tr><tr><td>L6R11.R2.fastq</td><td>/home/gibbsticks/fastq/L6R11.R2.fastq</td><td>1253430</td><td>1.25mb</td></tr><tr><td>L6R12.R2.fastq</td><td>/home/gibbsticks/fastq/L6R12.R2.fastq</td><td>1018672</td><td>1.02mb</td></tr>
                    </tbody></table>`;

function tokenizeHTMLString(html)
{
    let res = new Array();
    let breakChars = ["<",">"];
    let add = true;
    let str = "";
    for(let i = 0; i != html.length; ++i)
    {
        add = true;
        if(html[i] == "<")
        {
            if(str != "")
                res.push(str);
            str = "";
        }
        if(html[i] == ">")
        {
            str += html[i]
            if(str != "")
                res.push(str);
            str = "";
            add = false;
        }
        if(add)
            str += html[i];
    }
    return res;
}
function tokenizedHTMLArrayToXLS(html)
{
    let isTable = new RegExp("(<table)","i");
    let isTableEnd = new RegExp("(</table>)","i");

    let isTableRow = new RegExp("(<tr>)","i");
    let isTableRowEnd = new RegExp("(</tr>)","i");

    let isTableData = new RegExp("(<td>)","i");
    let isTableDataEnd = new RegExp("(</td>)","i");

    let isTableHeader = new RegExp("(<th>)","i");
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
                    isTBodyEnd.test(html[i] ||
                    html[i] == "\n") 
                )
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
//console.log(tokenizeHTMLString(html));
console.log(tokenizedHTMLArrayToXLS(tokenizeHTMLString(html)));