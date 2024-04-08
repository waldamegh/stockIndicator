#!/bin/bash
npx knex migrate:latest
npx knex seed:run