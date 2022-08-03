import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        res.status(401).json('you are not authentication');
    } else {

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
            if (err) {
                res.status(500).json(err)
            } else {
                req.user = user;
                next();
            }
        })
    }
}

export const verifyTokenAndAuthorizationAsAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!(req.user.isAdmin)) {
            res.status(400).json('you are not allowed to do that');
        } else {
            next();
        }
    })
}

export const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!(req.user.isAdmin || req.params.id === req.user.id)) {
            res.status(400).json('you are not allowed to do that');
        } else {
            next();
        }
    })
}

