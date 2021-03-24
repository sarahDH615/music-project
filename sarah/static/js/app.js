// funct to fill dropdowns
function dropdownFill(year_data, columns) {
    // subsetting the col names
    var cols_for_dd = columns.slice(6, columns.length+1);

    // appending to dropdowns
    // defining dropdown variables
    var year_dropdown = d3.select('#year-dropdown').select('.dropdown-menu');
    var x_dropdown = d3.select('#x-axis-dropdown').select('.dropdown-menu');
    var y_dropdown = d3.select('#y-axis-dropdown').select('.dropdown-menu');
    // appending years
    year_data.forEach(year => {
        year_dropdown.append('a').attr('class', 'dropdown-item')
            .attr('href', '#').text(year);
    });
    // appending same data to both x and y dropdowns
    cols_for_dd.forEach(col => {
        x_dropdown.append('a').attr('class', 'dropdown-item')
            .attr('href', '#').text(col);
        y_dropdown.append('a').attr('class', 'dropdown-item')
            .attr('href', '#').text(col);
    });

};


var path = 'static/data/data_cleaned.csv'

d3.csv(path).then(function(data) {
    // console.log(data.columns);
    // changing types
    data.forEach(function(d) {
        d.genre_num = +d.genre_num;
        d.bpm = d.bpm;
        d.nrgy = +d.nrgy;
        d.dnce = +d.dnce;
        d.dB = +d.dB;
        d.live = +d.live;
        d.val = +d.val;
        d.dur = +d.dur;
        d.acous = +d.acous;
        d.spch = +d.spch;
        d.pop = +d.pop;
    });
    // sending to dropdown fill funct
    var columns = data.columns;
    var year_data = [...new Set(data.map(d => d.year))];
    dropdownFill(year_data, columns);

    // filtering for year
    var data_year_filter = data.filter(function(d) {
        return d.year == 2010;
    });

    // deriving variables
    var genre_nums = data_year_filter.map(d => d.genre_num);
    var genre_name = data_year_filter.map(d => d.genre);
    var title = data_year_filter.map(d => d.title);
    var pop = data_year_filter.map(d => d.pop);
    var decibels = data_year_filter.map(d => d.dB);
    var decibels_manip = decibels.map(d => d + Math.random)
    var valence = data_year_filter.map(d => d.val);
    
    // creating the plot: colour is determined by genre, size is determined by popularity
    var traceA = {
        type: 'scatter',
        mode: 'markers',
        x: decibels,
        y: valence,
        text: data_year_filter.map(function(d) {
            return `Track Name: ${d.title}<br>Track Genre: ${d.genre}`
        }),
        marker: {
          color: genre_nums,
          colorscale: 'Rainbow',
          cmin: d3.min(genre_nums),
          cmax: d3.max(genre_nums),
          size: pop,
          sizeref: 2,
          sizemode: 'radius'
        }
    };
       
      var data = [traceA];
       
      var layout = {
        title: 'Decibels vs. Valance in 2010',
        xaxis: {
            title: 'decibels'
        },
        yaxis: {
            title: 'valence'
        }
      };
      
      // appending to html page
      Plotly.newPlot('bubble', data, layout);
});