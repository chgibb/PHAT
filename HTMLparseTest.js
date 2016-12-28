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
console.log(tokenizeHTMLString(html));