import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import "chartjs-plugin-annotation";

import React from "react"

import { IconButton } from '@material-ui/core';
import EqualizerTwoToneIcon from '@material-ui/icons/EqualizerTwoTone';
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';

type DataType = {
    points: number[],
    labels: string[],
    symbol: string,
};

type ChartProps = {
    data: DataType[];
    identifier: string;
    remove: (chart: ChartItem) => void
};
type ChartState = {
    annotationDrawTime: "afterDatasetsDraw" | undefined;
    colors: {
        [key: string]: string
    },
    shouldRedraw: boolean
};

class ChartItem extends React.Component<ChartProps, ChartState> {
    state: ChartState = {
        annotationDrawTime: undefined,
        colors: {},
        shouldRedraw: false
    };
    private lineRef = React.createRef<Line>();
    private colors: { [key: string]: string } = {}
    public symbol: string = '';

    setRedraw = () => {
        return this.setState({ shouldRedraw: true })
    }

    constructor(props: ChartProps) {
        super(props);
        this.symbol = this.props.identifier;
    }

    componentDidMount() {
        this.setState({ colors: this.colors });
        window.addEventListener('resize', this.setRedraw, false);
        window.scrollTo(0, 0)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setRedraw, false);
    }

    setAnnotationProps = (options: ChartOptions) => {
        let colors = this.colors;
        let annotations = this.props.data.map(dataset => {
            const values = dataset.points;
            let average = 0;

            if (values.length) {
                average = values.reduce((x, y) => x + y) / values.length;
            } else {
                average = 0;
            }

            return {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: average,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                label: {
                    enabled: true,
                    content: `${dataset.symbol} price average: ${Math.round(average * 100) / 100}`,
                    position: "right",
                    backgroundColor: 'rgba(0,0,0,0.6)',
                },
                onMouseenter: function() {
                    this.borderColor = colors[dataset.symbol];
                    (this as any).options.label.backgroundColor = 'rgba(0,0,0,0.8)';
                    lineRef.current!.chartInstance.update();
                },
                onMouseleave: function() {
                    this.borderColor = colors[dataset.symbol];
                    (this as any).options.label.backgroundColor = 'rgba(0,0,0,0.6)';
                    lineRef.current!.chartInstance.update();
                },
            };
        })

        const lineRef = this.lineRef;
        let annotation: any = {
            events: ['click', 'mouseenter', 'mouseleave'],
            drawTime: this.state.annotationDrawTime,
            annotations: annotations
        }

        options.annotation = annotation;
    }

    getRandomRGBA() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ', 0.7)';
    }

    getProps = (): [ChartOptions, ChartData] => {
        const options: ChartOptions = {
            responsive: true,
            title: {
                display: false,
                fontSize: 20
            },
            legend: {
                display: true,
                position: 'top'
            },
            scales: {
                yAxes: [{
                    stacked: false
                }]
            }
        }

        this.setAnnotationProps(options);

        let datasets: any[] = this.props.data.map(item => {
            let color;

            if (item.symbol in this.colors) {
                color = this.colors[item.symbol];
            } else {
                color = this.getRandomRGBA();
                this.colors[item.symbol] = color;
            }

            return {
                label: item.symbol,
                labels: item.labels,
                pointStyle: "line",
                pointRadius: 3,
                fill: 'origin',
                lineTension: 0,
                backgroundColor: color,
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 1,
                data: item.points
            };
        });

        const data: ChartData = {
            labels: this.props.data[0].labels,
            datasets: datasets
        }

        return [
            options, data
        ]
    }

    toggleAnnotations = () => {
        const chart: Chart = this.lineRef.current!.chartInstance;

        if (chart.options!.annotation!.drawTime === "afterDatasetsDraw") {
            chart.options!.annotation!.drawTime = undefined;
            this.setState({ annotationDrawTime: undefined });
        } else {
            chart.options!.annotation!.drawTime = "afterDatasetsDraw";
            this.setState({ annotationDrawTime: "afterDatasetsDraw" });
        }

        chart.update();
    }

    removeChart = () => {
        this.props.remove(this);
    }

    render() {
        if (!this.props.data) {
            return;
        }

        const [options, data] = this.getProps();
        return (
            <div className="chartContainer">
                <Line
                    redraw={this.state.shouldRedraw}
                    data={data}
                    options={options}
                    ref={this.lineRef}
                />
                <IconButton
                    color="primary"
                    aria-label="average"
                    onClick={this.toggleAnnotations}
                >
                    <EqualizerTwoToneIcon />
                </IconButton>
                {this.symbol !== "merged" ? (
                    <IconButton
                        color="secondary"
                        aria-label="average"
                        onClick={this.removeChart}
                    >
                        <DeleteForeverTwoToneIcon />
                    </IconButton>
                ) : ''}
            </div>
        );
    }
}

export default ChartItem;
