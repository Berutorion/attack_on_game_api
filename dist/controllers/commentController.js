"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReply = exports.createComment = exports.getComments = void 0;
const express_validator_1 = require("express-validator");
const Comment_1 = require("@/models/Comment");
const help_1 = require("@/utils/help");
const User_1 = __importDefault(require("@/models/User"));
const EventModel_1 = __importDefault(require("@/models/EventModel"));
const Store_1 = require("@/models/Store");
// GET 取得活動留言板資訊 - Create comment & GET comment?
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check validation result
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
    }
    try {
        const eventId = req.params.eventId;
        const contents = yield Comment_1.Comment.find({ eventId: eventId });
        // check if comment exist
        if (!contents || contents.length == 0) {
            return res.status(404).send({ message: 'Comments not found!' });
        }
        // check if Event exist
        const eventExist = yield EventModel_1.default.findOne({ idNumber: eventId });
        if (!eventExist) {
            return res.status(404).send({ message: 'Event not found!' });
        }
        res.status(200).send({
            success: true,
            message: '留言板資訊取得成功',
            contents: contents,
        });
    }
    catch (error) {
        res.status(500).send({ message: 'Error creating comment', error: error });
        console.log({ message: 'Error creating comment', error: error });
    }
});
exports.getComments = getComments;
// POST 建立留言 （玩家）
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check validation result
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
    }
    try {
        const { content } = req.body;
        const author = (0, help_1.getUser)(req)._id;
        const eventId = req.params.eventId;
        // check if User exist
        const userExist = yield User_1.default.findById(author);
        if (!userExist) {
            return res.status(404).send({ message: 'User not found!' });
        }
        // check if Event exist
        const eventExist = yield EventModel_1.default.findOne({ idNumber: eventId });
        if (!eventExist) {
            return res.status(404).send({ message: 'Event not found!' });
        }
        // checke if role of user is "player"
        const userRole = yield User_1.default.findById(author);
        if ((userRole === null || userRole === void 0 ? void 0 : userRole.role) !== 'player') {
            return res
                .status(404)
                .send({ message: 'The role of user is not player!' });
        }
        // generate "type" filed
        const typeValue = 'Comment';
        const massageExist = null;
        const storeId = null;
        const comment = yield Comment_1.Comment.create({
            author,
            eventId,
            storeId: storeId,
            content,
            createdAt: Date.now(),
            type: typeValue,
            messageId: massageExist,
        });
        res.status(201).send({ success: true, message: '留言建立成功', comment });
    }
    catch (err) {
        res.status(500).send({ message: 'Error creating comment', error: err });
        console.log({ message: 'Error creating comment', error: err });
    }
});
exports.createComment = createComment;
// POST 回覆留言
const createReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check validation result
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
    }
    try {
        const { content } = req.body;
        const author = (0, help_1.getUser)(req)._id;
        const eventId = req.params.eventId;
        const messageId = req.params.messageId;
        const store = yield Store_1.Store.findOne({ user: author });
        const storeId = store === null || store === void 0 ? void 0 : store._id;
        // check if User exist
        const userExist = yield User_1.default.findById(author);
        if (!userExist) {
            return res.status(404).send({ message: 'User not found!' });
        }
        // check if Event exist
        const eventExist = yield EventModel_1.default.findOne({ idNumber: eventId });
        if (!eventExist) {
            return res.status(404).send({ message: 'Event not found!' });
        }
        // check if role of user is "store"
        const userRole = yield User_1.default.findById(author);
        if ((userRole === null || userRole === void 0 ? void 0 : userRole.role) !== 'store') {
            return res
                .status(404)
                .send({ message: 'The role of user is not store!' });
        }
        // check if message Exist
        const messageExist = yield Comment_1.Comment.findById(messageId);
        if (!messageExist) {
            return res.status(404).send({ message: 'Comment not found!' });
        }
        // generate "type" filed
        const typeValue = 'reply';
        const comment = yield Comment_1.Comment.create({
            author,
            eventId,
            storeId: storeId,
            content,
            createdAt: Date.now(),
            type: typeValue,
            messageId: messageId,
        });
        res.status(201).send({ success: true, message: '留言建立成功', comment });
    }
    catch (err) {
        res.status(500).send({ message: 'Error creating comment', error: err });
        console.log({ message: 'Error creating comment', error: err });
    }
});
exports.createReply = createReply;
//# sourceMappingURL=commentController.js.map