import numpy as np
import matplotlib.pyplot as plt
import scienceplots
import scipy
import os
import scipy.optimize
import scipy.signal
import json


def degrees_to_rad(phi):
    """
        Convert the angle phi from degrees to radians.
        Arguments:
        phi -- float
        Returns:
        the angle phi in radians.
    """
    return phi * np.pi / 180


def write_dictionary_to_json(dictionary, file_name):
    """
        Convert a python dictionary to a json file and save it.
        Arguments:
        dictionary -- python dictionary
        file_name -- the file name where the json would be saved (string)
    """
    with open(f"public/data/{file_name}.json", "w") as f:
        json.dump(dictionary, f)


def exponential_fit_function(t, a, b ,c):
    """
        Exponential function for fitting the attenuated angular position with time values
        Arguments:
        t -- time values (single value or array)
        a, b, c -- fit parameters of the function. There are to be calculated using a non-
                   linear fit algorithm
        Returns:
        The predicted angular position for given time and fit parameters. 
    """
    return a * np.exp(-b * t) + c


def compute_peaks_fit_parameters(time_peaks, phi_peaks):
    """
        Compute the optimized fitting parameters for the exponential fit function of the 
        angular position phi(t) with respect to time.
        Arguments:
        time_peaks -- array of time values at each peak. 
        phi_peaks -- array of phi values at each peak.
        Returns: 
        optimized_parameters -- list of optimized parameters along with their uncertainties.
    """
    popt, pcov = scipy.optimize.curve_fit(exponential_fit_function, time_peaks, phi_peaks)
    
    # Convert the popt and perr to list so values are float instead of numpy.float64
    popt = popt.tolist()
    perr = np.sqrt(np.diag(pcov)).tolist()
    
    optimized_parameters = {
        "amplitude_a": {
            "value": popt[0],
            "uncertainty": perr[0],
            "unit": "rad"
        },
        "damping_coefficient_b": {
            "value": popt[1],
            "uncertainty": perr[1],
            "unit": "s^-1"
        },
        "equilibrium_offset_c": {
            "value": popt[2],
            "uncertainty": perr[2],
            "unit": "rad"
        }
    }
    return optimized_parameters


def compute_peaks(time, phi):
    """
        Finds the peaks of a sinusoidal wave phi(t).
        Arguments:
        time -- 1D array containing time stamps
        phi -- 1D array containing the angular positions
        Returns:
        time_peaks -- array of time values at each peak. 
        phi_peaks -- array of phi values at each peak.
    """
    amplitude = np.max(phi)
    peaks = scipy.signal.find_peaks(phi, height=0.1*amplitude, distance=15)
    time_peaks = [time[i] for i in peaks[0]]
    phi_peaks = [phi[i] for i in peaks[0]]
    return time_peaks, phi_peaks

        
def convert_raw_data_to_dictionary(data_file, title, skip_lines, include_fit=False):
    """
        Organizes the raw experimental data into structured dictionaries with the intention of being converted to json
        later. 
        Arguments:
        data_file -- string
        title -- string
        skip_lines -- int
        include_fit -- boolean
        Return:
        A dictionary containing raw sensor data (time, phi, omega) and, optionally, fitted model parameters 
        and peak coordinates.
    """
    raw_data = np.genfromtxt("data_preprocessing/data/" + data_file, skip_header=skip_lines, invalid_raise=False)
    
    # Get the time array from the harmonic data
    time_array = raw_data[:,0]
    # Shift time to start from t=0
    time_array = time_array - time_array[0]
    
    # Get the angular position phi from the harmonic data
    phi_array = degrees_to_rad(raw_data[:,3])
    # Shift the angular position so the final resting state is 0 rad (equilibrium)
    phi_array = phi_array - phi_array[-1]

    # Get the angular velocity omega
    omega_array = degrees_to_rad(raw_data[:,4])

    # Create a dictionary that will be used to export the data as json file.
    output_dictionary = {
        "title": title,
        "raw_data": {
            "time": time_array.tolist(),
            "phi": phi_array.tolist(),
            "omega": omega_array.tolist()
        },
        "fit_data": None,
        "optimized_parameters": None
    }

    if include_fit:
        # Obtain the peak values for the time and angular displacement
        time_peaks, phi_peaks = compute_peaks(time_array, phi_array)
        time_fit_array = np.linspace(time_peaks[0], time_peaks[-1], 1000)

        # Obtain the optimized fit parameters of the exponential fit function
        optimized_parameters = compute_peaks_fit_parameters(time_peaks, phi_peaks)

        # Compute the predicted angular positions for the given optimized parameters 
        phi_fit_array = exponential_fit_function(time_fit_array, optimized_parameters["amplitude_a"]["value"], 
                                                 optimized_parameters["damping_coefficient_b"]["value"], 
                                                 optimized_parameters["equilibrium_offset_c"]["value"])

        output_dictionary["fit_data"] = {
            "time_peaks": time_peaks,
            "phi_peaks": phi_peaks,
            "time_fit": time_fit_array.tolist(),
            "phi_fit": phi_fit_array.tolist()
        }
        output_dictionary["optimized_parameters"] = optimized_parameters

    return output_dictionary


def main():
    # Get the data dictionaries
    harmonic_data_dictionary = convert_raw_data_to_dictionary("Harmonic_10_2.txt", "Harmonic Motion", 5, True)
    damped_data_dictionary = convert_raw_data_to_dictionary("Damped_18_High.txt", "Damped Motion", 5)
    driven_data_dictionary = convert_raw_data_to_dictionary("Driven_T_85_Frames.txt", "Driven Motion", 5)
    
    # Write the data dictionaries as json objects into a file
    write_dictionary_to_json(harmonic_data_dictionary, "harmonic_oscillator_data")
    write_dictionary_to_json(damped_data_dictionary, "damped_oscillator_data")
    write_dictionary_to_json(driven_data_dictionary, "driven_oscillator_data")


if __name__ == '__main__':
    main()