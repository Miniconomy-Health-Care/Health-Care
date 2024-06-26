export const authLogin = () => {
    const authUrl = "https://healthcare.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=51f1nkpuikhom6vgctu3qfmiki&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000"
    window.location.href = authUrl;
}