import harmonicJSON from "./data/harmonic_oscillator_data.json" with {type: "json"};
import dampedJSON from "./data/damped_oscillator_data.json" with {type: "json"};
import drivenJSON from "./data/driven_oscillator_data.json" with {type: "json"};
import chaoticJSON1 from "./data/chaotic_motion_data_1.json" with {type: "json"};
import chaoticJSON2 from "./data/chaotic_motion_data_2.json" with {type: "json"};


function plotTimeSeries(dataObject, titleString, divID, includeNonLinearFit=false) {
    /*
        Plot the time series data phi = f(t) of a json object. If includeNonLinearFit is 
        true, the function also plots the non linear least-squares fit. 
        Arguments: 
        dataObject -- object
        titleString -- string for the title of the plot
        divID -- string, id of the div container that will display the plot
        includeNonLinearFit -- boolean indicating if the non-linear fit should be plotted
    */
    const xExpData = dataObject.raw_data.time;
    const yExpData = dataObject.raw_data.phi;

    const timeSeriesData = [{
        x: xExpData,
        y: yExpData,
        mode: "lines",
        name: "Experimental data"
    }];

    if (includeNonLinearFit) {
        const xFitData = dataObject.fit_data.time_fit;
        const yFitData = dataObject.fit_data.phi_fit;

        const xPeaks = dataObject.fit_data.time_peaks;
        const yPeaks = dataObject.fit_data.phi_peaks;

        const fitData = {
            x: xFitData,
            y: yFitData,
            mode: "lines",
            line: {
                color: "rgb(0,0,0)",
                width: 1.5
            },
            name: "Non linear fit data"
        };

        const peaksData = {
            x: xPeaks,
            y: yPeaks,
            mode: "markers",
            marker: {
                color: "rgb(0,0,0)",
                size: 8
            },
            name: "Peaks data"
        }

        timeSeriesData.push(fitData, peaksData);
    };

    const layout = {
        title: {
            text: titleString,
            font: {
                family: "Computer Modern",
                size: 24
            }
        },
        xaxis: {
            title: {
                text: "Time t(s)",
                font: {
                    family: "Computer Modern",
                    size: 18,
                    color: "rgb(0,0,0)"
                }
            }
        },
        yaxis: {
            title: {
                text: "$\\phi(rad)$",
                font: {
                    family: "Computer Modern",
                    size: 18,
                    color: "rgb(0,0,0)"
                }
            }
        }
    }
    Plotly.newPlot(divID, timeSeriesData, layout);
};


function plotPhaseSpace(dataObject, titleString, divID) {
    const xExpData = dataObject.raw_data["phi"];
    const yExpData = dataObject.raw_data["omega"];

    const phaseSpaceData = [{
        x: xExpData,
        y: yExpData,
        mode: "lines",
        name: "Experimental data"
    }];

    const layout = {
        title: {
            text: titleString,
            font: {
                family: "Computer Modern",
                size: 24
            }
        },
        xaxis: {
            title: {
                text: "$\\text{Angular position} \\; \\; \\phi(rad)$",
                font: {
                    family: "Computer Modern",
                    size: 18,
                    color: "rgb(0,0,0)"
                }
            }
        },
        yaxis: {
            title: {
                text: "$\\text{Angular velocity} \\; \\; \\omega(rad/s)$",
                font: {
                    family: "Computer Modern",
                    size: 18,
                    color: "rgb(0,0,0)"
                }
            }
        }
    }

    Plotly.newPlot(divID, phaseSpaceData, layout);
}


function plotStateSpace3D(dataObject, titleString, divID) {
    const xExpData = dataObject.raw_data.phi;
    const yExpData = dataObject.raw_data.omega;
    const zExpData = dataObject.raw_data.time;

    const stateSpace3DData = [{
        x: xExpData,
        y: yExpData,
        z: zExpData,
        type: "scatter3d",
        mode: "markers",
        name: "Experimental data",
        opacity: 0.9,
        marker: {
            size: 7.5,
            color: "rgb(64, 145, 182)",
            line: {
                color: "black",
                width: 1,
                opacity: 0.6
            }
        }
    }];

    const layout = {
        title: {
            text: titleString,
            font: {
                family: "Computer Modern",
                size: 24
            }
        },
        scene: {
            camera: {
                eye: {x: 1., y:2., z:1.}
            },
            xaxis: {
                title: {
                    text: "φ(rad)",
                    font: {
                        family: "Computer Modern",
                        size: 18,
                        color: "rgb(0,0,0)"
                    }
                }
            },
            yaxis: {
                title: {
                    text: "ω(rad/s)",
                    font: {
                        family: "Computer Modern",
                        size: 18,
                        color: "rgb(0,0,0)"
                    }
                }
            },
            zaxis: {
                title: {
                    text: "t(s)",
                    font: {
                        family: "Computer Modern",
                        size: 18,
                        color: "rgb(0,0,0)"
                    }
                }
            },
        },
        width: 550,
    	height: 550
    }

    Plotly.newPlot(divID, stateSpace3DData, layout);
}