"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.faq = exports.Login = exports.Register = exports.BookAdemo = exports.sendMailContact = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _index = require("../index.js");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _crypto = _interopRequireDefault(require("crypto"));

var _openai = _interopRequireDefault(require("openai"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import crypto from "crypto";
// app.get("/search", async (req, res) => {
//   const apiKey = "AIzaSyBCxspr77oUI8C0pAt13JsTM7Mp5HkirU8"; // Replace with your actual Google API key
//   const customSearchEngineId = "455ac4cb960aa46fd"; // Replace with your custom search engine ID
//   const searchQuery = "car";
//   const languageFilter = "hindi";
//   const cityFilter = "india";
//   try {
//     // Construct the URL for the Google Custom Search API request
//     var apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${customSearchEngineId}&q=${searchQuery}&callback=hndlr`;
//     // You can add additional parameters like language and city to the URL if needed
//     if (languageFilter) {
//       apiUrl += `&lr=${languageFilter}`;
//     }
//     if (cityFilter) {
//       apiUrl += `&location=${cityFilter}`;
//     }
//     // Make the API request
//     const response = await axios.get(apiUrl);
//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while making the API request." });
//   }
// });
var sendMailContact = function sendMailContact(req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      email = _req$body.email,
      phone = _req$body.phone,
      message = _req$body.message;
  console.log(req.body);

  var transporter = _nodemailer["default"].createTransport({
    service: "gmail",
    auth: {
      user: "amankapil60@gmail.com",
      // Replace with your own email address
      pass: "qtswjzzghiggvnze" // Replace with your own email password

    }
  }); // zcgdsscknnjxmjlh


  var mailOptions = {
    from: "amankapil60@gmail.com",
    // Replace with your own email address
    to: "aman@codelinear.com",
    // Replace with the recipient's email address
    subject: "New message from your website",
    text: "FristName: ".concat(name, "\n Email: ").concat(email, "\n phone: ").concat(phone, "\nMessage: ").concat(message)
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
};

exports.sendMailContact = sendMailContact;

var BookAdemo = function BookAdemo(req, res) {
  var _req$body2 = req.body,
      name = _req$body2.name,
      email = _req$body2.email,
      phone = _req$body2.phone,
      company = _req$body2.company,
      companysize = _req$body2.companysize,
      role = _req$body2.role,
      perpose = _req$body2.perpose;
  console.log(req.body);

  var transporter = _nodemailer["default"].createTransport({
    service: "gmail",
    auth: {
      user: "amankapil60@gmail.com",
      // Replace with your own email address
      pass: "qtswjzzghiggvnze" // Replace with your own email password

    }
  }); // zcgdsscknnjxmjlh


  var mailOptions = {
    from: "amankapil60@gmail.com",
    // Replace with your own email address
    to: "aman@codelinear.com",
    // Replace with the recipient's email address
    subject: "New message from your website",
    text: "FristName: ".concat(name, "\n Email: ").concat(email, "\n phone: ").concat(phone, "company: ").concat(company, " companysize: ").concat(companysize, "\n role: ").concat(role, "\n perpose: ").concat(perpose)
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
};

exports.BookAdemo = BookAdemo;

var Register = function Register(req, res) {
  var _req$body3 = req.body,
      username = _req$body3.username,
      password = _req$body3.password; // Check if the user already exists in the database

  _index.db.query("SELECT * FROM register WHERE email = ?", [username], function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Registration failed"
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    } // Hash the password


    var hashedPassword = _bcrypt["default"].hashSync(password, 10); // Insert the new user into the database


    _index.db.query("INSERT INTO register (email, password) VALUES (?, ?)", [username, hashedPassword], function (err, results) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Registration failed"
        });
      }

      res.status(200).json({
        message: "Registration successful"
      });
    });
  });
};

exports.Register = Register;

var Login = function Login(req, res) {
  var _req$body4, username, password;

  return regeneratorRuntime.async(function Login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body4 = req.body, username = _req$body4.username, password = _req$body4.password;

          try {
            _index.db.query("SELECT * FROM register WHERE email = ?", [username], function (error, results) {
              if (error) {
                console.error(error);
                return res.status(500).json({
                  message: "Login failed"
                });
              }

              var user = results[0]; // Assuming the query returns a user

              if (!user || !_bcrypt["default"].compareSync(password, user.password)) {
                return res.status(401).json({
                  message: "Invalid username or password"
                });
              }

              var token = _jsonwebtoken["default"].sign({
                username: username
              }, "jsadlkjhfwery39e8udhsl");

              res.json({
                token: token
              });
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({
              message: "Login failed"
            });
          }

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.Login = Login;

var faq = function faq(req, res) {
  var paragraph, generatedFAQs;
  return regeneratorRuntime.async(function faq$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          paragraph = req.body.paragraph;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(generateFAQsUsingOpenAI(paragraph));

        case 4:
          generatedFAQs = _context2.sent;
          res.json({
            faqs: generatedFAQs
          });
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          console.error("Failed to generate FAQs:", _context2.t0);
          res.status(500).json({
            error: "Failed to generate FAQs"
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // const { apiKey } = "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";


exports.faq = faq;

function generateFAQsUsingOpenAI(text, apiKey) {
  var prompt, response, generatedFAQ, faqs;
  return regeneratorRuntime.async(function generateFAQsUsingOpenAI$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          prompt = "Create FAQs from the following text:\n\n".concat(text, "\n\nQuestions:\n1.");
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post("https://api.openai.com/v1/engines/davinci/completions", {
            prompt: prompt,
            max_tokens: 50 // Adjust as needed

          }, {// headers: {
            //   // 'Authorization': `Bearer ${apiKey}`,
            //   Authorization: `Bearer ${apiKey}`,
            // },
          }));

        case 4:
          response = _context3.sent;
          generatedFAQ = response.data.choices[0].text;
          faqs = generatedFAQ.split("\n").map(function (faq) {
            return {
              question: faq.trim(),
              answer: ""
            };
          });
          return _context3.abrupt("return", faqs);

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](1);
          throw _context3.t0;

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 10]]);
}