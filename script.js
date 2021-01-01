$(document).ready(function () {
    //GLOBALS
    var owKey = "82db3485b1bdbce46c2ce5d7d2f3ae57";
    var listItemArr = [];
    
    var DateTime = luxon.DateTime;
    var Today = DateTime.local();
    //TODO if have time and will to work make a setting to 
    //choose F or C if not for homework but for portfolio[units are param in api call]

    //execute search on submit 
    $("#searchArea").on("submit", searchCity);

    pageOnLoad();
    function pageOnLoad()
    {
        if(localStorage.getItem("cityName"))
        {
            searchCityOnPageLoad(localStorage.getItem("cityName"));
        }
    
    }

    function searchCity(e)
    {
        e.preventDefault();
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

    function searchCityFromHistoryList()
    {
        var city = this.innerText;
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

    function searchCityOnPageLoad(city)
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
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${owKey}&units=metric`,
            method: "GET"
        }).done(function(data){
            
            //set current weather data and store city in local storage
            $("#cityName").text(`${cityName} (${Today.toFormat('d/MM/yyyy')})`);
            window.localStorage.setItem("cityName", `${cityName}`);
            $("#icon").attr("src", `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`)
            $("#temp").text(`Temperature: ${Math.round(data.current.temp)}`);
            $("#humidity").text(`Humidity: ${data.current.humidity}`);
            $("#windSpeed").text(`Wind Speed: ${data.current.wind_speed}`);
            $("#uvIndexText").text('UV Index: ');
            $("#uvIndexValue").text(`${data.current.uvi}`);

            if(data.current.uvi <= 2)
            {
                $("#uvIndexValue").attr("id", "favorableUV");
            }
            if(data.current.uvi >= 3 && data.current.uvi <= 5)
            {
                $("#uvIndexValue").attr("id", "moderateUV");
            }
            if(data.current.uvi >=6)
            {
                $("#uvIndexValue").attr("id", "severeUV");
            }

            //set forecasst data
            for(var i = 0; i < forecastAmount; i++)
            {
                $(`#5DayForecast${i}`).empty();
                //make div class card, 
                var card = $(`<div class="card" id="futureForecastCard"></div>`);
                //make div class card body
                var cardBody = $(`<div class="card-body"></div>`);
                //make h5 class card-title set text as date
                var futureDate = $(`<h5 class="card-title"></h5>`).text(`${Today.plus({days: i+1}).toFormat('d/MM/yyyy')}`);
                //make h6 class card-subtitle mb-2 text-muted
                var futureIcon = $(`<img>`);
                futureIcon.attr("src", `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`)
                //make p class card-text set text to temp
                var temp = Math.round((data.daily[i].temp.max + data.daily[i].temp.min)/2);
                var futureTemp = $(`<p class="card-text"></p>`).text(`Temp: ${temp}`)
                var futureHumidity = $(`<p class="card-text"</p>`).text(`Humidity: ${data.daily[i].humidity}`);
                //append to div dardbody
                cardBody.append(futureDate, futureIcon, futureTemp, futureHumidity);
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
            var listItem = $("<li>").text(`${item.Name}`);
            listItem.attr("class", "list-group-item");
            listItem.attr("id", "historyListItem");
            listItem.click(searchCityFromHistoryList);
            list.append(listItem);
        });
    }

});