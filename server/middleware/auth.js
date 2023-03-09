import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");        //looking into the authorization header of the request

        if(!token) {
            return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();    //grabbing the actual token from the string
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);     //token is verified against the secret string
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

