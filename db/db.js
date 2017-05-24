const Knex = require('knex')
const env = 'development'
const knex = Knex(require('./knexfile.js').development)

const getAllChatsByRoom = (room) => {
  return knex
  .table('chats')
  .where('room', room)
  .returning('*')
}

const postChat = (chat, room, user) => {
  return knex
  .table('chats')
  .insert({
    chat: chat,
    user: user,
    room: room
  })
  .returning('*')
}

const getAllRooms = () => {
  return knex
  .table('chats')
  .distinct('room')
  .select()
}

module.exports = {
  postChat, getAllChatsByRoom, getAllRooms
}
