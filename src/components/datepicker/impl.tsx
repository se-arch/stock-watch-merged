import React from "react"

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { IconButton } from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Update';
import { Input, TextField } from '@material-ui/core';
// import { TextField } from '@material-ui/pickers';

type DatePickerState = {
    startDate: Date | null,
    endDate: Date | null,
    minDate: Date | null,
    maxDate: Date | null,
}

type DatePickerProps = {
    feedback: (interval: { start: Date, end: Date }) => void;
    start: Date,
    end: Date,
    minDate: Date,
    maxDate: Date
}

class DatePickerWrapper extends React.Component<DatePickerProps, DatePickerState> {
    state: DatePickerState = {
        startDate: null,
        endDate: null,
        minDate: null,
        maxDate: null,
    };

    handleUpdateRange = () => {
        let { startDate, endDate } = this.state;
        startDate = startDate ? startDate : this.props.start;
        endDate = endDate ? endDate : this.props.end;

        this.props.feedback({ start: startDate as Date, end: endDate as Date });
    }

    componentDidMount() {
        this.setState({ startDate: this.props.start, endDate: this.props.end });
        this.setState({ minDate: this.props.minDate, maxDate: this.props.maxDate });
    }

    render() {
        const startDate = this.state.startDate ? this.state.startDate : this.props.start;
        const endDate = this.state.endDate ? this.state.endDate : this.props.end;

        const commonProps = {
            showMonthYearDropdown: true,
            showMonthYearPicker: true,
            dateFormat: "MM/yyyy",
            startDate: startDate,
            endDate: endDate,
            className: "calendartInput",
            customInput: (<Input></Input>),
            customTimeInput: (
                <TextField
                  id="date"
                  label="Birthday"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
            )
        }

        return (
            <div className="datepicker">
                <DatePicker
                  selected={startDate}
                  onChange={date => {this.setState({startDate: date as Date})}}
                  selectsStart
                  minDate={this.state.minDate}
                  maxDate={this.props.end}
                  {...commonProps}
                />
                <DatePicker
                  selected={endDate}
                  onChange={date => {this.setState({endDate: date as Date})}}
                  selectsEnd
                  minDate={startDate}
                  maxDate={this.state.maxDate}
                  {...commonProps}
                />
                <IconButton className="updateDateRange" onClick={this.handleUpdateRange}>
                    <UpdateIcon />
                </IconButton>
            </div>
        );
    }
}

export default DatePickerWrapper;
