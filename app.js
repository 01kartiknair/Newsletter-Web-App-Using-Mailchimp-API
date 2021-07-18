const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);
//in the url after "/lists" we add the audience id or list id provided in the mailchimp account (for eg: https://us6.api.mailchimp.com/3.0/lists/13113) assuming listId is 13113
  const url = "https://us6.api.mailchimp.com/3.0/lists/listId";

//enter your username and apikey in auth attribute (apikey can be created through the mailchimp account or you could use the default given by them if it's there)
  const options = {
    method: "POST",
    auth: "username:apiKey"
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));

    });



  })
  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
})
