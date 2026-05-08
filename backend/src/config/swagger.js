const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description:
        "Production-ready TaskFlow API with JWT authentication, account management, and task CRUD. Use the Register or Login endpoint first, then paste the returned token into the Authorize dialog as `Bearer <token>`."
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server"
      }
    ],
    tags: [
      { name: "Auth", description: "Authentication and session bootstrap" },
      { name: "Account", description: "Authenticated account management" },
      { name: "Tasks", description: "Authenticated task CRUD operations" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Paste the JWT access token returned by the auth endpoints."
        }
      },
      schemas: {
        ApiSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true }
          }
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            statusCode: { type: "integer", example: 422 },
            message: { type: "string", example: "Validation failed." },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", example: "field" },
                  msg: { type: "string", example: "Valid email is required." },
                  path: { type: "string", example: "email" },
                  location: { type: "string", example: "body" }
                }
              }
            }
          }
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "681c7edaf1138cf18b6d5b67" },
            name: { type: "string", example: "Aarav Patel" },
            email: { type: "string", example: "aarav@example.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            authProvider: { type: "string", enum: ["local", "google", "hybrid"], example: "local" },
            avatar: { type: "string", example: "" }
          }
        },
        AuthenticatedUser: {
          allOf: [
            { $ref: "#/components/schemas/User" },
            {
              type: "object",
              properties: {
                id: { type: "string", example: "681c7edaf1138cf18b6d5b67" },
                tokenVersion: { type: "integer", example: 0 }
              }
            }
          ]
        },
        Task: {
          type: "object",
          properties: {
            _id: { type: "string", example: "681c7f97f1138cf18b6d5b70" },
            title: { type: "string", example: "Ship internship portfolio update" },
            description: {
              type: "string",
              example: "Refresh project screenshots and push the final README updates."
            },
            status: {
              type: "string",
              enum: ["todo", "in-progress", "completed"],
              example: "in-progress"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "high"
            },
            dueDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-05-15T18:30:00.000Z"
            },
            owner: { type: "string", example: "681c7edaf1138cf18b6d5b67" },
            createdAt: { type: "string", format: "date-time", example: "2026-05-08T12:30:00.000Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-05-08T12:45:00.000Z" }
          }
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Aarav Patel" },
            email: { type: "string", example: "aarav@example.com" },
            password: { type: "string", format: "password", example: "StrongPass123!" }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "aarav@example.com" },
            password: { type: "string", format: "password", example: "StrongPass123!" }
          }
        },
        GoogleAuthRequest: {
          type: "object",
          required: ["credential"],
          properties: {
            credential: {
              type: "string",
              example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ4Y..."
            }
          }
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Aarav P." },
            email: { type: "string", example: "aarav.p@example.com" }
          }
        },
        ChangePasswordRequest: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: { type: "string", format: "password", example: "StrongPass123!" },
            newPassword: { type: "string", format: "password", example: "EvenStrongerPass456!" }
          }
        },
        DeleteAccountRequest: {
          type: "object",
          required: ["confirmation"],
          properties: {
            confirmation: { type: "string", example: "DELETE" }
          }
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", example: "Prepare recruiter demo" },
            description: {
              type: "string",
              example: "Record a walkthrough showing auth, CRUD, and dashboard stats."
            },
            status: {
              type: "string",
              enum: ["todo", "in-progress", "completed"],
              example: "todo"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "medium"
            },
            dueDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-05-18T10:00:00.000Z"
            }
          }
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: { type: "string", example: "Prepare recruiter demo" },
            description: {
              type: "string",
              example: "Record the final polished walkthrough and upload it."
            },
            status: {
              type: "string",
              enum: ["todo", "in-progress", "completed"],
              example: "completed"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "high"
            },
            dueDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-05-18T10:00:00.000Z"
            }
          }
        },
        AuthResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiSuccess" },
            {
              type: "object",
              properties: {
                message: { type: "string", example: "Login successful." },
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                user: { $ref: "#/components/schemas/User" }
              }
            }
          ]
        },
        CurrentUserResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiSuccess" },
            {
              type: "object",
              properties: {
                user: { $ref: "#/components/schemas/AuthenticatedUser" }
              }
            }
          ]
        },
        ProfileResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiSuccess" },
            {
              type: "object",
              properties: {
                message: { type: "string", example: "Profile updated successfully." },
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                user: { $ref: "#/components/schemas/User" }
              }
            }
          ]
        },
        TaskResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiSuccess" },
            {
              type: "object",
              properties: {
                message: { type: "string", example: "Task updated successfully." },
                task: { $ref: "#/components/schemas/Task" }
              }
            }
          ]
        },
        TaskListResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiSuccess" },
            {
              type: "object",
              properties: {
                tasks: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Task" }
                }
              }
            }
          ]
        },
        MessageResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiSuccess" },
            {
              type: "object",
              properties: {
                message: { type: "string", example: "Task deleted successfully." }
              }
            }
          ]
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  const swaggerOptions = {
    explorer: true,
    customSiteTitle: "TaskFlow API Docs",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "list",
      tagsSorter: "alpha",
      operationsSorter: "alpha"
    }
  };

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
  app.use("/api-docs", (_req, res) => {
    res.redirect(302, "/api/docs");
  });
};

module.exports = setupSwagger;
