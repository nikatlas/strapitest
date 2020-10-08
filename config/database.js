module.exports = ({ env }) => {
  if(!env('DATABASE_HOST')){
    return ({
      "defaultConnection": "default",
      "connections": {
        "default": {
          "connector": "bookshelf",
          "settings": {
            "client": "sqlite",
            "filename": ".tmp/data.db"
          },
          "options": {
            "useNullAsDefault": true,
            debug: false
          }
        }
      }
    });
  } else {
    return {
      "defaultConnection": "default",
      "connections": {
        "default": {
          "connector": "bookshelf",
          "settings": {
            "client": "sqlite",
            "host": env('DATABASE_HOST', '127.0.0.1'),
            "port": env.int('DATABASE_PORT', 27017),
            "database": env.int('DATABASE_PORT', 5432),
            "username": env('DATABASE_USERNAME', 'strapi'),
            "password": env('DATABASE_PASSWORD', 'strapi')
          },
          "options": {}
        }
      }
    }
  }

};
// {
//   defaultConnection: 'default',
//   connections: {
//     default: {
//       connector: 'bookshelf',
//       settings: {
//         client: 'postgres',
//         host: env('DATABASE_HOST', 'localhost'),
//         port: env.int('DATABASE_PORT', 5432),
//         database: env.int('DATABASE_PORT', 5432),
//         username: env('DATABASE_USERNAME', 'strapi'),
//         password: env('DATABASE_PASSWORD', 'strapi'),
//         schema: 'public',
//       },
//       options: {},
//     },
//   },
// });