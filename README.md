# Global Air Quality Insights: A Visualization Dashboard

![Dashboard Header](https://via.placeholder.com/1000x200.png?text=Add+a+Banner+Image+of+Your+Dashboard+Here)

An interactive data visualization dashboard built with **HTML, CSS, and D3.js** to explore global air pollution data. This project analyzes and presents Air Quality Index (AQI) data from the top 15 countries with the most monitoring entries, highlighting pollutant levels and their impact on public health.

**Live Demo:** [https://**YourGitHubUsername**.github.io/air-pollution-dashboard/](https://YourGitHubUsername.github.io/air-pollution-dashboard/)

*(Note: To enable the live demo, go to your repository's "Settings" tab, click on "Pages" in the left sidebar, and select the `main` branch as the source.)*

---

## 📖 Project Overview & Data Story

This project aims to provide a data-driven analysis of air quality by achieving three main objectives:
1.  **Identify** which countries and cities contribute the most to higher-risk AQI levels.
2.  **Examine** how different pollutants (CO, O₃, NO₂, and PM2.5) affect AQI categories.
3.  **Explore** comparative patterns and insights to guide potential policy or research actions.

For a detailed walkthrough of the data analysis, key insights, and project narrative, please view the full presentation:

➡️ **[View the Data Story Presentation (PDF)](./Air_Pollution_Data_Story.pdf)**

---

## ✨ Features

-   **Six Interactive D3.js Charts:** A comprehensive dashboard featuring:
    -   Bar Chart: Top 15 Countries by AQI Entry Count
    -   Pie Chart: Global Distribution of AQI Categories
    -   Heatmap: AQI Levels by Country and Category
    -   Stacked Bar Chart: Relative Pollutant Contributions
    -   Grouped Bar Chart: Average Pollutant Levels by AQI Category
    -   Horizontal Bar Chart: Top 15 Cities with Hazardous AQI
-   **Dynamic Filtering:** The entire dashboard can be filtered by country.
-   **Cross-Chart Interaction:** Clicking a slice on the pie chart dynamically filters all other visualizations.
-   **Data-Driven Tooltips:** Hovering over chart elements reveals detailed, context-specific information.
-   **Light & Dark Mode:** A modern UI with a user-toggleable theme for optimal viewing.
-   **Responsive Design:** A clean, fluid layout optimized for a wide range of screen sizes.

---

## 💻 Tech Stack

-   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
-   **Data Visualization:** [D3.js (v7)](https://d3js.org/)
-   **Icons:** [Ionicons](https://ionic.io/ionicons)

---

## 🚀 Setup and Local Installation

To run this project locally, a simple local server is required to handle the `d3.csv()` data request due to browser security policies (CORS).

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourGitHubUsername/air-pollution-dashboard.git
    cd air-pollution-dashboard
    ```

2.  **Start a local server.** If you have Python installed, you can use its built-in server.
    -   For Python 3:
        ```bash
        python -m http.server
        ```
    -   For Python 2:
        ```bash
        python -m SimpleHTTPServer
        ```
    *You can also use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.*

3.  **Open your browser** and navigate to `http://localhost:8000`.

---

## 📊 Data Source

The data used in this project is from the `global_air_pollution_data.csv` dataset, which contains 23,036 AQI readings from various cities and countries. The dataset includes overall AQI values, pollutant-specific AQIs (CO, NO₂, O₃, PM2.5), and AQI categories (Good to Hazardous).
