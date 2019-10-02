const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('User');

let jwt = require('jsonwebtoken');
let hash = require('../middlewares/hash');

module.exports = {
    async login(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        const mocked = await User.findOne({ email });

        if (email && password && mocked != null) {
            if (email === mocked.email && password === mocked.password) {
                let token = jwt.sign({ email: email },
                    hash.secret,
                    { expiresIn: '24h' }
                );

                return res.json({
                    success: true,
                    message: 'Autenticado com sucesso!',
                    token: token,
                });
            } else {
                return res.json({
                    success: false,
                    message: 'Email ou senha incorreto!',
                });
            }
        } else {
            return res.json({
                success: false,
                message: 'Email não cadastrado!',
            });
        }
    }
}
