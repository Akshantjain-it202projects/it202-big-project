const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));

const select1 = new mdc.select.MDCSelect(document.querySelector('.india .mdc-select'));
const select2 = new mdc.select.MDCSelect(document.querySelector('.usa .mdc-select'));

const buttonRipple = new mdc.ripple.MDCRipple(document.querySelector('.mdc-button'));

const menu = new mdc.menu.MDCMenu(document.querySelector('.mdc-menu'));
menu.open = true;

var first_screen = {
    name: "Search Bar",
    heading: "COVID-19 TRACKER",
    description: "The website provides you with the data about coronavirus situations in countries of the world, and the states of India and United States of America",
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

document.querySelector(".first_page_description").innerHTML = first_screen.description;

let india_list;
db.india_states.toArray().then((arr) => {
    india_list = arr;
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

    $(".india").animate({opacity: '1'}, 800);
    $(".usa").animate({opacity: '0'}, 800);
    $(".world").animate({opacity: '0'}, 800);
    $(".location").animate({opacity: '0'}, 800);
    
    for (let state of india_list)   {
        // console.log(state.name);
        var list_item = document.createElement("li");
        list_item.classList.add("mdc-list-item");
        list_item.setAttribute("data-value", state.name);
        list_item.innerHTML = state.name;

        india_state_list.appendChild(list_item);
    }

}

let usa_list;
db.usa_states.toArray().then((arr) => {
    usa_list = arr;
});

function us_press() {
    let usa_state_list = document.querySelector(".usa_list");

    india_tab.style.display = "none";
    us_tab.style.display = "block";
    world_tab.style.display = "none";
    location_tab.style.display = "none";

    $(".india").animate({opacity: '0'}, 800);
    $(".usa").animate({opacity: '1'}, 800);
    $(".world").animate({opacity: '0'}, 800);
    $(".location").animate({opacity: '0'}, 800);

    for (let state of usa_list) {
        // console.log(state.name);
        var list_item = document.createElement("li");
        list_item.classList.add("mdc-list-item");
        list_item.setAttribute("data-value", state.name);
        list_item.innerHTML = state.name;

        usa_state_list.appendChild(list_item);
    }
}

function world_press() {
    console.log("world_pressed");

    india_tab.style.display = "none";
    us_tab.style.display = "none";
    world_tab.style.display = "block";
    location_tab.style.display = "none";

    $(".india").animate({opacity: '0'}, 800);
    $(".usa").animate({opacity: '0'}, 800);
    $(".world").animate({opacity: '1'}, 800);
    $(".location").animate({opacity: '0'}, 800);
}

function location_press() {
    console.log("location_pressed");

    india_tab.style.display = "none";
    us_tab.style.display = "none";
    world_tab.style.display = "none";
    location_tab.style.display = "block";

    $(".india").animate({opacity: '0'}, 800);
    $(".usa").animate({opacity: '0'}, 800);
    $(".world").animate({opacity: '0'}, 800);
    $(".location").animate({opacity: '1'}, 800);
}

