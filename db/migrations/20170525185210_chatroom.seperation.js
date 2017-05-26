exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('chatRooms', function(table){
      table.increments('id').primary()
      table.string('name')
    }),
    knex.schema.createTable('userRooms', function(table){
      table.increments('id').primary()
      table.integer('room_id')
      table.integer('user_id')
    }),
    knex.schema.table('chats', function(table) {
      table.dropColumn('room')
      table.integer('room_id')
    })
  ])
}

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('chatRooms'),
    knex.schema.dropTable('userRooms'),
    knex.schema.table('chats', function(table) {
      table.dropColumn('room_id')
      table.string('room')
    })
  ])
}
