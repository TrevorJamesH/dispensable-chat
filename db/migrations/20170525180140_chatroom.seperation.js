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
    })
  ])
}

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('chatRooms'),
    knex.schema.dropTable('userRooms'),
    knex.schema.table('chats', function(table) {
      table.string('room')
    })
  ])
}
