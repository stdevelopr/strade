import React from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY
} from "react-stockcharts/lib/coordinates";

import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";
import {
  Annotate,
  SvgPathAnnotation,
  buyPath,
  sellPath
} from "react-stockcharts/lib/annotation";
import {
  OHLCTooltip,
  MovingAverageTooltip,
  RSITooltip,
  MACDTooltip,
  SingleValueTooltip
} from "react-stockcharts/lib/tooltip";

import {
  CandlestickSeries,
  MACDSeries,
  RSISeries,
  BarSeries,
  LineSeries
} from "react-stockcharts/lib/series";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";

const macdAppearance = {
  stroke: {
    macd: "#FF0000",
    signal: "#00F300"
  },
  fill: {
    divergence: "#4682B4"
  }
};

const mouseEdgeAppearance = {
  textFill: "#542605",
  stroke: "#05233B",
  strokeOpacity: 1,
  strokeWidth: 3,
  arrowWidth: 5,
  fill: "#BCDEFA"
};

class CandleStickStockScaleChart extends React.Component {
  render() {
    const { type, data: initialData, width, ratio } = this.props;

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => new Date(d.date)
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData
    );

    const xExtents = [
      xAccessor(last(data)),
      xAccessor(data[data.length - 100])
    ];

    const defaultAnnotationProps = {
      onClick: console.log.bind(console)
    };

    const longAnnotationProps = {
      ...defaultAnnotationProps,
      y: ({ yScale, datum }) => yScale(datum.low),
      fill: "#006517",
      path: buyPath,
      tooltip: "Go long"
    };

    const shortAnnotationProps = {
      ...defaultAnnotationProps,
      y: ({ yScale, datum }) => yScale(datum.high),
      fill: "#FF0000",
      path: sellPath,
      tooltip: "Go short"
    };

    return (
      <ChartCanvas
        height={800}
        ratio={ratio}
        width={width}
        margin={{ left: 80, right: 80, top: 30, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart
          id={1}
          yExtents={d => [d.high, d.low]}
          padding={{ top: 50, bottom: 50 }}
          height={520}
        >
          <XAxis axisAt="bottom" orient="bottom" ticks={6} />
          <YAxis axisAt="left" orient="left" ticks={5} />
          <CandlestickSeries />
          {/* <LineSeries yAccessor={d => d.close} /> */}
          <OHLCTooltip forChart={1} origin={[0, -20]} />

          <Annotate
            with={SvgPathAnnotation}
            when={d => d.longShort === "LONG"}
            usingProps={longAnnotationProps}
          />
          <Annotate
            with={SvgPathAnnotation}
            when={d => d.longShort === "SHORT"}
            usingProps={shortAnnotationProps}
          />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d")}
          />
          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".4s")}
          />
        </Chart>
        <Chart
          id={2}
          origin={(w, h) => [0, h - 150]}
          height={75}
          yExtents={d => d.volume}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format(".2s")}
          />
          <BarSeries
            yAccessor={d => d.volume}
            fill={d => (d.close > d.open ? "#6BA583" : "red")}
          />
        </Chart>
        <CrossHairCursor />
        {this.props.macd && (
          <Chart
            id={3}
            yExtents={d => d.macd}
            origin={(w, h) => [0, h - 200]}
            padding={{ top: 20, bottom: 10 }}
            height={100}
          >
            <XAxis axisAt="bottom" orient="bottom" />
            <YAxis axisAt="left" orient="left" ticks={2} />
            <MouseCoordinateY
              at="left"
              orient="left"
              displayFormat={format(".4f")}
              {...mouseEdgeAppearance}
            />
            <MACDTooltip
              origin={[-38, 15]}
              yAccessor={d => d.macd}
              options={{
                fast: 12,
                slow: 26,
                signal: 9
              }}
              appearance={macdAppearance}
            />
            <MACDSeries yAccessor={d => d.macd} {...macdAppearance} />
          </Chart>
        )}
        {this.props.rsi && (
          <Chart
            id={4}
            yExtents={[0, 100]}
            height={100}
            origin={(w, h) => [0, h - 100]}
          >
            <XAxis
              axisAt="bottom"
              orient="bottom"
              showTicks={false}
              outerTickSize={0}
            />
            <YAxis axisAt="left" orient="left" tickValues={[30, 50, 70]} />
            <MouseCoordinateY
              at="left"
              orient="left"
              displayFormat={format(".4f")}
            />

            <RSISeries yAccessor={d => d.rsi} />

            <RSITooltip
              origin={[-38, 15]}
              yAccessor={d => d.rsi}
              options={{ windowSize: 14 }}
            />
          </Chart>
        )}
      </ChartCanvas>
    );
  }
}

CandleStickStockScaleChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickStockScaleChart.defaultProps = {
  type: "svg"
};
CandleStickStockScaleChart = fitWidth(CandleStickStockScaleChart);

export default CandleStickStockScaleChart;
