import * as React from "react";

import {getReadable} from "../../../../getAppPath";

export class QCViewWebView extends React.Component<{},{}>
{
    private ref = React.createRef<HTMLDivElement>();
    public constructor()
    {
        super({});
    }

    public componentDidMount()
    {
        if(this.ref.current)
        {
            this.ref.current.innerHTML = `
                <webview nodeintegration="true" src="${getReadable("QC.html")}" style="height:100%;" />
            `;
        }
    }

    public render() : JSX.Element
    {
        return (
            <div ref={this.ref} style={{height: "85vh",width: "100%"}} />
        );
    }
}