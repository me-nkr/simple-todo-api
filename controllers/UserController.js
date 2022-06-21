import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secret = process.env.JWT_SECRET;

export default class {
    constructor(model) {
        this.model = model;
    }

    createUser = async (req, res, next) => {
        const { name, email, password } = req.body;
        if (!(name && email && password)) res.status(400).json({ message: 'invalid request' });

        else {

            try {

                const user = new this.model()

                user.name = name;
                user.email = email;

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                await user.save();
                res.status(201).end();

            }
            catch (error) {
                res.status(500).json({ message: 'something went wrong' });
            }

        }
    }

    loginUser = async (req, res, next) => {
        const { name, email, password } = req.body;
        if (!(name && email && password)) res.status(400).json({ message: 'invalid request' });

        else {

            try {

                const user = await this.model.findOne({ email: email });
                if (!user) return res.status(403).json({ message: 'Unauthorized' });

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) return res.status(403).json({ message: 'Unautorized' });

                const token = jwt.sign({
                    name: user.name,
                    email: user.email
                }, secret, { expiresIn: 60})

                res.json({
                    token: token,
                    expire: Date(jwt.decode(token).exp)
                });

            }
            catch (error) {
                res.status(500).json({ message: 'something went wrong' });
            }
        }
    }

    sayWelcome = async (req, res, next) => {
        const token = req.headers['authorization'].split(' ')[1]

        if (!token) return res.status(403).json({ message: 'Unauthorized' });

        try {

            const data = jwt.verify(token, secret);

            res.json({ message: 'Welcome ' + data.name });

        }
        catch(error) {
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') return res.status(403).json({ message: 'Unathorized' });
            else res.status(500).json({ message: 'something went wrong' });
        }

    }
}