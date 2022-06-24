const router = require('express').Router();

const commentController = require("../controllers/commentController");
const isAuthenticated = require('./../middlewares/auth'); 


router.get('/:id/create',isAuthenticated,commentController.create);

router.put('/:id/edit', isAuthenticated, commentController.update);
router.delete(
	'/:id/delete',
	isAuthenticated,
	commentController.deleteComment
);


router.post('/createReply',isAuthenticated,commentController.createReply)
router.put('/:id/editReply', isAuthenticated, commentController.updateReply);
router.delete(
	'/:id/deleteReply',
	isAuthenticated,
	commentController.deleteReply
);
router.get('/all',commentController.readComentsAndReplies);

module.exports = router;
