//GLOBALS
var owKey = "82db3485b1bdbce46c2ce5d7d2f3ae57";
var listItemArr = [];

//TODO load page with last search result using localstorage

//TODO make on submit prevent default im pretty sure
//execute search on click 
$("#searchBtn").on("click", searchCity);

function searchCity()
{
    //get value from search bar
    var city = $("#searchBar").val();
    //create get ajax request to get lat and long 
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${owKey}`,
        method: "GET"
    }).done(function(data){
        //get latitude 
        var lat = data.coord.lat;
        //get longitdue
        var long = data.coord.lon;
        //steal name so we dont have to worry about capitalizing firts letter
        city = data.name;
        //get the weather using lat and long
        getWeather(lat, long, city);
        //set history list
        setHistoryListItem(city);
    });
}

//TODO link with history list and test to make sure this works
function searchCityFromHistoryList(city)
{
    $.ajax({
        //ottawa to test
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${owKey}`,
        method: "GET"
    }).done(function(data){
        var lat = data.coord.lat;
        var long = data.coord.lon;
        city = data.name;
        getWeather(lat, long, city);
        setHistoryListItem(city);
    });
}


function getWeather(latitude, longitude, cityName)
{
    //set number of days to get forecsat fo
    var forecastAmount = 5;
    //grab lat and long from params
    var lat = latitude;
    var long = longitude;
    //create get ajax request using lat na dlong
    $.ajax({
        //ottawa to test
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${owKey}`,
        method: "GET"
    }).done(function(data){
        
        //set current weather data
        $("#temp").text(`Temperature: ${data.current.temp}`);
        $("#humidity").text(`Humidity: ${data.current.humidity}`);
        $("#windSpeed").text(`Wind Speed: ${data.current.wind_speed}`);
        $("#uvIndex").text(`UV Index: ${data.current.uvi}`);

        //set forecasst data
        for(var i = 0; i < forecastAmount; i++)
        {
            //TODO add humidity
            $(`#5DayForecast${i}`).empty();
            $("#cityName").text(cityName);
            //make div class card, 
            var card = $(`<div class="card" id="futureForecastCard"></div>`);
            //make div class card body
            var cardBody = $(`<div class="card-body"></div>`);
            //make h5 class card-title set text as date
            var futureDate = $(`<h5 class="card-title"></h5>`).text(`future date`);
            //make h6 class card-subtitle mb-2 text-muted
            var futureIcon = $(`<h6 class="card-subtitle mb-2 text-muted">icon</h6>"`);
            //make p class card-text set text to temp
            var temp = (data.daily[i].temp.max + data.daily[i].temp.min)/2;
            var futureTemp = $(`<p class="card-text"></p>`).text(`${temp}`)
            //append to div dardbody
            cardBody.append(futureDate, futureIcon, futureTemp);
            //append card body to card
            card.append(cardBody);
            //apend card to #5DayForecast
            $(`#5DayForecast${i}`).append(card);
            //console.log(data);
        }
    });
}

function setHistoryListItem(name)
{
    //TODO add to localstorage
    //create object toi store in array sop we can check for duplicates
    var cityObject = {
        Name: name
    };
    //grab and empty html list elem
    var list = $("#historyList");
    list.empty();

    //check to see if array already contains the city we just searched for
    if(listItemArr.some(city => city.Name === cityObject.Name))
    {
        //get the index the city is at
        var indexToRemove = listItemArr.findIndex(i => i.Name === cityObject.Name);
        //remove from array
        listItemArr.splice(indexToRemove, 1);
        //add back to start of array
        listItemArr.splice(0, 0, cityObject);
    }
    //otherwise jsut add to start of array
    else
    {
        listItemArr.unshift(cityObject);
    }
    //cycle through array and append to html
    listItemArr.forEach(function(item, i) {
        //TODO add onclick event to search
        var listItem = $("<li>").text(`${item.Name}`);
        listItem.attr("class", "list-group-item");
        listItem.attr("id", "historyListItem");
        list.append(listItem);
    });
}

