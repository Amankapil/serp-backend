"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _controller = require("../controller/controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // router.get("/", getweb);
// router.post("/add", addWebInfo);
// router.post("/login", Login);


router.post("/send_mail", _controller.sendMailContact);
router.post("/send_mail_book", _controller.BookAdemo);
router.post("/register", _controller.Register);
router.post("/login", _controller.Login);
router.post("/faq", _controller.faq); // router.post("/generate-faq", (req, res) => {
//   const { paragraph } = req.body;
//   const questions = generateQuestions(paragraph);
//   res.json(questions);
// });
// router.post("/send_mail_career", sendMailCareer);

var _default = router;
exports["default"] = _default;