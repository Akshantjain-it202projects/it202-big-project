var database = new Dexie("Database");

let india_fetched = false;
let usa_fetched = false;

database.version(1).stores({
    india_states: "name, latitude, longitude, confirmed, active, deaths, recovered",
    usa_states: "name, latitude, longitude, confirmed, deaths",
    world: "name, latitude, longitude, confirmed, deaths, recovered"
})

if (navigator.onLine) {  
    console.log("You are online");
    database.open();
    // fetch_data();
}
else {
    database.open();
    console.log("You are offline");
    console.log(database);
}

function fetch_data() {
    console.log("Fetch Data");

    fetch("https://covid19-data.p.rapidapi.com/india", 
    {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid19-data.p.rapidapi.com",
            "x-rapidapi-key": "57952ad950mshd7f574b2b26873fp1e0df2jsnb64a359d724a"
        }
    })
    .then(response => response.json())
    .then(data => {
        database.india_states.clear();
        database.open().then(function () {
            for (let state of data) {
                database.india_states.add({
                    name: state.state,
                    // latitude: state.latitude,
                    // longitude: state.longitude,
                    confirmed: state.confirmed,
                    active: state.active, 
                    deaths: state.deaths,
                    recovered: state.recovered
                });
            }
        })
    india_fetched = true;
    })
    .catch(err => {console.log(err);});

    fetch("https://covid19-data.p.rapidapi.com/us", 
    {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid19-data.p.rapidapi.com",
            "x-rapidapi-key": "57952ad950mshd7f574b2b26873fp1e0df2jsnb64a359d724a"
        }
    })
    .then(response => response.json())
    .then(json => json.list)
    .then (data => {
        // console.log(data);
        database.usa_states.clear();
        for (let state of data) {
            database.usa_states.add({
                name: state.state,
                // latitude: state.latitude,
                // longitude: state.longitude,
                confirmed: state.confirmed,
                deaths: state.deaths,
            })
        }
    })
    .catch(err => {
        console.log(err);
    });

    fetch("https://covid19-data.p.rapidapi.com/all", 
    {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid19-data.p.rapidapi.com",
            "x-rapidapi-key": "83f25966e1msh579d26b19484f37p1594dejsn5e57a53531ec"
        }
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        database.world.clear();
        for (let country of data)   {
            database.world.add({
                name: country.country,
                // latitude: country.latitude, 
                // longitude: country.longitude, 
                confirmed: country.confirmed, 
                deaths: country.deaths, 
                recovered: country.recovered
            })
        }
    })
    .catch(err => {
        console.log(err);
    });  
};

google.charts.load('current', {'packages': ['bar']});
google.charts.setOnLoadCallback(drawChart);

const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));

const select1 = new mdc.select.MDCSelect(document.querySelector('.india .mdc-select'));
const select2 = new mdc.select.MDCSelect(document.querySelector('.usa .mdc-select'));

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
            description: 'The website provides you with the data about coronavirus situations in countries of the world, and the states of India and United States of America',
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

document.querySelector(".about_screen .description").innerHTML = info[0].about.description;
document.querySelector(".search_screen .description").innerHTML = info[1].search.description;

let india_list;
database.india_states.toArray().then((arr) => {
    india_list = arr;
});

let usa_list;
database.usa_states.toArray().then((arr) => {
    usa_list = arr;
});

let world_list;
database.world.toArray().then((arr) => {
    world_list = arr;
});

var india_tab = document.querySelector(".india");
var us_tab = document.querySelector(".usa");
var world_tab = document.querySelector(".world");
var location_tab = document.querySelector(".location");

function india_press() {
    // console.log("india_pressed");
    let india_state_list = document.querySelector(".india_list");

    india_tab.style.display = "block";
    us_tab.style.display = "none";
    world_tab.style.display = "none";
    location_tab.style.display = "none";

    $(".india").animate({opacity: '1'}, tab_timeout);
    $(".usa").animate({opacity: '0'}, tab_timeout);
    $(".world").animate({opacity: '0'}, tab_timeout);
    $(".location").animate({opacity: '0'}, tab_timeout);
    

    for (let state of india_list)   {
        var list_item = document.createElement("li");
        list_item.classList.add("mdc-list-item");
        list_item.setAttribute("data-value", state.name);
        list_item.innerHTML = state.name;

        india_state_list.appendChild(list_item);
    }

    table_pressed("none");
}

database.world.toArray().then((arr) => {
    world_list = arr;
});

function us_press() {
    let usa_state_list = document.querySelector(".usa_list");

    india_tab.style.display = "none";
    us_tab.style.display = "block";
    world_tab.style.display = "none";
    location_tab.style.display = "none";

    $(".india").animate({opacity: '0'}, tab_timeout);
    $(".usa").animate({opacity: '1'}, tab_timeout);
    $(".world").animate({opacity: '0'}, tab_timeout);
    $(".location").animate({opacity: '0'}, tab_timeout);

    for (let state of usa_list) {
        var list_item = document.createElement("li");
        list_item.classList.add("mdc-list-item");
        list_item.setAttribute("data-value", state.name);
        list_item.innerHTML = state.name;

        usa_state_list.appendChild(list_item);
    }

    table_pressed("none");
}

function world_press() {
    india_tab.style.display = "none";
    us_tab.style.display = "none";
    world_tab.style.display = "block";
    location_tab.style.display = "none";

    $(".india").animate({opacity: '0'}, tab_timeout);
    $(".usa").animate({opacity: '0'}, tab_timeout);
    $(".world").animate({opacity: '1'}, tab_timeout);
    $(".location").animate({opacity: '0'}, tab_timeout);

    table_pressed("none");
}

function location_press() {
    india_tab.style.display = "none";
    us_tab.style.display = "none";
    world_tab.style.display = "none";
    location_tab.style.display = "block";

    $(".india").animate({opacity: '0'}, tab_timeout);
    $(".usa").animate({opacity: '0'}, tab_timeout);
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
    location_screen.style.display = "none";

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
    location_screen.style.display = "none";

    $(".about_screen").animate({opacity: '0'}, tab_timeout);
    $(".search_screen").animate({opacity: '1'}, tab_timeout);
    $(".chart_screen").animate({opacity: '0'}, tab_timeout);
    $(".location_screen").animate({opacity: '0'}, tab_timeout);
}

function table_pressed(params) {
    document.querySelector(".world .mdc-data-table").style.display = 'none';
    document.querySelector(".usa .mdc-data-table").style.display = 'none';
    document.querySelector(".india .mdc-data-table").style.display = 'none';

    document.querySelector(".world .mdc-data-table").style.opacity = 0;
    document.querySelector(".usa .mdc-data-table").style.opacity = 0;
    document.querySelector(".india .mdc-data-table").style.opacity = 0;

    if (params == "World") {
        table_world();

        document.querySelector(".world .mdc-data-table").style.display = 'block';
        $(".world .mdc-data-table").animate({opacity: '1'}, tab_timeout);
    }
    else if (params == 'USA')   {
        if (select2.value == "")    {
            snackbar.labelText = "Select a Valid USA State";
            snackbar.open();
            return;
        }
        table_usa();
        
        document.querySelector(".usa .mdc-data-table").style.display = 'block';
        $(".usa .mdc-data-table").animate({opacity: '1'}, tab_timeout);
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

function table_usa() {
    database.usa_states.where('name').equals(select2.value).toArray()
    .then((arr) => {
        // console.log(arr[0]);
        document.getElementById("usa_state_name").innerHTML = arr[0].name;
        document.getElementById("usa_confirmed").innerHTML = arr[0].confirmed;
        document.getElementById("usa_deaths").innerHTML = arr[0].deaths;
    })
}

function table_india() {
    database.india_states.where('name').equals(select1.value).toArray()
    .then((arr) => {
        // console.log(arr[0]);
        document.getElementById("india_state_name").innerHTML = arr[0].name;
        document.getElementById("india_confirmed").innerHTML = arr[0].confirmed;
        document.getElementById("india_active").innerHTML = arr[0].active;
        document.getElementById("india_recovered").innerHTML = arr[0].recovered;
        document.getElementById("india_deaths").innerHTML = arr[0].deaths;
    })
}

function map_pressed(params) {
    about_screen.style.display = "none";
    search_screen.style.display = "none";
    chart_screen.style.display = "block";
    location_screen.style.display = "none";

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

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Countries');
    
    if (typeof data_type == null)  {
        data_type = "india";
    }

    if (data_type == "india")    {
        data.addColumn('number', 'Confirmed');
        data.addColumn('number', 'Active');
        data.addColumn('number', 'Deaths');
        data.addColumn('number', 'Recovered');

        if (india_fetched == false)
            return;
        
        var wholeRowData = [];
        for (let row of india_list) {
            let rowData = [];
            rowData.push(row.name);
            rowData.push(row.confirmed);
            rowData.push(row.active);
            rowData.push(row.deaths);
            rowData.push(row.recovered);
            wholeRowData.push(rowData);
        }
        data.addRows(wholeRowData);

        
    }
    else if (data_type == 'usa')    {
        data.addColumn('number', 'Confirmed');
        data.addColumn('number', 'Deaths');

        var wholeRowData = [];
        for (let row of usa_list) {
            let rowData = [];
            rowData.push(row.name);
            rowData.push(row.confirmed);
            rowData.push(row.deaths);
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
        bars: 'horizontal' // Required for Material Bar Charts.
    };

    var chart = new google.charts.Bar(document.getElementById('barchart_material'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function my_location() {
    about_screen.style.display = "none";
    search_screen.style.display = "none";
    chart_screen.style.display = "none";
    location_screen.style.display = "block";

    $(".about_screen").animate({opacity: '0'}, tab_timeout);
    $(".search_screen").animate({opacity: '0'}, tab_timeout);
    $(".chart_screen").animate({opacity: '0'}, tab_timeout);
    $(".location_screen").animate({opacity: '1'}, tab_timeout);
}


function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +
        "Longitude: " + position.coords.longitude);
    document.querySelector(".location p").innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
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

if (navigator.geolocation) {
    console.log(navigator);
    console.log(navigator.geolocation);
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} 
else {
    console.log("Geolocation is not supported by this browser.");
}
