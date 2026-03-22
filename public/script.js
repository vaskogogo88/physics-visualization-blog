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
            aspectratio: {
                x: 2.3,
                y: 2.3,
                z: 1.6
            },
            camera: {
                eye: {x: 3, y:3, z:1.}
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
        margin: {
            l: 0,
            r: 0,
            b: 25,
            t: 50
        }
    }

    Plotly.newPlot(divID, stateSpace3DData, layout);
}


function getPlotDivData() {
    /**
     * @description - constructs an object of objects containing the div data that will be used for plotting 
     * the experimental data. Each sub-object has a divIDs key containing an array with the names of the divs
     * that will be used to plot the corresponding data, timeSeriesFit key (boolean) indicating whether the non-linear fit
     * will be plotted, and spaceSpacePlot key (boolean) indicating whether the 3d state space plot will be plotted.
     * @returns {Object} - An object that contains div IDs and plotting flags (timeSeriesFit, stateSpacePlot)
     */

    let plotDivData = {
        harmonicPlot: {
            divIDs: ["harmonic-time-series-fit", "harmonic-phase-space-2d", "harmonic-state-space-3d"],
            timeSeriesFit: true,
            stateSpacePlot: true
        }, 
        dampedPlot: {
            divIDs: ["damped-time-series", "damped-phase-space-2d", "damped-state-space-3d"],
            timeSeriesFit: false,
            stateSpacePlot: true
        },
        drivenPlot: {
            divIDs: ["driven-time-series", "driven-phase-space-2d", "driven-state-space-3d"],
            timeSeriesFit: false,
            stateSpacePlot: true
        },
        chaoticPlot1: {
            divIDs: ["chaotic-time-series-first", "chaotic-phase-space-first"],
            timeSeriesFit: false,
            stateSpacePlot: false
        },
        chaoticPlot2: {
            divIDs: ["chaotic-time-series-second", "chaotic-phase-space-second"],
            timeSeriesFit: false,
            stateSpacePlot: false
        }

    };

    return plotDivData;
}


function getFigureTitles() {
    /**
     * @returns {Object} - An object containing the figure titles for each physical experiment
     */
    
    return {
        harmonicPlot: "Simple Harmonic Motion",
        dampedPlot: "Damped Harmonic Motion",
        drivenPlot: "Damped Driven Harmonic Motion",
        chaoticPlot1: "Chaotic Motion (Experiment 1)",
        chaoticPlot2: "Chaotic Motion (Experiment 2)",
    }
}


function getJSONDataObject() {
    /**
     * Aggregates all imported experimental datasets into a single reference object.
     * @returns {Object} A collection of JSON data objects for each physical experiment.
     */
    return {
        harmonicPlot: harmonicJSON,
        dampedPlot: dampedJSON,
        drivenPlot: drivenJSON,
        chaoticPlot1: chaoticJSON1,
        chaoticPlot2: chaoticJSON2
    };
}


function plotExperimentalData(dataObject, plotDataObject, figureTitles) {
    /**
     * Plot each the time series, phase space and (optionally) the 3d state space plot
     * for each experiment.
     * @param {Object} dataObject - An object containing JSON data objects for each physical experiment
     * @param {Object} plotDataObject - An object that contains div IDs and plotting flags 
     * (timeSeriesFit, stateSpacePlot) for each experiment case. 
     */

    // Iterate over each key in the plotDataObject.
    for (let key in plotDataObject) {
        
        let experiment = plotDataObject[key];
        let data = dataObject[key];
        let baseTitle = figureTitles[key];

        // plot the time series plot 
        let timeSeriesTitle = `$\\text{${baseTitle} Time Series} \\; \\; \\phi=f(t)$`;
        plotTimeSeries(data, timeSeriesTitle, experiment.divIDs[0], experiment.timeSeriesFit);
        
        // plot the phase space plot
        let phaseSpaceTitle = `$\\text{${baseTitle} Phase Space} \\; \\; \\omega=f(\\phi)$`;
        plotPhaseSpace(data, phaseSpaceTitle, experiment.divIDs[1])

        // if the stateSpacePlot flag is true, plot the 3d state space plot.
        if (experiment.stateSpacePlot) {
            let stateSpaceTitle = `$\\text{${baseTitle} 3D State Space} \\; \\; \\ (\\phi, \\omega, t)$`
            plotStateSpace3D(data, stateSpaceTitle, experiment.divIDs[2]);
        }   
    }
}

let divDataObject = getPlotDivData();
let figureTitles = getFigureTitles();
let jsonDataObject = getJSONDataObject();
plotExperimentalData(jsonDataObject, divDataObject, figureTitles);

