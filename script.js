var forecastAmount = 5;
var owKey = "82db3485b1bdbce46c2ce5d7d2f3ae57";
var lat = 45.421532;
var long = -75.697189;
$.ajax({
    //ottawa to test
    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${owKey}`,
    method: "GET"
}).then(function(data){
    $("#temp").text(`Temperature: ${data.current.temp}`);
    $("#humidity").text(`Humidity: ${data.current.humidity}`);
    $("#windSpeed").text(`Wind Speed: ${data.current.wind_speed}`);
    $("#uvIndex").text(`UV Index: ${data.current.uvi}`);

    for(var i = 0; i < forecastAmount; i++)
    {
        //make div class card, 
        var card = $(`<div class="card" id="futureForecastCard"></div>`);
        //make div class card body
        var cardBody = $(`<div class="card-body"></div>`);
        //make h5 class card-title set text as date
        var futureDate = $(`<h5 class="card-title"><h5>`).text(`future date`);
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
        console.log(data);
    }
});