var charts;

require(['auth','charts'],function(AuthToken, Charts){
    
    charts = new Charts();
    
    $("#loadMessage").html("Authenticating...");
    
    //Get the AuthToken module
    var auth = new AuthToken();
    auth.getAuthToken(function(value){
        var token = value;
        console.log("token: " + token);
        
        //add the token to every ajax call header
        $.ajaxSetup({
            'beforeSend': function (xhr) {            
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
        });

        //server address
        var url = 'http://emmersiv.westhci.net/api/v1/usersessions';
                
        //get data from the user summary collection
        $.ajax({
            url : url,            
            success : getAllUserData,    
            error: errorHandler
        });
    });
});


/************************************************************************
    name:   errorHandler
    param:  none
    descr:  handle error on AJAX request for the base API call
************************************************************************/
function errorHandler(){
    console.log("Auth Error");    
    $("#loaderImg").hide();
    $("#loadMessage").html("Authentication failed! Generate a new token");
}

/************************************************************************
    name:   getAllUserData
    param:  data -> jsonified version of "usersessions" collection in DB
    descr:  Handle result from successful API call... grab each user and 
        pull the actual data for that user for both app and game 
        sessions
************************************************************************/
function getAllUserData(data){    
    
    $("#loadMessage").html("Fetching data...");
    
    var numUsers = data.length;
    var allAppSessIds = ""; var countAppSessions = 0;
    var allGameSessIds = ""; var countGameSessions = 0;
    var baseUrlGame = "http://emmersiv.westhci.net/api/v1/gamesessions?_id=";
    var baseUrlApp = "http://emmersiv.westhci.net/api/v1/appsessions?_id=";
    
    //from the data, create a string of all valid app session ids
    //and another string for all valid game sessions ids for each user    
    for(var i = 0; i < numUsers; i++){
        var userInfo = data[i];        
        var app = stringifyList(data[i].appSessions);        
        var game = stringifyList(data[i].gameSessions);        
        allAppSessIds += app.result; countAppSessions += app.total;
        allGameSessIds += game.result; countGameSessions += game.total;
    }
    
    //now we have one string for all app session Ids and another for all game session IDs
    //lets add these to the respective URLs    
    baseUrlApp += allAppSessIds; 
    baseUrlGame += allGameSessIds;
    
    //get rid of any trailing commas
    if(baseUrlGame[baseUrlGame.length - 1] == ",") 
        baseUrlGame = baseUrlGame.substr(0, baseUrlGame.length - 1);
    if(baseUrlApp[baseUrlApp.length - 1] == ",") 
        baseUrlApp = baseUrlApp.substring(0, baseUrlApp.length - 1);
    
    //trim strings
    baseUrlApp = baseUrlApp.trim();
    baseUrlGame = baseUrlGame.trim();
    
    //get all the data - queries take some time, so be patient
    $.get(baseUrlApp, function(appData){    
        $.get(baseUrlGame, function(gameData){
            
            $("#loadMessage").html("Success!");
            
            //now let's get jiggy with it...            
            var allData = {};
            
            //add all appsessions based on user id
            for(var i = 0; i < appData.length; i++){
                var item = appData[i];
                var user = item.userId.toLowerCase();
                if(!allData.hasOwnProperty(user)) allData[user] = {"appSessions" : []};            
                allData[user].appSessions.push(item);
            }
            
            //add all game sessions based on user id
            for(var i = 0; i < gameData.length; i++){
                var item = gameData[i];
                var user = item.userId.toLowerCase();
                if(!allData.hasOwnProperty(user)) allData[user] = {};
                if(!allData[user].hasOwnProperty("gameSessions")) allData[user]["gameSessions"] = [];
                allData[user].gameSessions.push(item);    
            }
            
            // ----------------- data is loaded -----------------
            $("#loader").fadeOut('slow', function(){
                //this shows the structure of all the data within the console
                console.log(allData);   
                                
                //----- your code goes in here ----
                //build out the highCharts object 
                var accuracyPlot = charts.plot1(allData);
                var attentionPlot = charts.plot2(allData);
                var temp = [];
                for(var i=0; i<attentionPlot.length; i++)
                {
                    if (attentionPlot[i].name == 'evka')
                        temp.push(attentionPlot[i]);
                    else if (attentionPlot[i].name == 'jomi')
                        temp.push(attentionPlot[i]);
                    else if (attentionPlot[i].name == 'cabe')
                        temp.push(attentionPlot[i]);
                    else if (attentionPlot[i].name == 'diwe')
                        temp.push(attentionPlot[i]);
                    else if (attentionPlot[i].name == 'alza')
                        temp.push(attentionPlot[i]);
                    else if (attentionPlot[i].name == 'jofa')
                        temp.push(attentionPlot[i]);
                    else if (attentionPlot[i].name == 'lowa')
                        temp.push(attentionPlot[i]);
                    else if (attentionPlot[i].name == 'rara')
                        temp.push(attentionPlot[i]);
                    else if (attentionPlot[i].name == 'laal')
                        temp.push(attentionPlot[i]);
                }
                
                //plot it        
                $("#data").highcharts({
                    chart : {type: 'line'},

                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: true
                            }
                        }
                    },
                    title : {text: "Accuracy: Affective Understanding (All Questions)"},
                    xAxis : {categories: ["First Half", "Second Half"]},
                    yAxis : {title : {text: "% Correct"}},        
                    series: accuracyPlot
                });
                
                
                for(var j=0; j<temp.length; j++)
                {
                    var tempDiv = document.createElement('div');
                    tempDiv.id = 'data'+j;
                    document.getElementsByTagName('body')[0].appendChild(tempDiv);
                    var input = '#'+tempDiv.id;
                    
                    $(input).highcharts({
                        chart: {
                            type: 'scatter'
                        },
                        title: {
                            text: 'System Usability'
                        },
                        xAxis: {
                            title: {
                                text: "Days from Intervention Start"
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Time (mins) per Session'
                            },
                            labels: {
                                overflow: 'justify'
                            }
                        },
                        tooltip: {
                            valueSuffix: 'minutes'
                        },

                        series: temp.slice(j,j+1)
                    }); //end of highcharts plotting
                }
                
                var tempDiv = document.createElement('div');
                tempDiv.id = 'data'+(temp.length+1);
                document.getElementsByTagName('body')[0].appendChild(tempDiv);
                var input = tempDiv.id;
                
                var output = "<p>" + charts.plot3(allData) + "<p>";
                
                document.getElementById(input).innerHTML += output;
            });
        });
    });     
}

/************************************************************************
    name:   stringifyList
    param:  list, separator 
    descr:  flattens a list of objects into a string separated by the
        specified separator. If no separator is specified, comma is used.
        If the list contains elements that were null or "null", these are
        skipped
        
    return: {
        result: <stringified list>,
        total : total number of elements that were successfully added
    }
************************************************************************/
function stringifyList(lst, sep){    
    
    if(sep == undefined) sep = ",";
    
    var result = "";
    var count = 0;    
    for(var i = 0; i < lst.length; i++){
        if(lst[i] != null && lst[i].toLowerCase() != "null"){
            result += lst[i] + sep;
            count++;
        }
    }
    
    return {result: result, total: count};
}