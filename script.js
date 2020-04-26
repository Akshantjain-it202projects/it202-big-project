const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));

const select1 = new mdc.select.MDCSelect(document.querySelector('.india .mdc-select'));
const select2 = new mdc.select.MDCSelect(document.querySelector('.usa .mdc-select'));

const buttonRipple = new mdc.ripple.MDCRipple(document.querySelector('.mdc-button'));

const menu = new mdc.menu.MDCMenu(document.querySelector('.mdc-menu'));
// menu.open = true;

let openMapMenu = () => {   menu.open = true;   }

const tab_timeout = 500;

// var info = {
//     // name: "Search Bar",
//     // heading: "COVID-19 TRACKER",
//     // description: "The website provides you with the data about coronavirus situations in countries of the world, and the states of India and United States of America",
//     // options: [
//     //     {
//     //         name: "India",
//     //         page_id: "india_screen",
//     //     }, 
//     //     {
//     //         name: "United States",
//     //         page_id: "us_screen",
//     //     }, 
//     //     {
//     //         name: "All Countries",
//     //         page_id: "world_screen"
//     //     }
//     // ]
// }

var info = [
    {
        about: {
            name: "About Screen",
            heading: "About",
            description: 'The website is a project designed, developed and created by Akshant Jain under MIT Lisence',
            API: ["", ""],
            URL: [
                {repo: ""},
                {lisence: ""},
                {website: ""},
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
let usa_list;
let world_list;

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
    
    database.india_states.toArray().then((arr) => {
        india_list = arr;
    });

    for (let state of india_list)   {
        var list_item = document.createElement("li");
        list_item.classList.add("mdc-list-item");
        list_item.setAttribute("data-value", state.name);
        list_item.innerHTML = state.name;

        india_state_list.appendChild(list_item);
    }
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

    database.usa_states.toArray().then((arr) => {
        usa_list = arr;
    });

    for (let state of usa_list) {
        var list_item = document.createElement("li");
        list_item.classList.add("mdc-list-item");
        list_item.setAttribute("data-value", state.name);
        list_item.innerHTML = state.name;

        usa_state_list.appendChild(list_item);
    }
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
}

var about_screen = document.querySelector(".about_screen");
var search_screen = document.querySelector(".search_screen");
var map_screen = document.querySelector(".map_screen");
var location_screen = document.querySelector(".location_screen");

function about_press() {
    about_screen.style.display = "block";
    search_screen.style.display = "none";
    map_screen.style.display = "none";
    location_screen.style.display = "none";

    $(".about_screen").animate({opacity: '1'}, tab_timeout);
    $(".search_screen").animate({opacity: '0'}, tab_timeout);
    $(".map_screen").animate({opacity: '0'}, tab_timeout);
    $(".location_screen").animate({opacity: '0'}, tab_timeout);
}

function search_press() {
    about_screen.style.display = "none";
    search_screen.style.display = "block";
    map_screen.style.display = "none";
    location_screen.style.display = "none";

    $(".about_screen").animate({opacity: '0'}, tab_timeout);
    $(".search_screen").animate({opacity: '1'}, tab_timeout);
    $(".map_screen").animate({opacity: '0'}, tab_timeout);
    $(".location_screen").animate({opacity: '0'}, tab_timeout);
}

function map_pressed(params) {

    console.log(params);

    about_screen.style.display = "none";
    search_screen.style.display = "none";
    map_screen.style.display = "block";
    location_screen.style.display = "none";

    $(".about_screen").animate({opacity: '0'}, tab_timeout);
    $(".search_screen").animate({opacity: '0'}, tab_timeout);
    $(".map_screen").animate({opacity: '1'}, tab_timeout);
    $(".location_screen").animate({opacity: '0'}, tab_timeout);
}

function my_location() {
    about_screen.style.display = "none";
    search_screen.style.display = "none";
    map_screen.style.display = "none";
    location_screen.style.display = "block";

    $(".about_screen").animate({opacity: '0'}, tab_timeout);
    $(".search_screen").animate({opacity: '0'}, tab_timeout);
    $(".map_screen").animate({opacity: '0'}, tab_timeout);
    $(".location_screen").animate({opacity: '1'}, tab_timeout);
}


// function showPosition(position) {
//     console.log("Latitude: " + position.coords.latitude +
//         "Longitude: " + position.coords.longitude);
// }

// function showError(error) {
//     switch (error.code) {
//         case error.PERMISSION_DENIED:
//             console.log("User denied the request for Geolocation.");
//             break;
//         case error.POSITION_UNAVAILABLE:
//             console.log("Location information is unavailable.");
//             break;
//         case error.TIMEOUT:
//             console.log("The request to get user location timed out.");
//             break;
//         case error.UNKNOWN_ERROR:
//             console.log("An unknown error occurred.");
//             break;
//     }
// }

// if (navigator.geolocation) {
//     console.log(navigator);
//     console.log(navigator.geolocation);
//     navigator.geolocation.getCurrentPosition(showPosition, showError);
// } 
// else {
//     console.log("Geolocation is not supported by this browser.");
// }