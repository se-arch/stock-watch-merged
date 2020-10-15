import React, { FormEvent } from "react";
import AutoSuggest, {
    SuggestionsFetchRequestedParams,
    SuggestionSelectedEventData,
    SuggestionHighlightedParams,
    RenderSuggestionsContainerParams
} from 'react-autosuggest';
import theme from "./theme.module.css";

import { IconButton, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

type MainInputProps = {
    placeholder: string;
    feedback: (text: string, toAdd: boolean) => void;
    suggestions: (text: string) => Promise<string[]>;
    // dataError:
};
type MainInputState = {
    input: string;
    suggestions: string[],
};

class MainInput extends React.Component<MainInputProps, MainInputState> {
    state: MainInputState = {
        input: "",
        suggestions: [],
    };

    handleInputChange = async (ev: React.ChangeEvent<HTMLInputElement>, ) => {
        const value = ev.target.value;
        this.setState({ input: value });
    }

    submit = (type: string) => {
        if (!this.state.input) {
            return;
        }

        this.props.feedback(this.state.input, type === "add");
        this.setState({ input: "" });
    }

    onKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            this.submit("add")
        }
    }

    getSuggestionValue = (suggestion: string): string => {
        return suggestion;
    }

    renderSuggestion = (suggestion: any) => {
        return (
            <ListItem button key={suggestion.symbol}>
              <ListItemText inset primary={`${suggestion.name} (${suggestion.symbol})`} />
            </ListItem>
        );
    }

    getSuggestions = async (value: string) => {
        const results: any[] = await this.props.suggestions(value);

        this.setState({ suggestions: results });
        return results;
    }

    onSuggestionSelected = async (_: FormEvent, params: SuggestionSelectedEventData<string>) => {
        const { suggestion, method } = params;
        const symbol: string = (suggestion as any).symbol;

        await this.setState({ input: symbol });
        this.submit("add");
    }

    onSuggestionHighlighted = (params: SuggestionHighlightedParams) => {
        const { suggestion } = params;
        if (suggestion) {
            this.setState({ input: suggestion.symbol });
        }
    }

    onSuggestionsFetchRequested = async (params: SuggestionsFetchRequestedParams) => {
        const { value } = params;
        this.setState({ suggestions: await this.getSuggestions(value) });
    };

    onSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] });
    };

    renderInputComponent = (inputProps: any) => (
        <div>
            <TextField {...inputProps}/>
        </div>
    );

    renderSuggestionsContainer = (params: RenderSuggestionsContainerParams): React.ReactNode => {
        const { containerProps, children, query } = params;

        if(!query) {
            return ('');
        }

        return (
            <div className="suggenstionsContainer">
                <List
                    component="nav"
                    aria-label="companies"
                    {...containerProps}
                >
                    {children}
                </List>
            </div>
        );
    }

    render() {
        const inputProps = {
            placeholder: this.props.placeholder,
            onChange: this.handleInputChange,
            value: this.state.input,
            onKeyPress: this.onKeyPress,
            color: "primary"
        };

        return (
            <div className="MainInputContainer">
                <div>
                    <div>
                        <AutoSuggest
                            suggestions={this.state.suggestions}
                            onSuggestionsClearRequested={() => this.setState({ suggestions: [] })}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionSelected={this.onSuggestionSelected}
                            onSuggestionHighlighted={this.onSuggestionHighlighted}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            renderInputComponent={this.renderInputComponent}
                            renderSuggestionsContainer={this.renderSuggestionsContainer}
                            inputProps={inputProps}
                            theme={theme}
                        />
                    </div>
                    <div className="buttonContainer">
                        <IconButton
                            color="primary"
                            aria-label="add"
                            className="inputActions"
                            onClick={() => this.submit("add")}
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainInput;
