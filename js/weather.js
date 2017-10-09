var capitalsArray=[];

//Starts the code by entering potential capitals
function start() {
    getCapitals();
    getWoeids(capitalsArray);
}

//We populate our drop-down menu for us to select in the actual view
function getCapitals(){
    capitalsArray.push("Atlanta, GA");
    capitalsArray.push("Columbus, OH");
    capitalsArray.push("Salem, OR");
    capitalsArray.push("Frankfort, KY");
    capitalsArray.push("Albany, NY");
    capitalsArray.push("Denver, CO");
    capitalsArray.push("Lansing, MI");
    capitalsArray.push("Montgomery, AL");
    capitalsArray.push("Little Rock, AR");
    capitalsArray.push("Dover, DE");
    //Going to go ahead and set up the dropdown
    makeSelectOptions();
}

//Now we need to fetch the woeid for the capital selected from the selected drop-down from YQL
function getWoeids(capitalsObj){
    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20woeid%20from%20geo.places%20where%20text%20in%20(";
    var capital = document.forms["stateForm"]["state"].value;
    capital = capital.replace(" ", "%20");
    capital =  capital.replace(",", "%2C");
    query += "%22" + capital + "%22";
    query += ")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

    //We've built our query using our chosen capital, now its time to request its info
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //This happens with the result of the YQL query
            runWeatherQuery(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", query, true);
    xhttp.send();
}



//Getting the capital's info from woeid
function runWeatherQuery(woeidObj) {
    console.log(woeidObj);
    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(";
    query += woeidObj.query.results.place.woeid;
    query += ")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
    console.log("WE GET HERE");

    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //This happens with the result of the YQL query
            showWeather(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", query, true);
    xhttp.send();  

}

//Now its graphing time! ^_^
function showWeather(weatherObj){
    if (document.getElementById("chart") != null) {
        while (document.getElementById("chart").lastChild) {
            document.getElementById("chart").removeChild(document.getElementById("chart").lastChild);
        }
    }
    console.log(weatherObj);
    //Defining what we need for the graphs
    var numOfDays = 7;
    var chart = document.getElementById("chart");
    var image, rect, rect2, txt, lowText, climateName, climateImage;
    var svgns = "http://www.w3.org/2000/svg";
    var barWidth = 5, barSpacing = 200, yOffset = 7.5, xOffset = .5;
    var lowBarHeight = low;
    var dayOfWeek;
    document.getElementById("title").innerHTML = "7 day forecast for " + document.getElementById("state").value;
 
    //loops 7 times to make those 7 day bar graphs
    for (var i=0; i< numOfDays; i++){
        var climate = weatherObj.query.results.channel.item.forecast[i].text;
        var low = weatherObj.query.results.channel.item.forecast[i].low;
        var lowBarHeight = low;
        var high = weatherObj.query.results.channel.item.forecast[i].high;
        var highBarHeight = high;
        var day = weatherObj.query.results.channel.item.forecast[i].day;
        var image = climateCheck(climate);
        console.log("low " + low);
        console.log("high " + high);
        console.log("day " + day);
        console.log("climate " + climate);

        rect = document.createElementNS(svgns,"rect");
        rect2 = document.createElementNS(svgns, "rect");
        
        //Draw Low Bar

        rect.setAttributeNS(null,"class","bar");
        rect.setAttributeNS(null,"height", low * 5);
        rect.setAttributeNS(null,"width", barWidth + 20);
        rect.setAttributeNS(null,"y",  520 - low * 5);
        rect.setAttributeNS(null,"x", 10 + (204 * i));
        rect.setAttributeNS(null, "style", "fill:rgba(0, 0, 255, 255" + ")");
        chart.appendChild(rect);
        
        //Draw High Bar
        rect2.setAttributeNS(null,"class","bar");
        rect2.setAttributeNS(null,"height", high * 5);
        rect2.setAttributeNS(null,"width", barWidth + 20);
        rect2.setAttributeNS(null,"y",  520 - high * 5);
        rect2.setAttributeNS(null,"x", 50 + (204 * i));
        rect2.setAttributeNS(null, "style", "fill:rgba(255, 0, 0, 255" + ")");
        chart.appendChild(rect2);
        
        //Write Day of week      
        dayOfWeek = document.createElementNS(svgns, "text");
        dayOfWeek.setAttributeNS(null, "y", 575);
        dayOfWeek.setAttributeNS(null, "x", (barWidth + barSpacing) * i );
        dayOfWeek.setAttributeNS(null,"font-size", 40);
        dayOfWeek.setAttributeNS(null, "style", "fill:rgba(0,0,0,255" + ")");
        txt = document.createTextNode(day);
        dayOfWeek.appendChild(txt);
        chart.appendChild(dayOfWeek);

        //Write Low temperature   
        lowText = document.createElementNS(svgns, "text");
        lowText.setAttributeNS(null, "x", 10 + (204 * i));
        lowText.setAttributeNS(null, "y", 500 - low * 5);
        lowText.setAttributeNS(null,"font-size", 30);
        lowText.setAttributeNS(null, "style", "fill:#00000");
        txt = document.createTextNode(low);
        lowText.appendChild(txt);
        chart.appendChild(lowText);        

       //Write high temperature   
        lowText = document.createElementNS(svgns, "text");
        lowText.setAttributeNS(null, "x", 50 + (204 * i));
        lowText.setAttributeNS(null, "y", 500 - high * 5);
        lowText.setAttributeNS(null,"font-size", 30);
        lowText.setAttributeNS(null, "style", "fill:#00000");
        txt = document.createTextNode(high);
        lowText.appendChild(txt);
        chart.appendChild(lowText);   
        
        
        //Write Climate      
        climateName = document.createElementNS(svgns, "text");
        //Staggering the climates bc they were overlapping
        if (i % 2 == 0) {
        climateName.setAttributeNS(null, "y", 30);
        } else {
        climateName.setAttributeNS(null, "y", 50);
        }
        climateName.setAttributeNS(null, "x", (barWidth + barSpacing) * i );
        climateName.setAttributeNS(null,"font-size", 30);
        climateName.setAttributeNS(null, "style", "fill:rgba(54, 72, 107,255" + ")");
        txt = document.createTextNode(climate);
        climateName.appendChild(txt);
        chart.appendChild(climateName);
        
        
        //Write image
        climateImage = document.createElementNS(svgns, "image");
        climateImage.setAttributeNS(null,"height", 50);
        climateImage.setAttributeNS(null,"width", 50);
        climateImage.setAttributeNS(null,"y",  60);
        climateImage.setAttributeNS(null,"x", 20 + (barWidth + barSpacing) * i);
        climateImage.setAttributeNS(null, "href", image.url);
        chart.appendChild(climateImage);
        
    }  
   
}
    
//Matching climates with their images
function climateCheck(climate) {
    var image;
     switch ( climate ){
            case "Sunny":
                image = {url:'../img/sunny.png'};
                break;
            case "Mostly Sunny":
                image = {url: '../img/sunny.png'};
                break;
            case "Cloudy":
                image = {url:'../img/cloudy.png'};
                break;                
            case "Clear":
                image = {url:'../img/sunny.png'};
                break;                
            case "Thunderstorms":
                image = {url:'../img/thunderstorms.png'};
                break;                
            case "Breezy":
                image = {url:'../img/breezy.png'};
                break;                
            case "Mostly Cloudy":
                image = {url:'../img/mostlycloudy.png'};
                break;                
            case "Showers":
                image = {url:'../img/showers.png'};
                break;                
            case "Partly Cloudy":
                image = {url:'../img/pcloudy.png'};
                break;                
            case "Scattered Thunderstorms":
                image = {url:'../img/scatteredthunderstorms.png'};
                break;                
            case "Scattered Showers":
                image = {url:'../img/scatteredshowers.png'};
                break;                
            case "Snow Showers":
                image = {url:'../img/snowshowers.png'};
                break;                
            case "Rain And Snow":
                image = {url:'../img/rainandsnow.png'};
                break;                
            default:
                image = {url:'../img/sunny.png'};
            }
            return image;
        }


 //Drop down selector creator
function makeSelectOptions(){
    var select = document.getElementById("state");
    for (var i=0; i< 10; i++){
        var state = capitalsArray[i];
        if (isNotAlreadyAnOption(state)){
            var optionNode = document.createElement("option");
            var textNode = document.createTextNode(state);         
            optionNode.appendChild(textNode);
            optionNode.setAttribute("value", state);
            select.appendChild(optionNode); 
        }
    }    
}

//Checks if selected alrdy
function isNotAlreadyAnOption(state){
    var options = document.getElementsByTagName("option");
    var ans = true;
    for( var i=0; i<options.length; i++){
        if ( options[i].getAttribute("value") == state ){
            ans = false;
        }
    }
    return ans;
}
