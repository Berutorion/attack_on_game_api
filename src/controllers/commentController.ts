import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Comment } from '@/models/Comment';
import { getUser } from '@/utils/help';
import User from '@/models/User';
import EventModel from '@/models/EventModel';
import { Store } from '@/models/Store';
import { request } from 'websocket';

// GET 取得活動留言板資訊 - Create comment & GET comment?

export const getComments = async (req: Request, res: Response) => {
  // check validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors);
    return;
  }
  try {
    const eventId = req.params.eventId;
    const contents = await Comment.find({ eventId: eventId });
    // check if comment exist
    if (!contents || contents.length == 0) {
      return res.status(404).send({ message: 'Comments not found!' });
    }
    // check if Event exist
    const eventExist = await EventModel.findOne({ idNumber: eventId });
    if (!eventExist) {
      return res.status(404).send({ message: 'Event not found!' });
    }

    res.status(200).send({
      success: true,
      message: '留言板資訊取得成功',
      contents: contents,
    });
  } catch (error) {
    res.status(500).send({ message: 'Error creating comment', error: error });
    console.log({ message: 'Error creating comment', error: error });
  }
};

// POST 建立留言 （玩家）
export const createComment = async (req: Request, res: Response) => {
  // check validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors);
    return;
  }
  try {
    const { content } = req.body;
    const author = getUser(req)._id;
    const eventId = req.params.eventId;
    // check if User exist
    const userExist = await User.findById(author);
    if (!userExist) {
      return res.status(404).send({ message: 'User not found!' });
    }
    // check if Event exist
    const eventExist = await EventModel.findOne({ idNumber: eventId });
    if (!eventExist) {
      return res.status(404).send({ message: 'Event not found!' });
    }
    // checke if role of user is "player"
    const userRole = await User.findById(author);
    if (userRole?.role !== 'player') {
      return res
        .status(404)
        .send({ message: 'The role of user is not player!' });
    }
    // generate "type" filed
    const typeValue = 'Comment';
    const massageExist = null;
    const storeId = null;
    const comment = await Comment.create({
      author,
      eventId,
      storeId: storeId,
      content,
      createdAt: Date.now(),
      type: typeValue,
      messageId: massageExist,
    });
    res.status(201).send({ success: true, message: '留言建立成功', comment });
  } catch (err) {
    res.status(500).send({ message: 'Error creating comment', error: err });
    console.log({ message: 'Error creating comment', error: err });
  }
};

// POST 回覆留言

export const createReply = async (req: Request, res: Response) => {
  // check validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors);
    return;
  }
  try {
    const { content } = req.body;
    const author = getUser(req)._id;
    const eventId = req.params.eventId;
    const messageId = req.params.messageId;
    const store = await Store.findOne({ user: author });
    const storeId = store?._id;
    // check if User exist
    const userExist = await User.findById(author);
    if (!userExist) {
      return res.status(404).send({ message: 'User not found!' });
    }
    // check if Event exist
    const eventExist = await EventModel.findOne({ idNumber: eventId });
    if (!eventExist) {
      return res.status(404).send({ message: 'Event not found!' });
    }
    // check if role of user is "store"
    const userRole = await User.findById(author);
    if (userRole?.role !== 'store') {
      return res
        .status(404)
        .send({ message: 'The role of user is not store!' });
    }

    // check if message Exist
    const messageExist = await Comment.findById(messageId);
    if (!messageExist) {
      return res.status(404).send({ message: 'Comment not found!' });
    }
    // generate "type" filed
    const typeValue = 'reply';
    const comment = await Comment.create({
      author,
      eventId,
      storeId: storeId,
      content,
      createdAt: Date.now(),
      type: typeValue,
      messageId: messageId,
    });
    res.status(201).send({ success: true, message: '留言建立成功', comment });
  } catch (err) {
    res.status(500).send({ message: 'Error creating comment', error: err });
    console.log({ message: 'Error creating comment', error: err });
  }
};
