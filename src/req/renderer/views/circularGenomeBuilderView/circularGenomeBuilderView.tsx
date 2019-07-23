import * as React from "react";
import { getReadable } from '../../../getAppPath';

export class CircularGenomeBuilderView extends React.Component<{},{}>
{
    private ref = React.createRef<HTMLDivElement>();
    public constructor()
    {
        super(undefined);
    }

    public componentDidMount(){
        console.log('genome builder didmount')
    }

    public render() : JSX.Element
    {
        return (
            <div ref={this.ref} />
        );
    }
}