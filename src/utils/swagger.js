const optionsSwagger = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'Dokumentasi API APP Desa',
    },
    servers: [
      {
        url: 'http://localhost:5001',
      },
    ],
  },
  apis: ['./src/routers/*.js'],
};

export default optionsSwagger;
