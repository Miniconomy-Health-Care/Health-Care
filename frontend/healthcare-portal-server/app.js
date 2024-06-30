const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const { CognitoJwtVerifier } = require('aws-jwt-verify');


var authMiddleware = function(req, res, next) {
  if(req.url === "/"){
    res.redirect('/Home');
    return;

  }
  next();
};

const app = express();
app.use(authMiddleware, express.static(path.join(__dirname, 'build')));
app.use(cookieParser());

app.get('/test', function (req, res) {
    res.send('Health Care Portal Working!');
});

app.get('*', async (req, res) => {
  const code = req.query.code;

  // users can access the home page without being authenticated
  if(req.url === "/Home"){
    index = fs.readFileSync(path.join(__dirname, 'build', 'index.html'));
    res.writeHead(200);
    res.write(index);
    res.send();

  }
  else{

    if (code) {
      let token = await getToken(code);
      res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 });
      res.redirect('/Home');

    }
    else{

      if(req.cookies && req.cookies.jwt){
        let isTokenValid = await verifyToken(req.cookies.jwt);

        if(isTokenValid){
          index = fs.readFileSync(path.join(__dirname, 'build', 'index.html'));
          res.writeHead(200);
          res.write(index);
          res.send();

        }
        else{
          res.writeHead(403);
          res.write("Forbidden");
          res.send();

        }
      }
      else{
          res.writeHead(403);
          res.write("Forbidden");
          res.send();

      }
    }
  }
});

app.listen(8080, function() {
  console.log('Server running on port %s', 8080);
});

const getToken = async (code) => {

  const formData = new URLSearchParams();
  formData.append("grant_type", "authorization_code");
  formData.append("client_id", "51f1nkpuikhom6vgctu3qfmiki");
  formData.append("code", code);
  formData.append("redirect_uri", "http://localhost:8080/Home");

  const response = await fetch('https://healthcare.auth.eu-west-1.amazoncognito.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  const responseData = await response.json();

  return responseData.access_token;
}

const verifyToken = async (token) => {

  const verifier = CognitoJwtVerifier.create({
    userPoolId: "eu-west-1_aWn2igcWJ",
    tokenUse: "access",
    clientId: "51f1nkpuikhom6vgctu3qfmiki",
  });

  try {
    const payload = await verifier.verify(token);
    return true;
  } catch {
    return false;
  }

}