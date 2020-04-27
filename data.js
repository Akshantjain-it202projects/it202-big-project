var database = new Dexie("Database");

let india_fetched = false;
let usa_fetched = false;

database.version(1).stores({
    india_states: "name, latitude, longitude, confirmed, active, deaths, recovered",
    usa_states: "name, latitude, longitude, confirmed, deaths",
    world: "name, latitude, longitude, confirmed, deaths, recovered"
})

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