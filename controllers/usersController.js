const { Users, Thoughts } = require('../models');

module.exports = {
    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },

    getAllUsers(req, res) {
        User.find({})
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));

    },

  
    getUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user found with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((dbUserData) =>
                !dbUserData
                    ? res.status(404).json({ message: 'User not found with provided ID' })
                    : res.json(dbUserData)
            )
            .catch((err) => res.status(500).json(err));
    },
    
    deleteUser(req, res) {
        
        User.findOneAndDelete({ _id: req.params.id })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'User not found with provided ID' });
                }
                return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
            })
            .then(() => res.json({ message: 'User successfully deleted!' }))
            .catch((err) => res.status(500).json(err));
    },
  
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((dbUserData) =>
                !dbUserData
                    ? res.status(404).json({ message: 'User not found with provided ID' })
                    : res.json(dbUserData)
            )
            .catch((err) => res.status(500).json(err));
    },
  
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((dbUserData) =>
                !dbUserData
                    ? res.status(404).json({ message: 'User not found with provided ID' })
                    : res.json(dbUserData)
            )
            .catch((err) => res.status(500).json(err));
    }
};