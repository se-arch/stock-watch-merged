import React from "react"

import ResultItem from "./item"

type DropDownProps = {
  placeholder: string;
};
type DropDownState = {
  count: number;
};

class DropDown extends React.Component<DropDownState, DropDownState> {
    state: DropDownState = {
      count: 0,
    };

    render() {
        return (
            <ul className="results">
            </ul>
        );
    }
}

export default DropDown;
