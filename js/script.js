    /**
     * Interactive Data Visualization for Global Air Pollution
     *
     * This script uses the D3.js library to render a series of charts
     * analyzing a global AQI dataset.
     *
     * @author      Abdulrahman Baidaq
     * @version     1.0
     * @date        08/06/2025
     * @github      https://github.com/Abood991B/air-pollution-dashboard
     */


    /******************************************************
     *         GLOBAL VARIABLES & TOOLTIP, etc.
     ******************************************************/

    // 1) Helper function to shorten labels
    function shortLabel(str, maxLength = 12) {
      if (!str) return "";
      if (str.length <= maxLength) return str;
      return str.slice(0, maxLength) + "…";
    }

    let allData = [];          // Full CSV data
    let selectedCategory = "all";  // For "click to filter" from Pie
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Pollutant color config
    const pollutantLabels = {
      co_aqi: "Carbon Monoxide (CO)",
      ozone_aqi: "Ozone (O₃)",
      no2_aqi: "Nitrogen Dioxide (NO₂)",
      pm25_aqi: "Particulate Matter (PM2.5)"
    };
    const pollutantColors = {
      co_aqi: "#4daf4a",
      ozone_aqi: "#377eb8",
      no2_aqi: "#ff7f00",
      pm25_aqi: "#984ea3"
    };

    // AQI category naming
    const aqiFriendlyNames = {
      good: "Good",
      moderate: "Moderate",
      unhealthy_sensitive: "Unhealthy for Sensitive Groups",
      unhealthy: "Unhealthy",
      very_unhealthy: "Very Unhealthy",
      hazardous: "Hazardous"
    };

    /******************************************************
     *  DARK MODE TOGGLE
     ******************************************************/
    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("change", function() {
      document.body.classList.toggle("dark-mode", this.checked);
    });

    /******************************************************
     *  LOAD CSV & POPULATE COUNTRY DROPDOWN
     ******************************************************/
    d3.csv("data/global_air_pollution_data.csv").then(data => {
      allData = data;

      // Populate countries
      populateCountrySelect(data);

      // Initial dashboard
      updateDashboard("all");
    });

    d3.select("#countrySelect").on("change", function() {
      updateDashboard(this.value);
    });

    function populateCountrySelect(data) {
      const uniqueCountries = Array.from(new Set(data.map(d => d.country))).sort();
      const select = d3.select("#countrySelect");
      uniqueCountries.forEach(country => {
        select.append("option")
          .attr("value", country)
          .text(country);
      });
    }

    /******************************************************
     *  UPDATE DASHBOARD (COUNTRY & CATEGORY FILTERS)
     ******************************************************/
    function updateDashboard(selectedCountry) {
      // Filter by country if not "all"
      let filteredData = (selectedCountry === "all")
        ? allData
        : allData.filter(d => d.country === selectedCountry);

      // If user clicked a pie slice, also filter by category
      if (selectedCategory !== "all") {
        const catLower = selectedCategory.toLowerCase();
        filteredData = filteredData.filter(d => 
          d.aqi_category && d.aqi_category.toLowerCase() === catLower
        );
      }

      // Clear old charts
      clearChart("#barChart");
      clearChart("#pieChart");
      clearChart("#heatmap");
      clearChart("#stackedBarChart");
      clearChart("#groupedBarChart");
      clearChart("#horizontalBarChart");

      // Re-draw charts
      drawBarChart(filteredData);
      drawPieChart(filteredData);
      drawHeatmap(filteredData);
      drawStackedBarChart(filteredData);
      drawGroupedBarChart(filteredData);
      drawHorizontalBarChart(filteredData);
    }

    function clearChart(selector) {
      d3.select(selector).selectAll("*").remove();
    }

    /******************************************************
     * CHART 1: BAR (Top 15 Countries by Count)
     ******************************************************/
    function drawBarChart(data) {
      const container = d3.select("#barChart");
      const width = parseInt(container.style("width"));
      const height = width * 0.60;

      container.attr("width", width).attr("height", height);

      const margin = { top: 10, right: 20, bottom: 60, left: 50 };
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      const svg = container.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Roll up -> get top 15
      const countryCounts = Array.from(
        d3.rollup(data, v => v.length, d => d.country),
        ([key, value]) => ({ country: key, count: value })
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

      const xScale = d3.scaleBand()
        .domain(countryCounts.map(d => d.country))
        .range([0, chartWidth])
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(countryCounts, d => d.count)])
        .range([chartHeight, 0]);

      // X axis with short labels
      svg.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(
          d3.axisBottom(xScale)
            .tickSize(0)
            .tickFormat(d => shortLabel(d, 12)) // shorten
        )
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        // Show full name on hover
        .append("title")
        .text(d => d);

      // Y axis
      svg.append("g").call(d3.axisLeft(yScale));

      // Axis labels
      svg.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Countries");

      svg.append("text")
        .attr("x", -chartHeight / 2)
        .attr("y", -margin.left + 10)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Number of Entries");

      // Bars
      svg.selectAll("rect")
        .data(countryCounts)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.country))
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d.count))
        .attr("fill", "#379683")
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`
            Country: ${d.country}<br/>
            Count: ${d.count}
          `)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    }

    /******************************************************
     * CHART 2: PIE (AQI Categories) w/ Click-to-Filter
     ******************************************************/
    function drawPieChart(data) {
      const container = d3.select("#pieChart");
      const containerWidth = parseInt(container.style("width"));
      const containerHeight = containerWidth * 0.63;
      const radius = Math.min(containerWidth, containerHeight) / 2 - 22;

      container.attr("width", containerWidth).attr("height", containerHeight);

      const svg = container.append("g")
        .attr("transform", `translate(${containerWidth / 3}, ${containerHeight / 2})`);

      // Using d3.schemeSet2
      const color = d3.scaleOrdinal(d3.schemeSet2);

      const predefinedOrder = [
        "Good",
        "Moderate",
        "Unhealthy For Sensitive Groups",
        "Unhealthy",
        "Very Unhealthy",
        "Hazardous"
      ];

      const capitalizeWords = str => 
        str.replace(/\b\w/g, char => char.toUpperCase());

      const categoryCounts = Array.from(
        d3.rollup(data, v => v.length, d => d.aqi_category),
        ([key, value]) => ({
          category: capitalizeWords(key),
          count: value
        })
      )
      .sort(
        (a, b) => predefinedOrder.indexOf(a.category) - predefinedOrder.indexOf(b.category)
      );

      const pie = d3.pie().value(d => d.count);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);

      svg.selectAll("path")
        .data(pie(categoryCounts))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.category))
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`
            Category: ${d.data.category}<br/>
            Count: ${d.data.count}
          `)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        })
        .on("click", (event, d) => {
          // Toggle logic
          if (selectedCategory === d.data.category) {
            selectedCategory = "all";
          } else {
            selectedCategory = d.data.category; 
          }
          const currentCountry = d3.select("#countrySelect").node().value;
          updateDashboard(currentCountry);
        });

      // Legend
      const legend = container.append("g")
        .attr("transform", `translate(${containerWidth * 0.58}, ${1})`);

      legend.selectAll("rect")
        .data(categoryCounts)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 15)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", d => color(d.category));

      legend.selectAll("text")
        .data(categoryCounts)
        .enter()
        .append("text")
        .attr("x", 15)
        .attr("y", (d, i) => i * 15 + 10)
        .style("font-size", "10.5px")
        .text(d => d.category);
    }

    /******************************************************
     * CHART 3: HEATMAP (with help icon & pop-up)
     ******************************************************/
    function drawHeatmap(data) {
      const container = d3.select("#heatmap");
      const width = parseInt(container.style("width"));
      const height = width * 0.65;

      container.attr("width", width).attr("height", height);

      const margin = { top: 50, right: 75, bottom: 90, left: 100 };
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      const svg = container.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Group by country
      const countries = Array.from(d3.group(data, d => d.country), ([key, value]) => ({
        country: key,
        total: value.length,
        good: value.filter(d => d.aqi_category === "good").length / value.length,
        moderate: value.filter(d => d.aqi_category === "moderate").length / value.length,
        unhealthy_sensitive: value.filter(d => d.aqi_category === "unhealthy for sensitive groups").length / value.length,
        unhealthy: value.filter(d => d.aqi_category === "unhealthy").length / value.length,
        very_unhealthy: value.filter(d => d.aqi_category === "very unhealthy").length / value.length,
        hazardous: value.filter(d => d.aqi_category === "hazardous").length / value.length
      }));

      // Top 15
      const topCountries = countries
        .sort((a, b) => b.total - a.total)
        .slice(0, 15);

      const categories = [
        "good",
        "moderate",
        "unhealthy_sensitive",
        "unhealthy",
        "very_unhealthy",
        "hazardous"
      ];

      const xScale = d3.scaleBand()
        .domain(categories.map(cat => aqiFriendlyNames[cat]))
        .range([0, chartWidth])
        .padding(0.1);

      const yScale = d3.scaleBand()
        .domain(topCountries.map(d => d.country))
        .range([0, chartHeight])
        .padding(0.1);

      // Softer color scale
      const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, 1]);

      // Draw cells
      svg.selectAll("rect")
        .data(
          topCountries.flatMap(country =>
            categories.map(category => ({
              country: country.country,
              category: aqiFriendlyNames[category],
              value: country[category]
            }))
          )
        )
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.category))
        .attr("y", d => yScale(d.country))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(d.value))
        .style("stroke", "#fff")
        .style("stroke-width", 1)
        .on("mouseover", (event, d) => {
          d3.select(event.target)
            .style("stroke", "#000")
            .style("stroke-width", 2);

          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`
            Country: ${d.country}<br/>
            Category: ${d.category}<br/>
            Proportion: ${(d.value * 100).toFixed(2)}%
          `)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", (event) => {
          d3.select(event.target)
            .style("stroke", "#fff")
            .style("stroke-width", 1);

          tooltip.transition().duration(500).style("opacity", 0);
        });

      // Text color logic
      svg.selectAll("text.cell-label")
        .data(
          topCountries.flatMap(country =>
            categories.map(category => ({
              country: country.country,
              category: aqiFriendlyNames[category],
              value: country[category]
            }))
          )
        )
        .enter()
        .append("text")
        .attr("class", "cell-label")
        .attr("x", d => xScale(d.category) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.country) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text(d => `${(d.value * 100).toFixed(1)}%`)
        .attr("fill", d => {
          // Check brightness
          const c = d3.color(colorScale(d.value));
          const brightness = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
          return brightness < 140 ? "white" : "#333";
        });

      // X-axis
      svg.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end")
        .style("font-size", "10px");

      // Y-axis with short labels
      svg.append("g")
        .call(
          d3.axisLeft(yScale)
            .tickFormat(d => shortLabel(d, 12)) // shorten country
        )
        .selectAll("text")
        .style("font-size", "10px")
        .append("title") // show full name on hover
        .text(d => d);

      // Axis labels
      svg.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("AQI Categories");

      svg.append("text")
        .attr("x", -chartHeight / 2)
        .attr("y", -margin.left + 10)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Countries");

      // Legend
      const legend = svg.append("g")
        .attr("transform", `translate(${chartWidth + 20}, 0)`);

      const legendScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, chartHeight / 2]);

      const legendAxis = d3.axisRight(legendScale)
        .ticks(5)
        .tickFormat(d => `${(d * 100).toFixed(0)}%`);

      const legendData = Array.from({ length: 100 }, (_, i) => i / 100);

      legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => legendScale(d))
        .attr("width", 10)
        .attr("height", 2)
        .attr("fill", d => colorScale(d));

      legend.append("g")
        .attr("transform", "translate(10, 0)")
        .call(legendAxis);

      legend.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("text-anchor", "start")
        .attr("font-size", "11px")
        .text("Proportion");

      /*******************************************************
       * HELP ICON & POPUP
       *******************************************************/
      legend.append("svg:foreignObject")
        .attr("x", 0)
        .attr("y", -40)
        .attr("width", 20)
        .attr("height", 20)
        .append("xhtml:div")
        .html(`
          <ion-icon 
            id="heatmapHelpIcon" 
            name="help-circle-outline" 
            style="cursor:pointer; font-size:20px; color:#555;"
          ></ion-icon>
        `);

      const helpPopup = d3.select("body")
        .append("div")
        .attr("id", "heatmapHelpPopup")
        .style("position", "absolute")
        .style("top", "100px")
        .style("left", "100px")
        .style("width", "220px")
        .style("padding", "10px 15px")
        .style("background", "#fff")
        .style("color", "#333")
        .style("box-shadow", "0 3px 6px rgba(0,0,0,0.2)")
        .style("border-radius", "6px")
        .style("font-size", "0.9rem")
        .style("line-height", "1.4")
        .style("display", "none")
        .html(`
          <strong>How to Read This Heatmap</strong><br/>
          A darker cell indicates a <em>higher proportion</em> of that AQI category.
          <br/><br/>
          If it's <strong>Good</strong> or <strong>Moderate</strong>,
          higher is better; if it's <strong>Hazardous</strong>, higher
          is worse.
          <br/><br/>
          <em>Click anywhere else to close.</em>
        `);

      d3.select("#heatmapHelpIcon").on("click", (event) => {
        helpPopup.style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px")
          .style("display", "block");
      });

      d3.select("body").on("click", (ev) => {
        const isIcon = ev.target && ev.target.id === "heatmapHelpIcon";
        if (!isIcon) {
          helpPopup.style("display", "none");
        }
      });
    }

    /******************************************************
     * CHART 4: STACKED BAR (Pollutant Contributions)
     ******************************************************/
    function drawStackedBarChart(data) {
      const container = d3.select("#stackedBarChart");
      const containerWidth = parseInt(container.style("width"));
      const containerHeight = containerWidth * 0.65;
      const margin = { top: 50, right: 45, bottom: 60, left: 80 };

      container.attr("width", containerWidth).attr("height", containerHeight);

      const chartWidth = containerWidth - margin.left - margin.right;
      const chartHeight = containerHeight - margin.top - margin.bottom;

      const svg = container.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const pollutants = ["co_aqi", "ozone_aqi", "no2_aqi", "pm25_aqi"];

      // Top 15 by count
      const topCountriesArr = Array.from(
        d3.rollup(data, v => v.length, d => d.country),
        ([key, value]) => ({ country: key, count: value })
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)
      .map(d => d.country);

      // Averages
      const countryPollutantData = Array.from(
        d3.group(data, d => d.country),
        ([key, values]) => ({
          country: key,
          co_aqi: d3.mean(values, d => +d.co_aqi || 0),
          ozone_aqi: d3.mean(values, d => +d.ozone_aqi || 0),
          no2_aqi: d3.mean(values, d => +d.no2_aqi || 0),
          pm25_aqi: d3.mean(values, d => +d.pm25_aqi || 0)
        })
      ).filter(d => topCountriesArr.includes(d.country));

      const xScale = d3.scaleBand()
        .domain(topCountriesArr)
        .range([0, chartWidth])
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(countryPollutantData, d => d.co_aqi + d.ozone_aqi + d.no2_aqi + d.pm25_aqi)])
        .range([chartHeight, 0]);

      // X axis with short labels
      svg.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(
          d3.axisBottom(xScale)
            .tickSize(0)
            .tickFormat(d => shortLabel(d, 12))
        )
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .append("title")
        .text(d => d);

      svg.append("g").call(d3.axisLeft(yScale));

      // Labels
      svg.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + margin.bottom - 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Countries");

      svg.append("text")
        .attr("x", -chartHeight / 2)
        .attr("y", -margin.left + 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Average AQI Contribution");

      // Bars
      svg.selectAll("g.bar-group")
        .data(countryPollutantData)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", d => `translate(${xScale(d.country)}, 0)`)
        .selectAll("rect")
        .data(d => {
          const total = d.co_aqi + d.ozone_aqi + d.no2_aqi + d.pm25_aqi;
          return pollutants.map(pollutant => ({
            key: pollutant,
            value: d[pollutant],
            percentage: (d[pollutant] / total) * 100
          }));
        })
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i, nodes) => {
          const previousValues = Array.from(nodes).slice(0, i).map(node => d3.select(node).datum().value);
          return yScale(d3.sum(previousValues) + d.value);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d.value))
        .attr("fill", d => pollutantColors[d.key])
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`
            ${pollutantLabels[d.key]}<br/>
            Value: ${d.value.toFixed(2)}<br/>
            Percentage: ${d.percentage.toFixed(2)}%
          `)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      // Legend
      const legend = svg.append("g")
        .attr("transform", `translate(${chartWidth - 100}, -35)`);

      pollutants.forEach((pollutant, i) => {
        legend.append("rect")
          .attr("x", 0)
          .attr("y", i * 15)
          .attr("width", 13)
          .attr("height", 13)
          .style("fill", pollutantColors[pollutant]);

        legend.append("text")
          .attr("x", 15)
          .attr("y", i * 15 + 10)
          .style("font-size", "10.5px")
          .text(pollutantLabels[pollutant]);
      });
    }

    /******************************************************
     * CHART 5: GROUPED BAR (Pollutants vs AQI Category)
     ******************************************************/
    function drawGroupedBarChart(data) {
      const container = d3.select("#groupedBarChart");
      const containerWidth = parseInt(container.style("width"));
      const containerHeight = containerWidth * 0.65;
      const margin = { top: 60, right: 25, bottom: 85, left: 50 };

      container.attr("width", containerWidth).attr("height", containerHeight);

      const chartWidth = containerWidth - margin.left - margin.right;
      const chartHeight = containerHeight - margin.top - margin.bottom;

      const svg = container.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const pollutants = ["co_aqi", "ozone_aqi", "no2_aqi", "pm25_aqi"];

      // Unique categories
      const aqiCategories = Array.from(new Set(data.map(d => d.aqi_category))).sort();

      const groupedData = aqiCategories.map(category => {
        const filtered = data.filter(d => d.aqi_category === category);
        return {
          category: category,
          co_aqi: d3.mean(filtered, d => +d.co_aqi || 0),
          ozone_aqi: d3.mean(filtered, d => +d.ozone_aqi || 0),
          no2_aqi: d3.mean(filtered, d => +d.no2_aqi || 0),
          pm25_aqi: d3.mean(filtered, d => +d.pm25_aqi || 0)
        };
      });

      const x0 = d3.scaleBand()
        .domain(aqiCategories)
        .range([0, chartWidth])
        .padding(0.2);

      const x1 = d3.scaleBand()
        .domain(pollutants)
        .range([0, x0.bandwidth()])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([
          0,
          d3.max(groupedData, d => d3.max(pollutants, key => d[key]))
        ])
        .range([chartHeight, 0]);

      const colorScale = d3.scaleOrdinal()
        .domain(pollutants)
        .range([
          pollutantColors.co_aqi,
          pollutantColors.ozone_aqi,
          pollutantColors.no2_aqi,
          pollutantColors.pm25_aqi
        ]);

      // X axis (AQI categories are short, no need for shortLabel)
      svg.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .attr("transform", "rotate(-25)")
        .style("text-anchor", "end");

      // Y axis
      svg.append("g").call(d3.axisLeft(yScale));

      // Labels
      svg.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + margin.bottom - (3))
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("AQI Categories");

      svg.append("text")
        .attr("x", -chartHeight / 2)
        .attr("y", -margin.left + (10))
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Average Pollutant Levels");

      // Bars
      svg.append("g")
        .selectAll("g.bar-group")
        .data(groupedData)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", d => `translate(${x0(d.category)}, 0)`)
        .selectAll("rect")
        .data(d => pollutants.map(pollutant => ({
          key: pollutant,
          value: d[pollutant],
          category: d.category
        })))
        .enter()
        .append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => yScale(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => chartHeight - yScale(d.value))
        .attr("fill", d => colorScale(d.key))
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`
            ${pollutantLabels[d.key]}<br/>
            AQI Category: ${d.category}<br/>
            Value: ${d.value.toFixed(2)}
          `)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      // Legend
      const legend = svg.append("g")
        .attr("transform", `translate(${chartWidth - 120}, -60)`);

      pollutants.forEach((pollutant, i) => {
        legend.append("rect")
          .attr("x", 0)
          .attr("y", i * 15)
          .attr("width", 13)
          .attr("height", 13)
          .style("fill", colorScale(pollutant));

        legend.append("text")
          .attr("x", 15)
          .attr("y", i * 15 + 10)
          .style("font-size", "10px")
          .text(pollutantLabels[pollutant]);
      });
    }

    /******************************************************
     * CHART 6: HORIZONTAL BAR (Top 15 Hazardous Cities)
     ******************************************************/
    function drawHorizontalBarChart(data) {
      const container = d3.select("#horizontalBarChart");
      const containerWidth = parseInt(container.style("width"));
      const containerHeight = containerWidth * 0.65;
      const margin = { top: 20, right: -10, bottom: 60, left: 180 };

      container.attr("width", containerWidth).attr("height", containerHeight);

      const chartWidth = containerWidth - margin.left - margin.right;
      const chartHeight = containerHeight - margin.top - margin.bottom;

      const svg = container.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const pollutants = ["co_aqi", "ozone_aqi", "no2_aqi", "pm25_aqi"];

      // Filter only Hazardous
      const hazardousRows = data.filter(d => 
        d.aqi_category && d.aqi_category.toLowerCase() === "hazardous"
      );

      // Group city+country
      const cityMap = {};
      hazardousRows.forEach(row => {
        const cityKey = `${row.city} (${row.country})`;
        if (!cityMap[cityKey]) {
          cityMap[cityKey] = { city: cityKey };
          pollutants.forEach(p => cityMap[cityKey][p] = 0);
        }
        pollutants.forEach(p => {
          cityMap[cityKey][p] += +row[p] || 0;
        });
      });

      let cityData = Object.values(cityMap);
      cityData.forEach(d => {
        d.total = pollutants.reduce((sum, p) => sum + d[p], 0);
      });
      cityData.sort((a, b) => b.total - a.total);
      cityData = cityData.slice(0, 15);

      if (cityData.length === 0) {
        svg.append("text")
          .attr("x", chartWidth / 2)
          .attr("y", chartHeight / 2)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .text("No Hazardous AQI Data Available for This Filter");
        return;
      }

      const xScale = d3.scaleLinear()
        .domain([0, d3.max(cityData, d => d.total)])
        .range([0, chartWidth]);

      const yScale = d3.scaleBand()
        .domain(cityData.map(d => d.city))
        .range([0, chartHeight])
        .padding(0.3);

      const colorScale = d3.scaleOrdinal()
        .domain(pollutants)
        .range([
          pollutantColors.co_aqi,
          pollutantColors.ozone_aqi,
          pollutantColors.no2_aqi,
          pollutantColors.pm25_aqi
        ]);

      // Stacked bars
      svg.selectAll("g.bar-group")
        .data(cityData)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", d => `translate(0, ${yScale(d.city)})`)
        .selectAll("rect")
        .data(d => {
          let runningTotal = 0;
          return pollutants.map(p => {
            const start = runningTotal;
            const val = d[p];
            runningTotal += val;
            return {
              pollutant: p,
              val: val,
              start: start,
              end: runningTotal,
              total: d.total
            };
          });
        })
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.start))
        .attr("y", 0)
        .attr("width", d => xScale(d.end) - xScale(d.start))
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(d.pollutant))
        .on("mouseover", (event, d) => {
          const percent = ((d.val / d.total) * 100).toFixed(2);
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`
            <strong>${pollutantLabels[d.pollutant]}:</strong> ${d.val.toFixed(2)} (${percent}%)<br/>
            <strong>Total Hazardous AQI:</strong> ${d.total.toFixed(2)}
          `)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      // Y-axis with short labels
      svg.append("g")
        .call(
          d3.axisLeft(yScale)
            .tickFormat(d => shortLabel(d, 16)) // city + country might be longer
        )
        .selectAll("text")
        .style("font-size", "12px")
        .append("title")
        .text(d => d); // full city name

      // X-axis
      svg.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => d.toFixed(0)));

      // Labels
      svg.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + margin.bottom - (20))
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Total Contribution to Hazardous AQI");

      svg.append("text")
        .attr("x", -chartHeight / 2)
        .attr("y", -margin.left + 10)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Cities");
    }
