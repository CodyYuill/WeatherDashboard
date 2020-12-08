
var owKey = "82db3485b1bdbce46c2ce5d7d2f3ae57";
$.ajax({
    //ottawa to test
    url: `https://api.openweathermap.org/data/2.5/onecall?lat=45.421532&lon=-75.697189&appid=${owKey}`,
    method: "GET"
}).then(function(data){
    console.log(data);
});