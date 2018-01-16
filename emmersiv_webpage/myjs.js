/***
File: myjs.js
Description: Javascript file to handle loading up of the inbox page.
Author: Adam Li 01/2015
***/

//load jquery library from google
google.load("jquery", "1");

//global vars
var arrayEmails = new Array();	//store list of all emails

/* function: onLoadCallBack
Description: called when the page is loaded. ->
	1. parse JSON data for emails from text file
	2. populate the list of emails
	3. load the inbox home page
*/
google.setOnLoadCallback(function() {
	//JSON format of all the email data ********** called from db in the future
	var url = "emails.txt"


	//get the url and have a response...
	$.get(url, function(response) {
		//parse JSON for list of all 'emails' from the url's list inside emails
		var listEmails = ($.parseJSON(response)).emails;

		console.log("--> " + listEmails);

		//loop through list of emails and do this...
		for(var i=0; i<listEmails.length; i++) {
			//grab the email and push it into the inmails div
			var email = listEmails[i];

			arrayEmails.push(email);
			addEmailToBox(email, arrayEmails.length);
		}
	});
});

/* function: addEmailToBox
Description: called to add an email to the inbox. This dynamically
inserts <div> tags and other tags for each email into the container 'inmails'
*/
function addEmailToBox(email, index) {
	/*
		inmail item is a div that contains:
		1. div for the email and id for that certain email
			<div class="email" id="email_#">
		2. inner div for the checkbox as an input
			<div class="check" id="check_#">
				<input id="c#"
		3. another inner div for the sender as a span
			<div class="sender" id="sender_1">
				<span id="s1">
		4. inner div for the subject as a span
			<div class="subject" id="subject_#"">
				<span id="subj#">
		5. inner div for the date as a span
			<div class="date" id="date_#">
				<span id="d#">
	*/

	var emailid = "email_"+index;
	var checkid = "check_"+index;
	var senderid = "sender_"+index;
	var subjectid = "subject_"+index;
	var dateid = "date_"+index;

	var divString = 
		"<div class='email' id='"+emailid+"'>" +
			"<div class='check' id='"+checkid+"'>"+
				"<input type='checkbox'>"+
			"</div>" +
			"<div class='sender' id='"+senderid+"'>"+
				"<span>"+email.sender+"</span>"+
			"</div>" +
			"<div class='subject' id='" +subjectid+ "'>" +
				"<span>"+email.subject+"</span>"+
			"</div>" +
			"<div class='date' id='"+dateid+"'>"+
				"<span>"+email.date+"</span>"+
			"</div>"+
		"</div>";

	//now grab div for the outer container 'inmails' and push divs inside this div
	var divInMail = document.getElementById('mailbox_1');

	divInMail.innerHTML += divString;
}