import jwt from 'jsonwebtoken';
import { AuthError, InvalidAuthError, InvalidRequestError } from '../helpers/errorHandler.js'

const secret = process.env.JWT_SECRET;

export default class User {
    constructor(model) {
        this.model = model;
    }

    createUser = async (req, res, next) => {
        try {

            const { name, email, password } = req.body;

            await this.model.create({ name, email, password })

            res.status(201).end();

        } catch (error) { next(error) }
    }

    loginUser = async (req, res, next) => {
        try {

            const credentials = req.headers['authorization'];

            if (!credentials || credentials.split(' ')[0] !== 'Basic') throw new InvalidAuthError();

            const [email, password] = Buffer.from(credentials.split(' ')[1], 'base64').toString().split(':');

            if (!(email && password)) throw new InvalidAuthError();

            const user = await this.model.findOne({ email: email });
            if (!user) throw new AuthError('user');

            if (! await user.verifyPassword(password)) throw new AuthError('password');

            const token = jwt.sign({
                id: user.id,
                name: user.name,
                email: user.email
            }, secret, { expiresIn: '1h' })

            res.json({
                token: token,
                expire: new Date(jwt.decode(token).exp * 1000).toString()
            });

        } catch (error) { next(error) }
    }

    sayWelcome = (req, res, next) => res.json({ message: 'Welcome ' + req.user.name });

    static authenticate(req, res, next) {

        const credentials = req.headers['authorization'];

        if (!credentials || credentials.split(' ')[0] !== 'Bearer') throw new InvalidAuthError();

        const token = credentials.split(' ')[1];

        if (!token) throw new InvalidAuthError();

            const { id, name, email } = jwt.verify(token, secret);

            req.user = { id, name, email }

            next();

    }
}

export const authenticate = User.authenticate;