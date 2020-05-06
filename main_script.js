var database = new Dexie("Database");
const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));
const select1 = new mdc.select.MDCSelect(document.querySelector('.india .mdc-select'));
const buttonRipple = new mdc.ripple.MDCRipple(document.querySelector('.mdc-button'));
const menu = new mdc.menu.MDCMenu(document.querySelector('.mdc-menu'));
const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
let openMapMenu = () => {   menu.open = true;   }

const tab_timeout = 500;
let data_type = "india";

var info = [
    {
        about: {
            name: "About Screen",
            heading: "About",
            description: 'The website is a project designed, developed and created by Akshant Jain under MIT Lisence',
            API: ["", "", ""],
            URL: [
                {repo: ""},
                {lisence: ""},
                {website: "akshantjain.github.io/it202-big-project"},
            ]
        }
    },
    {
        search: {
            name: "Search Screen",
            heading: "COVID-19 TRACKER", 
            description: 'The website provides you with the data about coronavirus situations in countries of the world, and the states of India',
            options: [
                {
                    name: "India",
                    page_id: "india_screen",
                }, 
                {
                    name: "United States",
                    page_id: "us_screen",
                }, 
                {
                    name: "All Countries",
                    page_id: "world_screen"
                }
            ]
        }
    }
];

let india_fetched = false;
let world_fetched = false;

let india_data_added = false;

let online = true;

document.querySelector(".about_screen .description").innerHTML = info[0].about.description;
document.querySelector(".search_screen .description").innerHTML = info[1].search.description;

database.version(1).stores({
    india_states: "name, latitude, longitude, confirmed, active, deaths, recovered",
    usa_states: "name, latitude, longitude, confirmed, deaths",
    world: "name, latitude, longitude, confirmed, deaths, recovered"
});

function fetch_data() {
    console.log("Fetch Data");

    fetch("https://coronavirus-tracker-india-covid-19.p.rapidapi.com/api/getStatewise", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "coronavirus-tracker-india-covid-19.p.rapidapi.com",
		"x-rapidapi-key": "57952ad950mshd7f574b2b26873fp1e0df2jsnb64a359d724a"
	}
})
    .then(response => response.json())
    .then(data => {
        database.india_states.clear();
        database.open().then(function () {
            for (let state of data) {
                database.india_states.add({
                    name: state.name,
                    confirmed: parseInt(state.cases),
                    deaths: parseInt(state.deaths),
                    recovered: parseInt(state.recovered)
                });
            }
        })
        india_fetched = true;
    })
    .catch(err => {console.log(err);});

    
    fetch("https://corona-virus-world-and-india-data.p.rapidapi.com/api", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
            "x-rapidapi-key": "83f25966e1msh579d26b19484f37p1594dejsn5e57a53531ec"
        }
    })
    .then(response => response.json())
    .then(data => {
        database.world.clear();
        database.open().then(function () {
            for (let country of data.countries_stat) {
                database.world.add({
                    name: country.country_name,
                    confirmed: parseInt(country.cases),
                    deaths: parseInt(country.deaths),
                    recovered: parseInt(country.total_recovered)
                })
            }
        })
        world_fetched = true;
    })
    .catch(err => {
        console.log(err);
    });

};

let india_list;
let world_list;

if (navigator.onLine) {  
    online = true;
    console.log("You are online");
    database.open();
    fetch_data();
    
    database.india_states.toArray().then((arr) => {
        india_list = arr;
    });
    database.world.toArray().then((arr) => {
        world_list = arr;
    });
    
    if (navigator.geolocation) {
    //     console.log(navigator);
    //     console.log(navigator.geolocation);
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } 
    else {
        console.log("Geolocation is not supported by this browser.");
    }
}
else {
    online = false;
    database.open();
    console.log("You are offline");
    console.log(database);
    
    database.india_states.toArray().then((arr) => {
        india_list = arr;
    });
    database.world.toArray().then((arr) => {
        world_list = arr;
    });
    
    india_fetched = true;
    world_fetched = true;
    
    document.querySelector(".location p").innerHTML = "Location not available in offline mode!!"
}

console.log("Inside new");

var india_tab = document.querySelector(".india");
var world_tab = document.querySelector(".world");
var location_tab = document.querySelector(".location");

google.charts.load('current', {'packages': ['bar']});
google.charts.setOnLoadCallback(drawChart);

function india_press() {    
    if (india_list.length == 0) {
        window.location.reload();
        snackbar.labelText = "Reloading Page!!!";
        snackbar.open();
        return;
    }
    
    let india_state_list = document.querySelector(".india_list");

    if (india_fetched == false) {
        snackbar.labelText = "Data Still Fetching!!";
        snackbar.open();
        return;
    }
    else {
//         snackbar.labelText = "Data Ready!!";
//         snackbar.open();
        snackbar.close();
    }
    
    india_tab.style.display = "block";
    world_tab.style.display = "none";
    location_tab.style.display = "none";

    $(".india").animate({opacity: '1'}, tab_timeout);
    $(".world").animate({opacity: '0'}, tab_timeout);
    $(".location").animate({opacity: '0'}, tab_timeout);
    
    table_pressed("none");
    
    if (india_data_added)   return;
    
    for (let state of india_list)   {
        var list_item = document.createElement("li");
        list_item.classList.add("mdc-list-item");
        list_item.setAttribute("data-value", state.name);
        list_item.innerHTML = state.name;

        india_state_list.appendChild(list_item);
    }
    india_data_added = true;
}

function world_press() {
    if (world_list.length == 0) {
        window.location.reload();
        snackbar.labelText = "Reloading Page!!!";
        snackbar.open();
        return;
    }
    
    if (world_fetched == false) {
        snackbar.labelText = "Data Still Fetching!!";
        snackbar.open();
        return;
    }
    else {
//         snackbar.labelText = "Data Ready!!";
//         snackbar.open();
        snackbar.close();
    }
    
    india_tab.style.display = "none";
    world_tab.style.display = "block";
    location_tab.style.display = "none";

    $(".india").animate({opacity: '0'}, tab_timeout);
    $(".world").animate({opacity: '1'}, tab_timeout);
    $(".location").animate({opacity: '0'}, tab_timeout);

    table_pressed("none");
}

function location_press() {
    india_tab.style.display = "none";
    world_tab.style.display = "none";
    location_tab.style.display = "block";

    $(".india").animate({opacity: '0'}, tab_timeout);
    $(".world").animate({opacity: '0'}, tab_timeout);
    $(".location").animate({opacity: '1'}, tab_timeout);

    table_pressed("none");
}

var about_screen = document.querySelector(".about_screen");
var search_screen = document.querySelector(".search_screen");
var chart_screen = document.querySelector(".chart_screen");
var location_screen = document.querySelector(".location_screen");

function about_press() {
    about_screen.style.display = "block";
    search_screen.style.display = "none";
    chart_screen.style.display = "none";

    $(".about_screen").animate({opacity: '1'}, tab_timeout);
    $(".search_screen").animate({opacity: '0'}, tab_timeout);
    $(".chart_screen").animate({opacity: '0'}, tab_timeout);
    $(".location_screen").animate({opacity: '0'}, tab_timeout);

    table_pressed("none");
}

function search_press() {
    about_screen.style.display = "none";
    search_screen.style.display = "block";
    chart_screen.style.display = "none";
//     location_screen.style.display = "none";

    $(".about_screen").animate({opacity: '0'}, tab_timeout);
    $(".search_screen").animate({opacity: '1'}, tab_timeout);
    $(".chart_screen").animate({opacity: '0'}, tab_timeout);
    $(".location_screen").animate({opacity: '0'}, tab_timeout);
}

function table_pressed(params) {
    document.querySelector(".world .mdc-data-table").style.display = 'none';
    document.querySelector(".india .mdc-data-table").style.display = 'none';

    document.querySelector(".world .mdc-data-table").style.opacity = 0;
    document.querySelector(".india .mdc-data-table").style.opacity = 0;

    if (params == "World") {
        table_world();

        document.querySelector(".world .mdc-data-table").style.display = 'block';
        $(".world .mdc-data-table").animate({opacity: '1'}, tab_timeout);
    }
    else if (params == 'india') {
        if (select1.value == "") {
            snackbar.labelText = "Select a Valid Indian State";
            snackbar.open();
            return;
        }
        table_india();

        document.querySelector(".india .mdc-data-table").style.display = 'block';
        $(".india .mdc-data-table").animate({opacity: '1'}, tab_timeout);
    }
}

function table_world() {

}

function table_india() {
    database.india_states.where('name').equals(select1.value).toArray()
    .then((arr) => {
        document.getElementById("india_state_name").innerHTML = arr[0].name;
        document.getElementById("india_confirmed").innerHTML = arr[0].confirmed;
        document.getElementById("india_recovered").innerHTML = arr[0].recovered;
        document.getElementById("india_deaths").innerHTML = arr[0].deaths;
    })
}

function map_pressed(params) {
    
    if (india_fetched == false || world_fetched == false)    {
        snackbar.labelText = "Data Not Ready Yet";
        snackbar.open();
        return;
    }
    
    if (!online)    {
        snackbar.labelText = "Charts not available in Offline mode";
        snackbar.open();
        return;
    }
    
    about_screen.style.display = "none";
    search_screen.style.display = "none";
    chart_screen.style.display = "block";
//     location_screen.style.display = "none";

    $(".about_screen").animate({opacity: '0'}, tab_timeout);
    $(".search_screen").animate({opacity: '0'}, tab_timeout);
    $(".chart_screen").animate({opacity: '1'}, tab_timeout);
    $(".location_screen").animate({opacity: '0'}, tab_timeout);

    table_pressed("none");

    drawMap(params);
}

function drawMap(params) {

    switch (params) {
        case "India":
            data_type = "india";
            break;
        case "USA":
            data_type = "usa";
            break;
        case "World":
            data_type = "world";
            break;
    }
    drawChart();
}

function drawChart() {
    // var data = google.visualization.arrayToDataTable([
    //     ['Year', 'Sales', 'Expenses', 'Profit'],
    //     ['2014', 1000, 400, 200],
    //     ['2015', 1170, 460, 250],
    //     ['2016', 660, 1120, 300],
    //     ['2017', 1030, 540, 350]
    // ]);

    if(!online) return;
    
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Countries');
    
    if (typeof data_type == null)  {
        data_type = "india";
    }

    if (data_type == "india")    {
        
        if (india_fetched == false)
            return;
        
        data.addColumn('number', 'Confirmed');
        data.addColumn('number', 'Deaths');
        data.addColumn('number', 'Recovered');
        
        var wholeRowData = [];
        for (let row of india_list) {
            let rowData = [];
            rowData.push(row.name);
            rowData.push(row.confirmed);
            rowData.push(row.deaths);
            rowData.push(row.recovered);
            wholeRowData.push(rowData);
        }
        data.addRows(wholeRowData);
    }
  
    else if (data_type == "world") {
        data.addColumn('number', 'Confirmed');
        data.addColumn('number', 'Deaths');
        data.addColumn('number', 'Recovered');

        var wholeRowData = [];
        for (let row of world_list) {
            let rowData = [];
            rowData.push(row.name);
            rowData.push(row.confirmed);
            rowData.push(row.deaths);
            rowData.push(row.recovered);
            wholeRowData.push(rowData);
        }
        data.addRows(wholeRowData);
    }

    var options = {
        chart: {
            title: 'Coronavirus Statistics',
            subtitle: 'Confirmed, Recovered and Death cases',
        },
        height: 3500,
        bars: 'horizontal' // Required for Material Bar Charts.
    };

    var chart = new google.charts.Bar(document.getElementById('barchart_material'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}

let address;
let country;

function fetch_location(position) {
    const url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyCsb1qMj2FfG-GKztLHvABzjTqWhKm-N3Y";
//     console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        country = data.results[7].formatted_address;
        address = data.results[0].formatted_address;
        let additional;
        if (country == "India") {
            additional = "Check out the Indian States Stats for current COVID-19 Cases in your state or check the world stats for Whole Country stat."
        }else {
            additional = "Check out your country in the world tab for full covid-19 cases in your country."
        }
        document.querySelector(".location p").innerHTML = "<u><b>Location</u>: Retrieved</b> <br> <br><u><b>Address</b></u>: " + address + "<br><u><b>Country</b></u>: " + country + "<br><br>" + additional;
        
    })
    .catch(err => {console.log(err);});
}


function showPosition(position) {
   
    fetch_location(position);
    
    console.log("Latitude: " + position.coords.latitude +
        "Longitude: " + position.coords.longitude);
//     document.querySelector(".location p").innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}
