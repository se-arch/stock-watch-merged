import React from 'react';
import './App.css';

import moment from 'moment';

import MainInput from "./components/input"
import ChartList from "./components/chartlist"
import DatePickerWrapper from "./components/datepicker"

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

import MergeTypeIcon from '@material-ui/icons/MergeType';

import StockAPI from "./lib/api"
import StockWatchLogo from "./assets/imgs/stockwatch.svg"

type APIDataType = {
    [key: string]: {
        [key: string]: number[]
    };
};

type AppState = {
    placeholder: string;
    chartData: APIDataType,
    symbols: string[],
    mergedView: boolean,
    dataError: boolean,
    dateRange: {
        start: Date,
        end: Date,
    },
}

class App extends React.Component {
    private initialStart: Date = new Date(
        moment().subtract('months', 24).unix() * 1000
    );
    private initialEnd: Date = new Date(
        moment().subtract('months', 3).unix() * 1000
    );

    state: AppState = {
        placeholder: "Type a symbol or a company name",
        chartData: {},
        symbols: [],
        mergedView: false,
        dataError: false,
        dateRange: {
            start: this.initialStart,
            end: this.initialEnd,
        },
    };

    private api: StockAPI = new StockAPI();

    updateData = async (intervalChanged: boolean) => {
        const { start, end } = this.state.dateRange;
        let startDate = start.getTime();
        let endDate = end.getTime();

        const data: any = {}
        for (let symbol of this.state.symbols) {
            if(symbol in this.state.chartData && !intervalChanged) {
                data[symbol] = this.state.chartData[symbol];
                continue;
            }
            const results = await this.api.getData(symbol, startDate, endDate);

            if (results.s === "ok") {
                data[symbol] = results;
            } else {
                this.setState({ dataError: true });
            }
        }

        this.setState({ chartData: data });
    }

    symbolSelect = async (text: string, toAdd: boolean) => {
        let { symbols } = this.state;
        if (!toAdd) {
            symbols = []
        }

        if (symbols.indexOf(text) >= 0) {
            return;
        }

        symbols.push(text);
        this.setState({ symbols: symbols }, () => {
            this.updateData(false);
        });
    }

    rangeUpdate = async (interval: any) => {
        this.setState({ dateRange: interval }, () => {
            this.updateData(true);
        });
    }

    getSuggestions = async (text: string) => {
        const items: any[] = await this.api.search(text);
        return items;
    }

    removeSymbol = (symbol: string) => {
        let chartData: APIDataType = this.state.chartData;
        delete chartData[symbol];

        let symbols: string[] = this.state.symbols;
        symbols = symbols.filter(x => x != symbol);

        this.setState({ chartData, symbols });
    }

    render() {
        const { start, end } = this.state.dateRange;
        const theme = createMuiTheme({
            spacing: 4,
            palette: {
                error: {
                    main: "#d32f2f",
                },
                primary: {
                    main: '#0044ff',
                },
                secondary: {
                    light: '#0066ff',
                    main: '#ff4400',
                    contrastText: '#ffcc00',
                },
                contrastThreshold: 3,
                tonalOffset: 0.2,
            },
        });

        return (
            <ThemeProvider theme={theme}>
                <div className="App">
                    <div className="background">
                        <div className="header">
                            <span>
                                <div className="title">
                                    <img src={StockWatchLogo} alt="React Logo" />
                                </div>
                                <DatePickerWrapper
                                    feedback={this.rangeUpdate}
                                    start={start}
                                    end={end}
                                    minDate={this.initialStart}
                                    maxDate={this.initialEnd}
                                />
                                <div className="interaction">
                                    <div className="mergeButton">
                                        <IconButton
                                            color="primary"
                                            aria-label="merge"
                                            onClick={() => { this.setState({ mergedView: !this.state.mergedView }) }}
                                        >
                                            <MergeTypeIcon />
                                        </IconButton>
                                    </div>
                                    <MainInput
                                        placeholder={this.state.placeholder}
                                        feedback={this.symbolSelect}
                                        suggestions={this.getSuggestions}
                                        // error={this.state.error}
                                    />
                                </div>
                            </span>
                        </div>
                        <div className="content">
                            <div className="center">
                                <ChartList
                                    data={this.state.chartData}
                                    merged={this.state.mergedView}
                                    removeSymbol={this.removeSymbol}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

export default App;
