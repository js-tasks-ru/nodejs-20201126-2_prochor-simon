const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({user: ctx.user.displayName}).sort({ $natural: -1 }).limit(20);
  ctx.body = { messages: messages.map(mapMessage) };
};
