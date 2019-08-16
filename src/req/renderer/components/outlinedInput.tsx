import * as React from "react";
import { FormControl } from './formControl';
import { InputLabel } from './inputLabel';

const MuiOutlinedInput: typeof import("@material-ui/core/OutlinedInput").default = require("@material-ui/core/OutlinedInput").default;

type MuiOutlinedInputProps = import("@material-ui/core/OutlinedInput/index").OutlinedInputProps;

export interface OutlinedInputProps {
    label: string;
    inputProps: Omit<MuiOutlinedInputProps, "labelWidth">;
}

export function OutlinedInput(props: OutlinedInputProps
): JSX.Element {
    const [labelWidth, setLabelWidth] = React.useState(0);
    const labelRef = React.useRef<HTMLLabelElement>(null);

    React.useEffect(() => {
        setLabelWidth(labelRef.current!.offsetWidth);
    }, []);

    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap"
        }}>
            <FormControl variant="outlined">
                <InputLabel ref={labelRef}>
                    {props.label}
                </InputLabel>
                <MuiOutlinedInput
                    {...props.inputProps}

                    labelWidth={labelWidth}
                />
            </FormControl>
        </div>
    );
}
