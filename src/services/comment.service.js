'use strict'

const { NotFoundError } = require('../core/error.response')
const Comment = require('../models/comment.model')
const { findProduct } = require('../models/repositories/product.repo')
const { convertToObjectIdMongodb } = require('../utils')

class CommentService {
    static async createComment({
        productId, userID, content, parentCommentId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userID: userID,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue
        if (parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Parent comment not found')

            rightValue = parentComment.comment_right

            // Update right values of comments to the right of the parent comment
            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            // Update left values of comments to the right of the parent comment
            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })
        } else {
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectIdMongodb(productId)
            }, 'comment_right', { sort: { comment_right: -1 } })
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        // Insert the new comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0 //skip
    }) {
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Parent comment not found')
            const comments = await Comment.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lte: parentComment.comment_right },
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1,
            })

            return comments
        }

        const comments = await Comment.find({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_parentId: parentCommentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1,
        })

        return comments

    }
    //delete comments
    static async deleteComment({ productId, commentId }) {
        //check the product exists in the database
        const foundProduct = await findProduct({
            product_id: productId
        })
        if (!foundProduct) throw new NotFoundError('Product not found')
        //1. xac dinh gia tri left va right of commentId
        console.log(commentId)  
        const comment = await Comment.findById(commentId)
        console.log(comment)  

        if (!comment) throw new NotFoundError('Comment not found')

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right
        //2. tinh width
        const width = rightValue - leftValue + 1;
        //3 xoa tat ca commentId con
        await Comment.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gte: leftValue, $lte: rightValue }
        })
        //4. cap nhat gia tri left va right con lai
        await Comment.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -width }
        })

        await Comment.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -width }
        })
        return true;


    }


}


module.exports = CommentService
