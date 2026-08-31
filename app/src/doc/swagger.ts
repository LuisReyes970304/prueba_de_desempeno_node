/**
 * OpenAPI specification for the hybrid cryptography demo API.
 */
export const options = {
    definition: {
        openapi: "3.0.0",
        info: {
        title: "NODE Sequelise Express API",
        version: '1.0.0',
        },
        servers: [
            {
                url: "/",
                description: "Same origin as the running server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ['./*.ts', './**/*.ts'], 
};