const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return {
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            googleId: payload.sub,
        };
    } catch (error) {
        console.error('Failed to verify Google token:', error.message);
        return null;
    }
};

module.exports = verifyGoogleToken;
