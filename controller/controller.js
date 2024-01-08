import nodemailer from "nodemailer";

import { db } from "../index.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import session from "express-session";
import crypto from "crypto";
// import crypto from "crypto";
// import openai from "openai";
import axios from "axios";

export const sendMailContact = (req, res) => {
  const { name, email, phone, message } = req.body;

  const data = {
    name: name,
    email: email,
    phone: phone,
    message: message,
  };

  db.query("INSERT INTO contact_form_data set ?", data, (err, rows, fields) => {
    if (err) {
      console.error(err);
      res.send(err);
      return;
    } else {
      console.log(rows);
      res.send("added");
    }
  });

  console.log(req.body);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amankapil60@gmail.com", // Replace with your own email address
      pass: "qtswjzzghiggvnze", // Replace with your own email password
    },
  });
  // zcgdsscknnjxmjlh
  const mailOptions = {
    from: "amankapil60@gmail.com", // Replace with your own email address
    to: "aman@codelinear.com", // Replace with the recipient's email address
    subject: "New message from your website",
    text: `FristName: ${name}\n Email: ${email}\n phone: ${phone}\nMessage: ${message}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
};
export const BookAdemo = (req, res) => {
  const { name, email, phone, company, companysize, role, perpose } = req.body;

  const data = {
    name: name,
    email: email,
    phone: phone,
    company: company,
    companysize: companysize,
    role: role,
    perpose: perpose,
  };

  db.query("INSERT INTO demo_book set ?", data, (err, rows, fields) => {
    if (err) {
      console.error(err);
      res.send(err);
      return;
    } else {
      console.log(rows);
      res.send("added");
    }
  });

  console.log(req.body);
  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: "amankapil60@gmail.com", // Replace with your own email address
  //     pass: "qtswjzzghiggvnze", // Replace with your own email password
  //   },
  // });
  // // zcgdsscknnjxmjlh
  // const mailOptions = {
  //   from: "amankapil60@gmail.com", // Replace with your own email address
  //   to: "rcky876@gmail.com", // Replace with the recipient's email address
  //   subject: "New message from your website",
  //   text: `FristName: ${name}\n Email: ${email}\n phone: ${phone}\company: ${company} \companysize: ${companysize}\n role: ${role}\n perpose: ${perpose}`,
  // };
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.error(error);
  //     res.status(500).send("Error sending email");
  //   } else {
  //     console.log("Email sent:", info.response);
  //     res.status(200).send("Email sent successfully");
  //   }
  // });
};
export const Register = (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists in the database
  db.query(
    "SELECT * FROM register WHERE email = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Registration failed" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Insert the new user into the database
      db.query(
        "INSERT INTO register (email, password) VALUES (?, ?)",
        [username, hashedPassword],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Registration failed" });
          }
          res.status(200).json({ message: "Registration successful" });
        }
      );
    }
  );
};

export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    db.query(
      "SELECT * FROM register WHERE email = ?",
      [username],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Login failed" });
        }

        const user = results[0]; // Assuming the query returns a user

        if (!user || !bcrypt.compareSync(password, user.password)) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ username }, "jsadlkjhfwery39e8udhsl");
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const addName = (req, res) => {
  try {
    const { Name } = req.body;
    const data = {
      Name: Name,
    };

    db.query(
      "INSERT INTO user_name_profile set ?",
      data,
      (err, rows, fields) => {
        if (err) {
          console.error(err);
        } else {
          console.log(rows);
          res.send("added");
        }
      }
    );
  } catch (err) {}
  // Check if the user already exists in the database
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
// Send OTP via email
const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amankapil60@gmail.com", // Replace with your own email address
      pass: "qtswjzzghiggvnze", // Replace with your own email password
    },
  });

  const mailOptions = {
    from: "amankapil60@gmail.com",
    to: email,
    subject: "Forgot Password OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOtp = (req, res) => {
  // const {""} = req.body;
  // const user = users.find((u) => u.email === email);

  // if (!user) {
  //   return res.status(404).json({ message: "User not found" });
  // }

  const otp = generateOTP();
  // user.otp = otp;

  sendOTP("aman@codelinear.com", otp)
    .then(() => {
      res.json({ message: "OTP sent successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error sending OTP" });
    });
};

export const Forgotpass = (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // In a real-world scenario, update the user's password in the database
  user.password = newPassword;
  user.otp = null;

  res.json({ message: "Password reset successfully" });
};

export const getUserEmail = (req, res) => {
  // app.get("", (req, res) => {
  // db.query("SELECT * FROM home_page", (err, rows, fields) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(rows);
  //     let rve = rows.reverse();
  //     const erve = rve[0];
  //   }
  // });
  // res.send("aman@codelinear.com");
  // console.log("welcome");
  // });
};
export const searchh = async (req, res) => {
  try {
    const { queryy } = req.body;

    console.log(queryy);
    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page in the browser
    const page = await browser.newPage();

    // Navigate to Google and perform a search
    await page.goto(`https://www.google.com/search?q=${queryy}`);

    // Extract search results
    const results = await page.evaluate(() => {
      const anchors = document.querySelectorAll("a");
      const searchResults = [];

      anchors.forEach((anchor) => {
        const title = anchor.textContent.trim();
        const url = anchor.href;

        if (title && url) {
          searchResults.push({ title, url });
        }
      });

      return searchResults;
    });

    // Close the browser
    await browser.close();

    // Send the search results back to the client
    res.json({ results });
  } catch (error) {
    console.error("Error in search logic:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ///////////////////////book a demo
export const getBookData = (req, res) => {
  // app.get("", (req, res) => {
  db.query("SELECT * FROM demo_book", (err, rows, fields) => {
    if (err) {
      console.error(err);
    } else {
      let rve = rows.reverse();
      res.send(rve);
    }
  });
  // console.log("welcome");
  // });
};
export const getContactData = (req, res) => {
  // app.get("", (req, res) => {
  db.query("SELECT * FROM contact_form_data", (err, rows, fields) => {
    if (err) {
      console.error(err);
    } else {
      let rve = rows.reverse();
      res.send(rve);
    }
  });
  // console.log("welcome");
  // });
};
