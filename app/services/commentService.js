const Comment=require('./../models/Comment');

const create = async (data) => {
    return await new Comment({
        user: data.userId,
        post: data.postId,
        comment: data.comment,
    }).save();
};
const getCommentsPerPost = async (postId) => {
    return await Comment.find({
        post: postId,
    }).select({comment : 1});
}
const update = async (id, data) => {
    const comment = await Comment.findById(id);
    if (!comment) {
        throw new Error('Comment Not found!');
    }
    const updatedComment = await Comment.updateOne(
        {_id: comment.id},
        {
            $set: {
                comment: data.comment,
            },
        },
        { new: true }
    );
    return {
        comment: updatedComment,
    };
};
const deleteComment = async (id) => {
    const comment = await Comment.findById(id);
    if (!comment) {
        throw new Error('Comment Not found');
    }
    await Comment.deleteOne({ _id: id });
    return {
        comment,
    };
};
const checkIfUserIsAuth = async (user, id) => {
    return (
        user.role == 'admin' ||
        (await Comment.findOne({
            id,
            user: user.id,
        }))
    );
};

//here
const createReply=async(data)=>{
	const reply= await new Comment({
        user: data.userId,
        post: data.postId,
        comment: data.comment,
		replyTo:data.replyTo
    }).save();
	return reply;
}

const updateReply = async (replyId, data) => {
    const reply = await Comment.findById(replyId);
    if (!reply) {
        throw new Error('Reply Not found!');
    }
    const updatedReply = await Comment.updateOne(
        {_id: reply.id},
        {
            $set: {
                comment: data.comment,
            },
        },
        { new: true }
    );
    return {
        comment: updatedReply,
    };
};

const deleteReply = async (replyTo) => {
    const reply = await Comment.findById(replyTo);
    if (!reply) {
        throw new Error('Reply Not found');
    }
    await Comment.deleteOne({ _id: replyTo });
    return {
        reply,
    };
};

const readComentsAndReplies=async (comentId)=>{
const comments=await Comment.find({_id:comentId});
const replies=await Comment.find({replyTo:comentId});
return{
	comments,
	replies
}
}

module.exports = {
    create,
    getCommentsPerPost,
    update,
    deleteComment,
    checkIfUserIsAuth,
	createReply,
	updateReply,
	deleteReply,
	readComentsAndReplies
};