define([],function(){    
    var Charts = function(){
        //heuristic 3 list of incorrect questions (scene, question)
        var gameIncorrectQuestions = [];
        var appIncorrectQuestions = [];
        
        //heuristic 1: line chart showing %accuracy from one half to another
        this.plot1 = function(data){
            var users = (Object.keys(data)).sort(); //get all the userIDs
            var series = [];        //overall series object to plot in highcharts
            
            /* Loop through each user (i)
             * Loop through each session for the unity game (j)
             * Loop through each question (k)
             */
            //loop through each user that we need
            for(var i = 0; i < users.length; i++) {
                var userData = data[users[i]];  //each user's data
                var seriesForThisUser = {}; //initialize the highcharts series for this user
                
                //only process the game Sessions
                if(typeof userData["gameSessions"] !== 'undefined' && userData["gameSessions"])
                {   
                    //initialize the gameData to work with
                    gameData = userData["gameSessions"];
                    var sessionTrue = [];
                    var sessionFalse = [];
                    
                    //loop through each session
                    for(var j = 0; j < gameData.length; j++) {
                        //get the game summaries array
                        gameSummaries = gameData[j]["summary"][0];
                        
                        //initialize vars to keep track of how many true/false in each session
                        var numFalse = 0;
                        var numTrue = 0;
                        
                        //only process game summaries with qna happening
                        if(gameSummaries["qna"] !== "null") {
                            var qna = gameSummaries["qna"];
                            
                            //loop through each question
                            for(var k = 0; k < qna.length; k++)
                            {
                                var answers = qna[k]["correct answer"]; //list of answers
                                
                                //count number of wrong and correct answers
                                for(var ii=0; ii < answers.length; ii++)
                                {
                                    if(answers[ii] == true)
                                        numTrue++;
                                    else if(answers[ii] == false)
                                    {
                                        numFalse++;
                                        
                                        //push onto the list, the question ID that was wrong
                                        gameIncorrectQuestions.push(" " + qna[k]["_id"]);
                                    }
                                }
                            }
                        } //end of if gamesumm["qna"]
                        sessionTrue.push(numTrue);
                        sessionFalse.push(numFalse);
                    }//end of loop through sessions
                }//end of if game data
                else {  //video app data
                    
                }
                
                // initialize total counters for true and false for user
                var trueTotal = 0;
                var falseTotal = 0;

                //sum up totals
                $.each(sessionTrue, function() {
                    trueTotal += this;
                });
                $.each(sessionFalse, function() {
                    falseTotal += this;
                });

                //initialize counters and half lists to separate first half/second half session
                var firstHalfTrue = sessionTrue.slice(0, sessionTrue.length/2);
                var firstHalfTrueTotal = 0;
                var secondHalfTrueTotal = 0;
                var firstHalfFalse = sessionFalse.slice(0, sessionTrue.length/2);
                var firstHalfFalseTotal = 0;
                var secondHalfFalseTotal = 0;

                //sum up the first half; if odd, sum up first half rounded down the indice
                $.each(firstHalfTrue, function() {
                    firstHalfTrueTotal += this;
                });

                $.each(firstHalfFalse, function() {
                    firstHalfFalseTotal += this;
                });

                //if even number of sessions
                if(sessionTrue.length % 2 == 0) {
                    secondHalfTrueTotal = trueTotal - firstHalfTrueTotal;
                    secondHalfFalseTotal = falseTotal - firstHalfFalseTotal; 
                } else {    //odd number of sessions
                    //split up the correct answers in half
                    firstHalfTrueTotal += sessionTrue[Math.floor(sessionTrue.length/2)]/2;
                    secondHalfTrueTotal = trueTotal - firstHalfTrueTotal ;

                    //split up wrong answers in half 
                    firstHalfFalseTotal += sessionFalse[Math.floor(sessionFalse.length/2)]/2;
                    secondHalfFalseTotal = falseTotal - firstHalfFalseTotal;
                }                
                
                /* Quantify performance (total questions correct / total questions) */
                var firstPerf = 0;      //first half's performance
                var secondPerf = 0;     //second half's performance
                
                // account for the fact when a total is 0-> don't divide by 0
                if(firstHalfTrueTotal == 0) 
                    firstPerf = 0;
                else
                    firstPerf = firstHalfTrueTotal/(firstHalfFalseTotal                                                       + firstHalfTrueTotal).toFixed(2)
                if(secondHalfTrueTotal == 0)
                    secondPerf = 0;
                else
                    secondPerf = secondHalfTrueTotal/(secondHalfFalseTotal +                                                           secondHalfTrueTotal).toFixed(2)
                
                //if something is NaN...
                if(isNaN(firstPerf) || isNaN(secondPerf)) {
                    //debug statements
                    console.log("Some number was NaN. Skipped user " + users[i]);
                    console.log(sessionTrue);
                    console.log(sessionFalse);
                    console.log(firstHalfTrueTotal + " " + firstHalfFalseTotal);
                } else {
                    
                    //initialize the series for this particular user
                    seriesForThisUser.name = users[i];  //add in the number of questinos next to their name
                    seriesForThisUser.data = [];
                    
                    //intialize the x and y axis data points
                    var xSeries = ["First Half", "Second Half"];
                    var percentCorrect = [firstPerf, secondPerf];
                    
                    //loop through the x and y series
                    for(var m = 0; m < xSeries.length; m++) {
                        seriesForThisUser.data.push({
                            y: percentCorrect[m],
                            marker:{
                                enabled: true,
                                radius: 6
                            }
                        });
                    }
                    series.push(seriesForThisUser); //push to the overall series
                }
            }//end of loop through users
            
            var temp = [];
            
            //filter out only users we are interested in
            for(var i=0; i<series.length; i++)
            {
                if (series[i].name == 'evka'
                   || series[i].name == 'jomi'
                   || series[i].name == 'cabe'
                   || series[i].name == 'diwe'
                   || series[i].name == 'alza'
                   || series[i].name == 'jofa'
                   || series[i].name == 'lowa'
                   || series[i].name == 'rara'
                   || series[i].name == 'laal')
                {
                    series[i].name = users[i] + " (" +(qna.length) + ")";//add in # of questions next to their name
                    temp.push(series[i]);
                }
            }
            
            return temp;
        }
        
        
        //heuristic 2: histogram of session duration vs. days since beginning. Filter out 1 or fewer social vignettes
        //red is incomplete, black is complete
        this.plot2 = function(data){
            var users = (Object.keys(data)).sort(); //get all the userIDs
            var series = [];        //overall series object to plot in highcharts
            
            /* Loop through each user (i)
             * Loop through each session for the unity game (j)
             * Check social vignette length and build out series
             */
            //loop through each user that we need ***HALF FOR NOW
            for(var i = 0; i < users.length; i++) {
                var seriesForThisUser = {}; //initialize the highcharts series for this user
                var userData = data[users[i]];  //each user's data
                var sessionsComplete = [];  //list of completion status for sessions      
                var sessionsDuration = [];  //list of durations for sessions
                var sessionsDaySinceStart = [];  //list of the day this session was on
                
                
                //only process the game Sessions
                if(typeof userData["gameSessions"] !== 'undefined' && userData["gameSessions"])
                {   
                    //initialize the gameData to work with
                    gameData = userData["gameSessions"];
                    
                    //find the value of the first day (earliest startTime)
                    var sessionStart = [];
                    for(var j=0; j<gameData.length; j++) {
                        sessionStart.push(gameData[j]["summary"][0]["startTime"]);
                    }
                    
                    //loop through each session
                    for(var j = 0; j < gameData.length; j++) {
                        var seshComplete = false;//flag to determine session completion
                        var daysSinceStart = 0;
                        
                        //get the game summaries array
                        gameSummaries = gameData[j]["summary"][0];
                        
                        if(j==0) { //set the firstSession to the first start time user had
                            var firstSession = Math.min.apply(Math, sessionStart);
                        }
                        
                        //set session complete flag to true if more than 1 scene
                        if(gameSummaries["socialVignettes"].length > 1 &&                                       gameSummaries["socialVignettes"] !== "null") {
                            seshComplete = true;
                        } //end of if gamesumm["qna"]
                        
                        //convert startime to a day
                        daysSinceStart = Math.floor((gameSummaries["startTime"] - firstSession) / 86400);
                         
                        //**********debug check, something is N/A in startTime
//                        if(isNaN(daysSinceStart))
//                            console.log(users[i]+ " " + j + "true!!");
                        
                        //add in flag after we check each session and add duration
                        sessionsComplete.push(seshComplete);
                        sessionsDuration.push((gameSummaries["duration"]/60).toFixed(2));
                        sessionsDaySinceStart.push(daysSinceStart);
                    }//end of loop through sessions
                    
                    //initialize the series for this particular user
                    seriesForThisUser.name = users[i];
                    seriesForThisUser.data = [];

    //                console.log(sessionsComplete);
    //                console.log(sessionsDuration);
    //                console.log(sessionsDaySinceStart);

                    //loop through the x and y series
                    for(var m = 0; m < sessionsComplete.length; m++) {
                        seriesForThisUser.data.push({
                            x: sessionsDaySinceStart[m],
                            y: parseInt(sessionsDuration[m]),
                            completeStatus: sessionsComplete[m],
                            marker:{
                                enabled: true,
                                radius: 6,
                                lineWidth: (sessionsComplete[m] == false)? 3 : 1, 
                                lineColor:(sessionsComplete[m] == false)? "red" : "blue"
                            }
                        });
                    }
                    series.push(seriesForThisUser);
                }//end of if check for gameSessions
            }//end of loop through users
            return series;
        }//end of plot2 function
        
        
        this.plot3 = function(data){
            return incorrectQuestions;
        }
    }
    return Charts;
});