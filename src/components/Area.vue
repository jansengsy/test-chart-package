<template>
    <div :id="container_id">
        <svg :id="svg_id" class="svg"></svg>
        <div :id="tooltip_id" class="tooltip"></div>
    </div>
</template>

<script>
    import * as d3 from "d3";
    import { uid } from 'uid';

    export default {
        name: "Area",
        data() {
            return {
                chartData: {},
                loading: false,
                uid: null,

                // Tooltip DOM elements
                areaTooltip: null,
                areaTooltipLineX: null,
                areaTooltipLineY: null,

                // temp stuff
                areaMargin: { top: 5, right: 15, bottom: 45, left: 45, },
                areaWidth: 0,
                areaHeight: 0,
                legendHeight: 0,

                // Really really temp stuff
                temp_uid: 0,
                svg_id: "",
                tooltip_id: "",
                container_id: "",

                globalChartData: {},
                test_data: {
                    "Name": "test",
                    "SummaryTable": {},
                    "XValues": {},
                    "YValues": {},
                    "RawValues": {
                        "Default": [
                            [
                                1625011200,
                                49.260710692982656,
                                81.78178957678797,
                                98.57347827268825,
                                100,
                                100
                            ],
                            [
                                1627689600,
                                27.076539681757104,
                                71.9479104854879,
                                98.53816276045073,
                                100,
                                100
                            ],
                            [
                                1630368000,
                                21.22895916422911,
                                64.81755358216594,
                                92.82771419674211,
                                99.99999999999999,
                                99.99999999999999
                            ],
                            [
                                1632960000,
                                15.999860060086126,
                                58.28087448448885,
                                90.67828255934201,
                                99.07415511503571,
                                100.00000000000001
                            ],
                            [
                                1635638400,
                                15.083869577176232,
                                59.0726061611658,
                                90.73534506856954,
                                99.02778024201685,
                                100
                            ],
                            [
                                1638230400,
                                8.834568490859354,
                                59.19950564940717,
                                89.4268640209096,
                                97.24065818850973,
                                100
                            ],
                            [
                                1640908800,
                                94.03377179522204,
                                94.03377179522204,
                                94.04679521513786,
                                100,
                                100
                            ],
                            [
                                1643587200,
                                11.890517993049018,
                                54.62456010007331,
                                89.05706645767779,
                                100,
                                100
                            ],
                            [
                                1646006400,
                                11.823968798961083,
                                54.59028799540414,
                                89.04880126569704,
                                100,
                                100
                            ],
                            [
                                1648684800,
                                6.607381377874495,
                                51.903801344159056,
                                88.40091673817129,
                                100,
                                100
                            ],
                            [
                                1651276800,
                                6.607444027330562,
                                51.90383358764838,
                                88.40092455770545,
                                100,
                                100
                            ],
                            [
                                1653955200,
                                6.607408861037891,
                                51.90381548435544,
                                88.40092013857314,
                                100,
                                100
                            ],
                            [
                                1656547200,
                                6.600297838107733,
                                51.900153360636686,
                                88.40003698263283,
                                100,
                                100
                            ],
                            [
                                1659225600,
                                6.592900535768851,
                                51.896343828103944,
                                88.39911826273776,
                                99.99999999999999,
                                99.99999999999999
                            ],
                            [
                                1661904000,
                                6.600293832382872,
                                51.90015130681773,
                                88.40003647988931,
                                100,
                                100
                            ],
                            [
                                1664496000,
                                17.80025089515881,
                                81.30005708680085,
                                94.20001772186836,
                                98.5000046002242,
                                99.99999999999999
                            ],
                            [
                                1667174400,
                                17.800252067596865,
                                81.30005730513017,
                                94.20001776930528,
                                98.5000045653193,
                                99.99999999999999
                            ],
                            [
                                1669766400,
                                17.800245753371772,
                                81.30005590206949,
                                94.2000173108242,
                                98.50000447181817,
                                100
                            ],
                            [
                                1672444800,
                                17.800245820318,
                                81.30005596128167,
                                94.2000173522111,
                                98.5000044825209,
                                100
                            ],
                            [
                                1675123200,
                                17.800244162268143,
                                81.30005555413285,
                                94.20001723858056,
                                98.50000449131075,
                                100
                            ]
                        ]
                    },
                    "Labels": {
                        "Default": [
                            "Cash",
                            "Debt",
                            "Equity",
                            "Hedge Fund",
                            "Commodity"
                        ]
                    },
                    "Colours": {
                        "Cash": "c0c0c0",
                        "Debt": "43b143",
                        "Equity": "005ab5",
                        "Hedge Fund": "ad0000",
                        "Commodity": "ff6969"
                    },
                    "RawHtml": null
                }
            }
        },
        created() {
            this.temp_uid = uid();
            this.svg_id = `chart_${this.temp_uid}`;
            this.tooltip_id = `tooltip_${this.temp_uid}`;
            this.test_data.Name = `chart_${this.temp_uid}`;
            this.container_id = `container_${this.temp_uid}`;
        },
        mounted() {
            window.addEventListener('resize', () => this.realTimeAreaChartOnResize(this.temp_uid));
            this.loadData();
        },
        unmounted() {
            window.removeEventListener('resize', () => this.realTimeAreaChartOnResize(this.temp_uid));
        },
        methods: {
            redraw() {

            },
            clearChartDrawArea(id) {
                const container = d3.select(`#container_${id}`);
                container.selectAll(`.legend_${id}`).remove();
                container.selectAll(".chart_svg").remove();
            },
            loadData() {
                // Initial creation (this is a step for the C3 pipeline but, for now, D3 charts need this)
                let uid;

                uid = this.test_data.Name.replace("chart_", "");
                this.globalChartData[uid] = this.test_data;

                const colours = Object.values(this.test_data.Colours).map(value => '#' + value);
                
                this.clearChartDrawArea(uid);

                // Hide the spinner as we're now drawing the chart
                //hideChartSpinner(test_data);

                // Ensure chart data exists
                if (this.test_data.RawValues.Default.length < 1) {
                    //showChartNoData(test_data);
                    return;
                }

                const legendData = this.test_data.Labels.Default.map((value) => value.replaceAll(" ", "_"));
                
                // Data values
                let data = this.test_data.RawValues.Default;
                const assetCount = legendData.length;
                const time = [];
                
                // SVG Size values:
                this.areaWidth = d3.select(`#${this.test_data.Name}`).node().getBoundingClientRect().width - this.areaMargin.left - this.areaMargin.right;
                this.areaHeight = d3.select(`#${this.test_data.Name}`).node().getBoundingClientRect().height - this.areaMargin.top - this.areaMargin.bottom;
                this.legendHeight = 25;

                this.drawLegend("area", this.areaWidth, this.areaHeight, this.areaMargin, uid, this.test_data.Labels.Default, colours);

                /*
                    Data arrives like this: 
                        [UTC Timestamp, percentage a, percentage b, percentage c]

                    Data leaves like this: 
                        [ [UTC Timestamp, percentage a], [UTC Timestamp, percentage b], [UTC Timestamp, percentage c] ]
                */
                data = data.flatMap(subArray => {
                    const firstValue = subArray[0];
                    const remainingValues = subArray.slice(1);
                    return remainingValues.map(value => [firstValue, value]);
                });

                // For each datum in data, I add additional information so that it is acessible for tooltips
                data.forEach((d, i) => {
                    d.assetType = legendData[i % assetCount];
                    d.date = new Date(d[0] * 1000).toLocaleDateString();
                    d.percentage = i % assetCount > 0 ? Math.abs(d[1] - data[i - 1][1]) : d[1];
                    d.startingPercentage = i > 0 ? data[i - 1][1] : null;
                });

                // Create an array of dates, converted from UTC to JS Date format.
                data.forEach((d, i) => {
                    d[0] = d[0] * 1000;
                    let date = new Date(d[0]);
                    time.push(date);
                });

                // Create the SVG
                const svg = d3.select(`#${this.test_data.Name}`)
                    .append("g")
                    .attr("width", `${this.areaWidth + this.areaMargin.left + this.areaMargin.right}`)
                    .attr("height", `${this.areaHeight + this.areaMargin.top + this.areaMargin.bottom}`)
                    .attr("class", "chart_svg")
                    .attr("transform", `translate(${this.areaMargin.left}, ${this.areaMargin.top})`);

                // Set up the scales
                var xScale = d3.scaleTime()
                    .domain(d3.extent(time))
                    .range([0, this.areaWidth]);

                const yScale = d3.scaleLinear()
                    .domain([100, 0])
                    .nice()
                    .range([0, this.areaHeight - this.areaMargin.bottom - this.legendHeight]);

                // Area generator
                const area = d3.area()
                    .x(d => xScale(d[0]))
                    // I have already calculated the starting percentage to make it easier
                    .y0(d => d.assetType === legendData[0] ? this.areaHeight - this.areaMargin.bottom - this.legendHeight : yScale(d.startingPercentage))
                    .y1(d => yScale(d[1]));

                // Draw the areas
                for (let step = 0; step < data.length - assetCount; step++) {
                    svg.append("path")
                        .datum([data[step], data[step + assetCount]])
                        .attr("d", area)
                        .attr("id", "area")
                        .attr("class", `area ${legendData[step % assetCount]}`)
                        .attr("fill", `#${this.test_data.Colours[legendData[step % assetCount].replaceAll("_", " ")]}`);
                }

                // Create the X axis
                var xAxis = d3.axisBottom(xScale);
                xAxis.tickFormat(d3.timeFormat('%b %y'));

                svg.append('g')
                    .attr("class", "x-axis")
                    .style("color", "black")
                    .style("font-size", "10px")
                    .attr('transform', `translate(0, ${this.areaHeight - this.areaMargin.bottom - this.legendHeight})`)
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform", "rotate(45)")
                    .style("text-anchor", "start");

                // Create the Y axis
                const yAxis = d3.axisLeft(yScale);
                yAxis.tickFormat(d3.format(".1f"));

                svg.append("g")
                    .attr("class", "y-axis")
                    .style("color", "black")
                    .style("font-size", "10px")
                    .call(yAxis);

                // Adding the event listeners to the drawn areas
                d3.selectAll(`#chart_${uid}`)
                    .on("mousemove", e => {
                        // Draw tooltip
                        if (d3.event.target.id === "area") {
                            this.showAreaTooltip(d3.event);
                        }
                        // Delete tooltip if mouse has left chart area
                        else if (d3.event.target.id !== "tooltip-line") this.hideAreaTooltip();
                    });
                
                this.areaTooltip = d3.select(`#tooltip_${uid}`);
                this.areaTooltipLineX = d3.select(`#chart_${uid}`).append("line").attr("id", "tooltip-line").attr("stroke", "red").attr("stroke-width", 1).attr("stroke-dasharray", "2,2");
                this.areaTooltipLineY = d3.select(`#chart_${uid}`).append("line").attr("id", "tooltip-line").attr("stroke", "red").attr("stroke-width", 1).attr("stroke-dasharray", "2,2");

                //setChartAsLoaded(uid);
            },
            showAreaTooltip(e) {

                // Set the position of the tooltip lines
                this.areaTooltipLineY.style("display", "block").attr("x1", e.clientX).attr("x2", e.clientX).attr("y1", 0 + this.areaMargin.top).attr("y2", this.areaHeight - this.areaMargin.bottom + this.areaMargin.top - this.legendHeight);
                this.areaTooltipLineX.style("display", "block").attr("y1", e.clientY).attr("y2", e.clientY).attr("x1", 0 + this.areaMargin.left).attr("x2", this.areaWidth + this.areaMargin.left);
            
                const pointData = e.target.__data__[0];
                let tooltipX;
                let tooltipY;
            
                // If we're on the right side of the chart, draw the tooltip toward the left
                if(e.clientX > this.areaWidth / 2) {
                    tooltipX = e.clientX - 120;
                    tooltipY = e.clientY + this.areaMargin.bottom + 15;
                } else {
                    tooltipX = e.clientX + this.areaMargin.left - this.areaMargin.right;
                    tooltipY = e.clientY + this.areaMargin.bottom + 15;
                }
            
                this.areaTooltip.style("left", tooltipX + "px")
                    .style("top", tooltipY + "px");
            
                this.areaTooltip.style("display", "block");
                this.areaTooltip.style("color", "black");
            
                const textData = [
                    `<b>Asset:</b> ${pointData.assetType.replaceAll("_", " ")}`,
                    `<b>Percentage:</b> ${Number(pointData.percentage).toFixed(1)}%`,
                    `<b>Date:</b> ${pointData.date}`,
                ];
            
                // For each item in data array, add a line break after
                this.areaTooltip.html(textData.join("<br>"));
            },
            hideAreaTooltip() {
                this.areaTooltip.style("display", "none");
                this.areaTooltip.text("");
                this.areaTooltipLineX.style("display", "none");
                this.areaTooltipLineY.style("display", "none");
            },
            // Unused argument as at the moment this method is shared with c3 charts (which do require this value - will remove later)
            realTimeAreaChartOnResize(data) {
                this.loadData(this.test_data)
                //this.loadData(this.globalChartData[data.uid.replace("chart_", "")]);
            },
            highlightAsset(asset, uid) {
                d3.select(`#chart_${uid}`).selectAll(`.${asset.item}`).attr("fill", "yellow");
            },
            unhighlightAsset(asset, uid) {
                d3.select(`#chart_${uid}`).selectAll(`.${asset.item}`).attr("fill", `#${this.globalChartData[uid].Colours[asset.item.replaceAll("_", " ")]}`);
            },
            drawLegend(type, width, height, margin, uid, labels, colours) {

                const legendIconSize = 10;
                const rowHeight = 15;
                const legendMargin = 10;
                const legendWidth = width + margin.left + margin.right - legendMargin * 2;
                let legendItemsArray = [];
                let legendRowCurrentWidth = 0;
                let legendCurrentRow = 0;
                let legendRows = 0;

                labels.forEach((item, i) => {

                    const itemWidth = legendIconSize + this.getStringLengthInPixels(item) + 20; // 20 represents the gap between items
                    item = item.replaceAll(" ", "_");

                    // If the legend item would fit into the width we're happy
                    if (legendWidth > legendRowCurrentWidth + itemWidth) {
                        legendItemsArray[i] = {item, legendCurrentRow, itemWidth, legendRowCurrentWidth};
                        legendRowCurrentWidth += itemWidth;
                    } else { // If it would overflow we start a new legend row
                        legendCurrentRow += 1;
                        legendRows += 1;
                        legendRowCurrentWidth = 0;
                        legendItemsArray[i] = {item, legendCurrentRow, itemWidth, legendRowCurrentWidth};
                        legendRowCurrentWidth = itemWidth;
                    }
                });

                const legendContainer = d3.select(`#chart_${uid}`)
                    .append("g")
                    .attr("class", `legend_${uid}`)
                    .attr("transform", `translate(0, ${height + margin.top + margin.bottom - 60})`) // 60 represents the minimum legend height

                const legendItems = legendContainer.selectAll(".legend-item")
                    .data(legendItemsArray)
                    .enter()
                    .append("g")
                    .attr("class", "legend-item")
                    .attr("transform", d => `translate(${legendMargin + d.legendRowCurrentWidth}, ${rowHeight * d.legendCurrentRow})`)
                    .on("mouseenter", e => this.handleLegendIn(type, d3.event, uid))
                    .on("mouseout", e => this.handleLegendOut(type, d3.event, uid));

                legendItems.append("rect")
                    .attr("width", legendIconSize)
                    .attr("height", legendIconSize)
                    .attr("fill", (d, i) => `${colours[i]}`)
                    .attr("transform", (d, i) => {
                        `translate(${d.legendRowCurrentWidth}, ${legendIconSize / 2})`
                    });

                legendItems.append("text")
                    .attr("x", legendIconSize + 5) // Adjust the x-position of the text factoring the icon and a gap between
                    .attr("y", 9) // Adjust the y-position of the text to center vertically
                    .style("font-size", "14px")
                    .style("font-family", "Calibri")
                    .attr("transform", (d, i) => {
                        `translate(${d.legendRowCurrentWidth}, 0)`
                    })
                    .text(d => d.item.replaceAll("_", " "));
            },
            handleLegendIn(type, e, uid) {
                if (type === "area") {
                    this.highlightAsset(e.target.__data__, uid);
                } else if (type === "snail") {
                    const portfolioClass = e.target.__data__.item.replaceAll(" ", "_").replaceAll("/", "-").replaceAll(".", "");
                    d3.select(`#chart_${uid}`).selectAll(`.${portfolioClass}`).attr("stroke-width", 4);
                    d3.select(`#chart_${uid}`).selectAll(`circle.${portfolioClass}`).attr("r", 7);
                }
            },
            handleLegendOut(type, e, uid) {
                if (type === "area") {
                    this.unhighlightAsset(e.target.__data__, uid);
                } else if (type === "snail") {
                    const portfolioClass = e.target.__data__.item.replaceAll(" ", "_").replaceAll("/", "-").replaceAll(".", "");
                    d3.select(`#chart_${uid}`).selectAll(`.${portfolioClass}`).attr("stroke-width", 2);
                    d3.select(`#chart_${uid}`).selectAll(`circle.${portfolioClass}`).attr("r", 5);
                }
            },
            getStringLengthInPixels(string) {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                // Set font properties for measuring the string width
                const font = "Calibri";
                const fontSize = "14px";
                context.font = `${fontSize} ${font}`;

                // Get the width of the string in pixels
                const stringWidth = context.measureText(string).width;

                canvas.remove();

                return stringWidth;
            },
            draw() {
                console.log("This method will trigger the drawing of the chart");
            }
        }
    };
</script>

<style>

    .tooltip {
        position: absolute;
        pointer-events: none;
        opacity: 0.7;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 6px;
        font-size: 14px;
        font-family: Calibri;
        display: none;
    }

    .area {
        shape-rendering: crispEdges;
    }

    .svg {
        width: 100%;
        height: 100%;
    }
</style>