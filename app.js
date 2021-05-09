const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const { urlencoded, json } = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const name = req.body.fname;
  const surname = req.body.surname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
          SNAME: surname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/b875cf3bdd";

  const options = {
    method: "POST",
    auth: "emre1:d4411a3e06ccdb817d9123e1977761eb-us1",
  };

  const request = https.request(url, options, (response) => {
    const status = response.statusCode;

    status === 200
      ? res.sendFile(__dirname + "/success.html")
      : res.sendFile(__dirname + "/failure.html");

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () =>
  console.log("listening on port 3000")
);

// API key

// d4411a3e06ccdb817d9123e1977761eb-us1
// List id

// b875cf3bdd