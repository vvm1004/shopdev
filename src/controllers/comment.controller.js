'use strict'

const CommentService = require('../services/comment.service.js')
const { SuccessResponse } = require('../core/success.response')

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new comment',
            metadata: await CommentService.createComment(req.body)  // Sửa tên hàm ở đây
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'getCommentsByParentId',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'deleteComment',
            metadata: await CommentService.deleteComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()
