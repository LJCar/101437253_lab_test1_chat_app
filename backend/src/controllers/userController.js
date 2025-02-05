const User = require('../models/User');

const signup = async (req, res) => {
    const { username, firstName, lastName, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already taken' });

        const user = new User({ username, firstName, lastName, password});
        await user.save();
        res.status(201).json({ message: 'User created successfully', userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username } );
        if (!user) return res.status(400).json({ message: 'Invalid username or password' });

        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

module.exports = { signup, login };