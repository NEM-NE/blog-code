const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/authorize", (req, res) => {
  res.redirect(
    `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}`
  );
});

router.get("/login", async (req, res) => {
  const { code } = req.query;
  const bodyData = {
    grant_type: "authorization_code",
    client_id: process.env.REST_API_KEY,
    redirect_uri: process.env.REDIRECT_URI,
    client_secret: process.env.SECRET,
    code,
  };

  const queryStringBody = Object.keys(bodyData)
    .map((k) => encodeURIComponent(k) + "=" + encodeURI(bodyData[k]))
    .join("&");

  const options = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  };

  const { data } = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    queryStringBody,
    options
  );

  console.log("token_type: ", data.token_type);
  console.log("access_token: ", data.access_token);
  console.log("expires_in: ", data.expires_in);
  console.log("refresh_token: ", data.refresh_token);
  console.log("refresh_token_expires_in: ", data.refresh_token_expires_in);

  const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  const { properties } = result.data;

  res.render("result", {
    nickname: properties.nickname,
    profile_image: properties.profile_image,
  });
});

module.exports = router;
