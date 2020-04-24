var db = new Dexie("COVID-19 Data");

let india_fetched = false;
let usa_fetched = false;

db.version(1).stores({
    india_states: "name, latitude, longitude, confirmed, active, deaths, recovered",
    usa_states: "name, latitude, longitude, confirmed, deaths"
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
        db.india_states.clear();
        db.open().then(function () {
            for (let state of data) {
                db.india_states.add({
                    name: state.state,
                    latitude: state.latitude,
                    longitude: state.longitude,
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
        // console.log(main_data);
        db.usa_states.clear();
        for (let state of data) {
            db.usa_states.add({
                name: state.state,
                latitude: state.latitude,
                longitude: state.longitude,
                confirmed: state.confirmed,
                deaths: state.deaths,
            })
        }

    })
    .catch(err => {
        console.log(err);
    });