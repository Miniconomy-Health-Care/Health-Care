const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const authMiddleware = function (req, res, next) {
  if(req.url === "/"){
    res.redirect('/Home');
    return;

  }
  next();
};

const app = express();
const clientId = '51f1nkpuikhom6vgctu3qfmiki'
const userPoolId = "eu-west-1_aWn2igcWJ"
const redirectUri = process.env.HEALTHCARE_REDIRECT_URI ?? "http://localhost:8080/Home"

app.use(authMiddleware, express.static(path.join(__dirname, 'build')));
app.use(cookieParser());

app.get('/test', (req, res) => {
    res.send('Health Care Portal Working!');
});

app.get('/verifyToken', async (req, res) => {

  let response = {};
  if(req.cookies && req.cookies.jwt){
    let isTokenValid = await verifyToken(req.cookies.jwt);

    response = {
      valid: isTokenValid
    };
  }
  else{
    response = {
      valid: false
    };
  }

  res.json(response);
  
});


app.get('*', async (req, res) => {
  const code = req.query.code;
    if (code) {
      let token = await getToken(code);
      res.cookie('jwt', token, { httpOnly: false, secure: true, maxAge: 3600000 });
      res.redirect('/Home');
      return;
    } else if (req.cookies && req.cookies.jwt) {
        let isTokenValid = await verifyToken(req.cookies.jwt);

      if (isTokenValid) {
          index = fs.readFileSync(path.join(__dirname, 'build', 'index.html'));
          res.writeHead(200);
          res.write(index);
          res.send();
        return;
        }
    }

  const loginUrl = `https://healthcare.auth.eu-west-1.amazoncognito.com/login?client_id=51f1nkpuikhom6vgctu3qfmiki&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(redirectUri)}`
  res.redirect(loginUrl);
});

app.listen(8080, () => {
  console.log('Server running on port %s', 8080);
});

const getToken = async (code) => {

  const formData = new URLSearchParams();
  formData.append("grant_type", "authorization_code");
  formData.append("client_id", clientId);
  formData.append("code", code);
  formData.append("redirect_uri", redirectUri);

  const response = await fetch('https://healthcare.auth.eu-west-1.amazoncognito.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  const responseData = await response.json();

  return responseData.id_token;
}

const verifyToken = async (token) => {

  const verifier = CognitoJwtVerifier.create({
    userPoolId: userPoolId,
    tokenUse: "id",
    clientId: clientId,
  });

  try {
    await verifier.verify(token);
    return true;
  } catch {
    return false;
  }

}
