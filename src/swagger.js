import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentação da API usando Swagger',
        },
    },
    apis: ['./src/*.js'],
};

const specs = swaggerJSDoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    app.get('/api-docs.json', (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(specs);
    });
}

export default setupSwagger;