var emailJS = require("emailjs");

/* server is not accessible to other files */
var easyupp = emailJS.server.connect({
        user: "earlybird@easyupp.com",
        password: "Jumpjazz1",
        host: "smtp.gmail.com",
        ssl: true,
	port: 465
});

/* this makes the sendEmail function available outside of email.js */
exports.sendEmail = function(mail, onResult) {
	if (mail['From'] === 'earlybird@easyupp.com') {
	  easyupp.send( {
		    text: mail.TextBody,
		    from: mail.To,
		    to: mail.From,
		    subject: mail.Subject,
				attachment:
     [
        {data:mail.HtmlBody, alternative:true}
     ]
	  }, onResult);
	}
};
