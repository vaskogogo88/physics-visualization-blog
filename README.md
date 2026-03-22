# Physics Visualization Blog
This is a blog that illustrates some experiments that I conducted during my Bachelor's degree in Physics. The goal is to transform raw experimental results (Brownian Motion, Muon Flux, Chaotic Dynamics) into interactive frontend components using Plotly.js, HTML/CSS, and Python-based JSON preprocessing.

## Live experiments
- **Chaotic Dynamics:** Interactive 3D state space and time-series analysis of Pohl's torsion pendulum. [View Live Demo](https://vaskogogo88.github.io/physics-visualization-blog/public/index.html)

## Tech Stack
- **Frontend:** Vanilla JS, Plotly.js, MathJax (LaTeX), and CSS Flexbox.
- **Data Pipeline:** Python (NumPy, SciPy, Matplotlib).

## Data Acquisition and Preprocessing
- **Acquisition:** Used a mobile phone recording of the Pohl's Torsion Pendulum at 30fps.
- **Tracking:** Utilized an Open-Source Physics project "Tracker: Video Analysis and Modeling Tool" to perform point-mass analysis on the pendulum's rotating disk.
- **Extraction:** Generated time-series data for angular displacement ($\phi$), angular velocity ($\omega$), and acceleration ($\alpha$).
- **Pipeline:** Developed a Python script to process the txt data files, normalize the units (e.g., converting degrees to radians), implement Non-Linear Least Squares (NLLS) using Python's `scipy.optimize` library, and export the final datasets as optimized JSON objects for the frontend.
