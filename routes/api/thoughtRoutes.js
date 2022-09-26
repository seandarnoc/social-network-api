const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/videoController');

// /api/videos
router.route('/').get(getThoughts).post(createThought);

// /api/videos/:videoId
router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

// /api/videos/:videoId/responses
router.route('/:thoughtId/responses').post(addReaction);

// /api/videos/:videoId/responses/:responseId
router.route('/:thoughtId/responses/:reactionId').delete(removeReaction);

module.exports = router;