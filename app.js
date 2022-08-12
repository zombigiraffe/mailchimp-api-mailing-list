const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
 
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
 
mailchimp.setConfig({
  apiKey: "8cdcdc6a014e74834c3316f88f12e241-us14",
  server: "us14"
});
 
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})
 
app.post("/", function(req, res){
  console.log(req.body.firstName);
  console.log(req.body.lastName);
  console.log(req.body.email);
 
  const listId = "aa2b3961e6";
  const subscribingUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
  };
 
  async function run() {
      try {
          const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
            }
          });
 
          console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id}.`
          );
 
          res.sendFile(__dirname + "/success.html");
      } catch (e) {
          res.sendFile(__dirname + "/failure.html");
      }
  }
 
  run();
})
 
app.post("/failure", function(req, res) {
  res.redirect("/");
})
 
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000")
});

// API KEY
// 8cdcdc6a014e74834c3316f88f12e241-us14

// Audience ID
// aa2b3961e6

