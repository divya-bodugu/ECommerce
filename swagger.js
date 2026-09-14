import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
    openapi: "3.0.0",

    info: {
        title: "E-Commerce API",
        version: "1.0.0",
        description: "Swagger API documentation for E-Commerce application"
    },

    servers: [
        {
            url: "http://localhost:3000",
            description: "Local server"
        }
    ],

    tags: [
        {
            name: "Authentication",
            description: "User registration and login"
        },
        {
            name: "Products",
            description: "Product management APIs"
        },
        {
            name: "Users",
            description: "Admin user management APIs"
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

            UserRegister: {
                type: "object",
                required: [
                    "name",
                    "email",
                    "password",
                    "role"
                ],
                properties: {
                    name: {
                        type: "string",
                        example: "Divya"
                    },
                    email: {
                        type: "string",
                        example: "divya@gmail.com"
                    },
                    password: {
                        type: "string",
                        example: "password123"
                    },
                    role: {
                        type: "string",
                        example: "user"
                    }
                }
            },

            Login: {
                type: "object",
                required: [
                    "email",
                    "password"
                ],
                properties: {
                    email: {
                        type: "string",
                        example: "divya@gmail.com"
                    },
                    password: {
                        type: "string",
                        example: "password123"
                    }
                }
            },

            Product: {
                type: "object",
                required: [
                    "name",
                    "description",
                    "price",
                    "category",
                    "stock",
                    "published"
                ],
                properties: {
                    _id: {
                        type: "string",
                        example: "6aa4dc65aca6ef0c8ea69033"
                    },
                    name: {
                        type: "string",
                        example: "Oneplus 15"
                    },
                    description: {
                        type: "string",
                        example: "Powerful flagship smartphone"
                    },
                    price: {
                        type: "number",
                        example: 500000
                    },
                    category: {
                        type: "string",
                        example: "Phones"
                    },
                    stock: {
                        type: "integer",
                        example: 3
                    },
                    published: {
                        type: "boolean",
                        example: true
                    }
                }
            },

            ProductUpdate: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        example: "Oneplus 15 Pro"
                    },
                    description: {
                        type: "string",
                        example: "Updated product description"
                    },
                    price: {
                        type: "number",
                        example: 550000
                    },
                    category: {
                        type: "string",
                        example: "Phones"
                    },
                    stock: {
                        type: "integer",
                        example: 10
                    },
                    published: {
                        type: "boolean",
                        example: true
                    }
                }
            },

            Error: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Database error"
                    },
                    error: {
                        type: "string",
                        example: "Something went wrong"
                    }
                }
            }
        }
    },

    paths: {

        // =========================
        // AUTHENTICATION
        // =========================

        "/auth/register": {
            post: {
                tags: ["Authentication"],
                summary: "Register a new user",
                description: "Creates a new user account",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UserRegister"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "User registered successfully",
                        content: {
                            "application/json": {
                                example: {
                                    message: "Registered Successfully"
                                }
                            }
                        }
                    },

                    400: {
                        description: "Invalid request",
                        content: {
                            "application/json": {
                                example: {
                                    message: "name, email,password and role are required"
                                }
                            }
                        }
                    },

                    500: {
                        description: "Registration failed"
                    }
                }
            }
        },

        "/auth/login": {
            post: {
                tags: ["Authentication"],
                summary: "User login",
                description: "Login using email and password and receive JWT token",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Login"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                example: {
                                    message: "Login successful",
                                    users: "Divya",
                                    tokens: "JWT_TOKEN"
                                }
                            }
                        }
                    },

                    401: {
                        description: "Invalid email or password"
                    },

                    500: {
                        description: "Login failed"
                    }
                }
            }
        },

        // =========================
        // PRODUCTS
        // =========================

        "/user/products": {

            post: {
                tags: ["Products"],
                summary: "Create product",
                description: "Admin can create a new product",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "Product created successfully"
                    },

                    400: {
                        description: "Unauthorized or database error"
                    }
                }
            },

            get: {
                tags: ["Products"],
                summary: "Get all products",
                description:
                    "Users can view published products. Admins can view products and export them as CSV.",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "published",
                        in: "query",
                        required: false,
                        schema: {
                            type: "boolean"
                        },
                        example: true
                    },
                    {
                        name: "exportData",
                        in: "query",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["csv"]
                        },
                        example: "csv"
                    }
                ],

                responses: {
                    200: {
                        description: "Products retrieved successfully"
                    },

                    400: {
                        description: "Database error"
                    }
                }
            }
        },

        "/user/products/{id}": {

            get: {
                tags: ["Products"],
                summary: "Get product by ID",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        },
                        example: "6aa4dc65aca6ef0c8ea69033"
                    }
                ],

                responses: {
                    200: {
                        description: "Product retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Product"
                                }
                            }
                        }
                    },

                    400: {
                        description: "Invalid ID or product not found"
                    }
                }
            },

            put: {
                tags: ["Products"],
                summary: "Update product",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        },
                        example: "6aa4dc65aca6ef0c8ea69033"
                    }
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ProductUpdate"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "Product updated successfully"
                    },

                    400: {
                        description: "Invalid ID, unauthorized, or database error"
                    }
                }
            },

            delete: {
                tags: ["Products"],
                summary: "Delete product",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        },
                        example: "6aa4dc65aca6ef0c8ea69033"
                    }
                ],

                responses: {
                    200: {
                        description: "Product deleted successfully"
                    },

                    400: {
                        description: "Invalid ID, unauthorized, or product not found"
                    }
                }
            }
        },

        // =========================
        // PUBLISHED PRODUCTS
        // =========================

        "/user/products/viewallproduct": {

            get: {
                tags: ["Products"],
                summary: "View all published products",
                description: "Returns published products with filtering, sorting and pagination",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "category",
                        in: "query",
                        schema: {
                            type: "string"
                        },
                        example: "Phones"
                    },
                    {
                        name: "minPrice",
                        in: "query",
                        schema: {
                            type: "number"
                        },
                        example: 1000
                    },
                    {
                        name: "maxPrice",
                        in: "query",
                        schema: {
                            type: "number"
                        },
                        example: 500000
                    },
                    {
                        name: "sort",
                        in: "query",
                        schema: {
                            type: "string"
                        },
                        example: "price"
                    },
                    {
                        name: "order",
                        in: "query",
                        schema: {
                            type: "string",
                            enum: ["asc", "desc"]
                        },
                        example: "asc"
                    },
                    {
                        name: "page",
                        in: "query",
                        schema: {
                            type: "integer",
                            default: 1
                        },
                        example: 1
                    },
                    {
                        name: "limit",
                        in: "query",
                        schema: {
                            type: "integer",
                            default: 10
                        },
                        example: 10
                    }
                ],

                responses: {
                    200: {
                        description: "Published products retrieved successfully"
                    },

                    500: {
                        description: "Database error"
                    }
                }
            }
        },

        "/user/products/viewsingleproduct/{id}": {

            get: {
                tags: ["Products"],
                summary: "View a published product",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        },
                        example: "6aa4dc65aca6ef0c8ea69033"
                    }
                ],

                responses: {
                    200: {
                        description: "Published product retrieved successfully"
                    },

                    400: {
                        description: "Invalid ID or product not found"
                    },

                    500: {
                        description: "Database error"
                    }
                }
            }
        },

        // =========================
        // CSV IMPORT
        // =========================

        "/user/products/import": {

            post: {
                tags: ["Products"],
                summary: "Import products from CSV",
                description: "Admin can upload a CSV file containing products",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                required: ["file"],
                                properties: {
                                    file: {
                                        type: "string",
                                        format: "binary"
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: "Products imported successfully"
                    },

                    400: {
                        description: "CSV file missing, empty or invalid"
                    }
                }
            }
        },

        // =========================
        // USERS
        // =========================

        "/user": {
            get: {
                tags: ["Users"],
                summary: "Get all users",
                description: "Admin can get all normal users",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: "Users retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/User"
                                    }
                                }
                            }
                        }
                    },
                    403: {
                        description: "You are not authorized"
                    },
                    400: {
                        description: "Database error"
                    }
                }
            }
        },


        "/user/{id}": {

            delete: {
                tags: ["Users"],
                summary: "Delete user",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        },
                        example: "6a9d352ff9f99c29cdf9b93f"
                    }
                ],

                responses: {
                    200: {
                        description: "User deleted successfully"
                    },

                    400: {
                        description: "Invalid ID, unauthorized, or user not found"
                    }
                }
            }
        }
    }
};

export { swaggerDocument, swaggerUi };