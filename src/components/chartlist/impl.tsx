import React from "react"
import ChartItem from "./chartitem"
// import { Moment } from 'moment';

type APIDataType = {
    [key: string]: {
        [key: string]: number[] | string
    };
};

type ChartListProps = {
    data: APIDataType,
    merged: boolean,
    removeSymbol: (symbol: string) => void
};
type ChartListState = {
    chartData: APIDataType
};

class ChartList extends React.Component<ChartListProps, ChartListState> {
    state: ChartListState = {
        chartData: {}
    };

    removeChart = (item: ChartItem) => {
        this.props.removeSymbol(item.symbol);
    }

    private getLabel(timestamp: number) {
        const dateObj = new Date(timestamp * 1000);
        const month = dateObj.getUTCMonth() + 1;
        const day = dateObj.getUTCDate();
        // const year = dateObj.getUTCFullYear();

        return `${day} / ${month}`;
    }

    private getData() {
        const chartsData: any[] = [];
        const data: any[] = [];

        // FIXME! do not use map for not map stuff
        Object.entries(this.props.data).reverse().map(item => {
            const symbol = item[0];

            if (item[1].s === "no_data") {
                // eslint-disable-next-line
                return;
            }

            const points = item[1].o as number[];
            const labels = (item[1].t as number[]).map(this.getLabel);

            if (!this.props.merged) {
                chartsData.push({
                    symbol, data: [{ points, labels, symbol }]
                });
            } else {
                data.push({ points, labels, symbol });
            }

            // eslint-disable-next-line
            return;
        });

        if(data.length && this.props.merged) {
            chartsData.push({ symbol: "merged", data })
        }

        return chartsData;
    }

    render() {
        const data = this.getData();

        return (
            <div className="chartList">
                {
                    data.map(item => {
                        const { data, symbol } = item;
                        return (
                            <ChartItem
                                data={data}
                                key={symbol}
                                identifier={symbol}
                                remove={this.removeChart}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

export default ChartList;
