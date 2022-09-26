const router = require('express').Router();
const thoughRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');

router.use('/thoughts', thoughRoutes);
router.use('/users', userRoutes);

module.exports = router;