exports.up = function (knex) {
    return knex.schema
        .createTable('stocks', tbl => {
            //create TABLE stocks
            tbl.increments();
            tbl.string('symbol', 5)
                .unique()
                .notNullable()
                .index()
                .primary();
            tbl.string('name')
                .notNullable();
            tbl.string('marketName')
                .notNullable();
            tbl.string('sector')
                .notNullable();
            tbl.string('industry')
                .notNullable();
            tbl.string('description');
            tbl.string('currency');
            tbl.string('website');
            tbl.string('logoUrl');
        }).createTable('dailyPrice', tbl => {
            //create TABLE dailyPrice
            tbl.increments();
            tbl.string('symbol', 4)
                .references('symbol')
                .inTable('stocks')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            tbl.string('dayDate')
                .notNullable();
            tbl.float('closePrice')
                .notNullable();
            tbl.float('change');
            tbl.float('changePercent');
        }).createTable('statuses', tbl => {
            //create TABLE statuses
            tbl.increments();
            tbl.string('statusName')
                .notNullable();
        }).createTable('stockStatus', tbl => {
            //create TABLE stockStatus
            tbl.increments();
            tbl.string('symbol')
                .references('symbol')
                .inTable('stocks')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            tbl.date('fromDate')
                .notNullable();
            tbl.date('toDate')
                .notNullable();
            tbl.integer('statusId')
                .references('id')
                .inTable('statuses')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
};

exports.down = function (knex) {
    //drop tables if it has already been created
    return knex.schema
        .dropTableIfExists('stocks')
        .dropTableIfExists('dailyPrice')
        .dropTableIfExists('statuses')
        .dropTableIfExists('stockStatus');
};