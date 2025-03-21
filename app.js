import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import { PORT } from './config/env.js'
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import bookRouter from "./routes/book.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDatabase from "./database/db.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();



// const swaggerOptions = {
//     swaggerDefinition: {
//         openapi: '3.0.1',
//         info: {
//             version: '1.0.0',
//             title: 'Library API Documentation',
//             description: 'Library API Documentation',
//             contact: {
//                 name: 'Timileyin',
//             },
//         },
//         servers: [
//             {
//                 url: "http://localhost:5500",
//                 description: "Local server"
//             }
//         ],
//         components: { 
//             securitySchemes: {
//                 bearerAuth: {
//                     type: "http",
//                     scheme: "bearer",
//                     bearerFormat: "JWT"
//                 }
//             }
//         },
//         security: [  
//             {
//                 bearerAuth: []
//             }
//         ],
//         schemes: ['http', 'https'],
//     },
//     apis: ['./routes/*.js'] 
// };
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.1',
        info: {
            version: '1.0.0',
            title: 'Library API Documentation',
            description: `
            LIBRARY API DOCUMENTATION INSTRUCTIONS

            Welcome to the Library API! This API allows you to manage books,
             including adding, retrieving, updating, and deleting them.
            
            SERVERS
            - Local server: http://localhost:5500
            - Production server: https://library-api-v2q4.onrender.com
            Make sure to switch between servers as needed.

            AUTHENTICATION  
            - Some routes require a BEARER TOKEN (JWT) for authentication. 
            - To get a token, register or login with the example in the enpoints.
            - Copy the token from the response. 
            - Use the AUTHORIZE button in Swagger UI to add your token.  

            FEATURES  
            - CRUD Operations on books  
            - User Authentication (Login/Register)  
            - JWT-Based Security for protected routes  

            `,
            contact: {
                name: 'Timileyin',
            },
        },
        servers: [
            {
                url: "https://library-api-v2q4.onrender.com",
                description: "Production server"
            },
            {
                url: "http://localhost:5500",
                description: "Local server"
            }
            
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                User: {  
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        id: {
                            type: "string",
                            example: "65f5bfc38f0c1a001e8b4a2c"
                        },
                        name: {
                            type: "string",
                            example: "John Doe"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "john.doe@example.com"
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "securepassword123"
                        }
                    }
                },
                Book: {  
                    type: "object",
                    required: ["name", "pages", "author", "owner", "status", "genre"],
                    properties: {
                        id: {
                            type: "string",
                            example: "65f5bfc38f0c1a001e8b4a3d"
                        },
                        name: {
                            type: "string",
                            example: "The Art of War"
                        },
                        pages: {
                            type: "number",
                            example: 250
                        },
                        author: {
                            type: "string",
                            example: "Sun Tzu"
                        },
                        owner: {
                            $ref: "#/components/schemas/User" 
                        },
                        status: {
                            type: "string",
                            enum: ["Available", "Borrowed"],
                            example: "Available"
                        },
                        genre: {
                            type: "string",
                            enum: ["war", "technology", "sport", "history", "politics"],
                            example: "war"
                        },
                        borrowed_by: {
                            $ref: "#/components/schemas/User",
                            nullable: true,
                            description: "The user who borrowed the book (if any)"
                        }
                    }
                }
            }
        },
        schemes: ['http', 'https'],
    },
    apis: ['./routes/*.js'] 
};



const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/books', bookRouter)

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Library API</title>
        </head>
        <body>
            <div style="text-align: center; margin-top: 20px; border: 1px solid gray; padding: 20px; border-radius: 5px;">
                <h1>Welcome to the Library API</h1>
                <p>This API allows you to manage books, including adding, retrieving, updating, and deleting them.</p>
                <p><a href="/api-docs/">Swagger API Documentation</a></p>
            </div>
        </body>
        </html>
    `)
})

app.listen(PORT, async () => {
    console.log('Library Server running on http://localhost:5500');
    await connectToDatabase();
})

export default app;