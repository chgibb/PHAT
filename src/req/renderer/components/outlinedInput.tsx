import * as React from "react";

import {FormControl} from "./formControl";
import {InputLabel} from "./inputLabel";

const MuiOutlinedInput: typeof import("@material-ui/core/OutlinedInput").default = require("@material-ui/core/OutlinedInput").default;

type MuiOutlinedInputProps = import("@material-ui/core/OutlinedInput/index").OutlinedInputProps;

export interface OutlinedInputState
{
    labelWidth : number;
}

export interface OutlinedInputProps {
    label: string;
    inputProps: Omit<MuiOutlinedInputProps, "labelWidth">;
}

export class OutlinedInput extends React.Component<OutlinedInputProps,OutlinedInputState>
{
    private labelRef = React.createRef<HTMLLabelElement>();
    public constructor(props : OutlinedInputProps)
    {
        super(props);

        this.state = {
            labelWidth : 0
        };
    }

    public updateLabelWidth()
    {
        if(this.labelRef.current)
        {
            this.setState({
                labelWidth : this.labelRef.current.offsetWidth
            });
        }
    }

    public componentDidMount()
    {
        this.updateLabelWidth();
    }

    public componentDidUpdate(prevProps : Readonly<OutlinedInputProps>)
    {
        if(prevProps.label != this.props.label)
            this.updateLabelWidth();
    }

    public componentWillReceiveProps()
    {
        this.updateLabelWidth();
    }

    public render() : JSX.Element
    {
    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap"
        }}>
            <FormControl variant="outlined">
                <InputLabel ref={this.labelRef}>
                    {this.props.label}
                </InputLabel>
                <MuiOutlinedInput
                    {...this.props.inputProps}
                    onChange={(event) => {
                        this.updateLabelWidth();
                        if(this.props.inputProps.onChange)
                            this.props.inputProps.onChange(event);
                    }}
                    labelWidth={this.state.labelWidth}
                />
            </FormControl>
        </div>
    );

    }

    
}
