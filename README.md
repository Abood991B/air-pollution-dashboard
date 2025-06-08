# Global Air Quality Insights: A Visualization Dashboard



An interactive data visualization dashboard built with **HTML, CSS, and D3.js** to explore global air pollution data. This project analyzes and presents Air Quality Index (AQI) data from the top 15 countries with the most monitoring entries, highlighting key pollutants, regional differences, and public health implications.

**Live Demo:** [https://**Abood991B**.github.io/air-pollution-dashboard/](https://Abood991B.github.io/air-pollution-dashboard/)

*(Note: The live demo is hosted using GitHub Pages. To enable it for your own fork, go to your repository's "Settings" tab, click on "Pages" in the left sidebar, and select the `main` branch as the source.)*

---

## 📖 Project Overview & Data Story

Air pollution significantly impacts public health and the environment. This project provides a data-driven analysis to:
1.  **Identify** which countries and cities contribute the most to higher-risk AQI levels.
2.  **Examine** how different pollutants (CO, O₃, NO₂, and PM2.5) affect AQI categories.
3.  **Explore** comparative patterns to guide potential policy or research actions.

For a detailed walkthrough of the data analysis, key insights, and project narrative, please view the full presentation:

➡️ **[View the Data Story Presentation (PDF)](./Air_Pollution_Data_Story.pdf)**

---

## ✨ Features & Visualizations

The dashboard features six interconnected visualizations built from scratch with D3.js.

#### 📊 1. Top 15 Countries with Most AQI Entries
A bar chart that ranks countries by their total AQI data points. This view helps identify nations with extensive monitoring networks (like the US and India) versus those with emerging monitoring efforts.

#### 🥧 2. Global Distribution of Air Quality (Pie Chart)
This pie chart provides a snapshot of overall AQI categories. It is fully interactive—clicking a slice dynamically filters the entire dashboard, allowing users to pinpoint which countries contribute most to a specific category (e.g., "Hazardous").

#### 🔥 3. Heatmap of AQI Across Countries
This color-coded heatmap shows the *proportion* of AQI readings per category within each country. It vividly contrasts nations where "Good" or "Moderate" conditions dominate against those with more frequent "Unhealthy" levels, revealing regional hotspots of concern.

####  stacked_bar_chart: 4. Relative Contributions of Pollutants to AQI
This stacked bar chart breaks down each country's average AQI by its constituent pollutants. It clearly shows how PM2.5 is a primary driver of poor air quality in many regions, while NO₂ might be more prominent in areas with heavy traffic.

#### 📊 5. Average Pollutant Levels by AQI Category
This grouped bar chart shows how pollutant concentrations escalate as the AQI category worsens. It highlights the pronounced spike in PM2.5 during "Hazardous" events and clarifies how different combinations of pollutants lead to dangerous air quality.

####    6. Top 15 Cities Driving Hazardous AQI
This horizontal bar chart pinpoints the specific cities with the highest number of "Hazardous" readings, focusing attention on the most urgent areas for regulatory intervention and public health alerts.

---

## 💡 Key Insights & Future Directions

### Key Observations
*   **Widespread Moderate Levels:** Moderate AQI is the largest category, but this borderline state can quickly tip into Unhealthy territory.
*   **PM2.5 Primacy:** PM2.5 is the leading pollutant pushing AQI toward Hazardous levels in many countries.
*   **Regional Differences:** Developed nations often deal with NO₂ or O₃ from traffic, while emerging economies struggle more with particulate pollution from biomass and industry.

### Future Directions
1.  Expand monitoring sites in data-scarce locales to ensure balanced coverage.
2.  Investigate the root causes of Hazardous AQI spikes (e.g., seasonal burning, wildfires).
3.  Foster collaboration among governments and NGOs for broader climate and pollution control initiatives.

---

## 💻 Tech Stack

*   **Languages:** HTML5, CSS3, JavaScript (ES6+)
*   **Core Library:** [D3.js (v7)](https://d3js.org/) for data visualization.
*   **Assets:** [Ionicons](https://ionic.io/ionicons) for UI icons.

---

## 🚀 Setup and Local Installation

To run this project locally, a simple local server is required to handle the `d3.csv()` data request due to browser security policies (CORS).

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourGitHubUsername/air-pollution-dashboard.git
    cd air-pollution-dashboard
    ```

2.  **Start a local server.** If you have Python installed, you can use its built-in server.
    *   For Python 3:
        ```bash
        python -m http.server
        ```
    *   For Python 2:
        ```bash
        python -m SimpleHTTPServer
        ```
    *You can also use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.*

3.  **Open your browser** and navigate to `http://localhost:8000`.

---

## ⚖️ License

This project is protected under the **MIT License**. This allows for broad freedom to use and modify the code, but requires that the original copyright notice (crediting you as the author) be included in any copies.

See the [LICENSE](./LICENSE) file for more details.

---
**Author:** Abdulrahman Baidaq
