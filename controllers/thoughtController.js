const { Thought, User } = require('../models');

module.exports = {
 
  getThoughts(req, res) {
    Thought.find({})
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  
 
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

 
  createThought(req, res) {
          Thought.create(req.body)
          .then(({ _id }) => {
              return User.findOneAndUpdate(
                  { _id: req.body.userId },
                  { $addToSet: { thoughts: _id } },
                  { new: true }
              );
          })
          .then(thought =>
              !thought
                  ? res.status(404).json({ message: 'No Thought found with provided ID' })
                  : res.json({ message: 'Thought successfully created!' })
          )
          .catch((err) => res.status(500).json(err));
  },
  
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
   },
  

  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Thought not found with this ID!" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Thought deleted >>> WARNING: NO USER FOUND'})
          : res.json({ message: 'Thought deleted' })
      )
      .catch((err) => res.status(500).json(err));
  },

  
  createReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body }},
        { runValidators: true, new: true }
    )
        .then((thought) => 
        !thought
            ? res.status(404).json({ message: 'Thought not found with this ID!'})
            : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
  },

   
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'Thought not found with this ID!'})
                : res.json(thought)
                )
                .catch((err) => res.status(500).json(err));
      },

};