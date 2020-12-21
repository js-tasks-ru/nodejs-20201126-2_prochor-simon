const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
        usernameField: 'email',
        session: false
    },
    async function(email, password, done) {
        try {
            const user = await User.findOne({email});
            if (!user) {
                throw new Error('Нет такого пользователя');
            }

            const isCorrectPass = await user.checkPassword(password);
            if (!isCorrectPass) {
                throw new Error('Неверный пароль');
            }
            done(null, user);
        } catch (error) {
            done(null, false, error.message);
        }
    },
);