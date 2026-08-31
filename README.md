## Author: Luis Rafael Reyes Caro

# CRUD Node Express Sequelize performance test

This is a Docker compose node.js environmental API Rest managed throw TypeScript as programming language.It is composed by Sequelize as ORM with postgres as database, and in this case Express as API Framework. This API is organized throw a layered monolithic architecture.

# structure.
riwimedicare-plus-api/
├── src/
│   ├── config/             # Database connection, environment variables, Swagger specs
│   ├── controllers/        # Request handlers & HTTP responses
│   ├── dto/                # Data Transfer Objects for strict payload validation
│   ├── interfaces/         # Custom TypeScript types and interface definitions
│   ├── middleware/         # Auth (JWT), role checking, file uploads, error handling
│   ├── models/             # Sequelize database models (User, Clinic, Warehouse, Medicine, Request)
│   ├── repositories/       # Data access layer interfacing with Sequelize
│   ├── routes/             # Express routes grouped by domain
│   ├── seeders/            # Programmatic database seed scripts
│   ├── services/           # Business logic layer (inventory checks, status management)
│   ├── app.ts              # Express application configuration
│   └── server.ts           # Server entry point
├── tests/                  # Unit and integration test suites (Jest)
├── uploads/                # Temporary directory for JSON seed files (Multer)
├── .env.example            # Environment variables template
├── docker-compose.yml      # Multi-container orchestration (API + PostgreSQL)
├── Dockerfile              # Production container build specification
├── jest.config.ts          # Jest test runner configuration
├── package.json
└── tsconfig.json           # TypeScript configuration


## This API is builded in two different parts:
- CRUDs:
```js
  /**
   * This is the CRUD incharged of handle the User creation, obtainment, uptading and deletion.
   * @param {Security} bcrypt - It manages bcrypt to hash the user password.
   * @param {FakeDB} seeder - A seeder to check information without creating it before for testing. 
   */
  const userCRUD = {
    bcrypt: "Security",
    seeder: "fake db information",
    createUser: 
      {
        id: "number", 
        name: "name", 
        password: "Hashed Password", 
        role: "role"
      },
    obtainment: 
      {
        findAll: "GET all the users in the db, the feature is mostly for an ADMIN user",
        findOne: "Post User by ID"
      },
    updating: 
      {
        updateUser: "Update the user name, or user password using PATCH"
      },
    deletion: 
      {
        deleteUser: "Delete the user using soft_delete",
        restoreUser: "Restore the user deleted throw soft_delete."
      }
  }
```
```js
/**
 * Handles Clinic management including NIT validation and request history.
 * @param {Middleware} nitValidator - Ensures unique NIT per clinic.
 */
const clinicCRUD = {
  nitValidator: "Middleware validation for unique NIT",
  createClinic: {
    id: "number",
    name: "string",
    nit: "string (unique)",
    address: "string",
    phone: "string"
  },
  obtainment: {
    findAll: "GET all active clinics in the database",
    findOne: "GET clinic details by ID",
    findHistory: "GET complete supply request history for a specific clinic"
  },
  updating: {
    updateClinic: "PATCH clinic address, phone, or name by ID"
  },
  deletion: {
    deleteClinic: "Soft delete clinic by updating status flag",
    restoreClinic: "Restore soft-deleted clinic by ID"
  }
};

/**
 * Handles Warehouse management for storing medical inventory.
 */
const warehouseCRUD = {
  createWarehouse: {
    id: "number",
    name: "string",
    location: "string",
    phone: "string"
  },
  obtainment: {
    findAll: "GET all active warehouses",
    findOne: "GET warehouse by ID"
  },
  updating: {
    updateWarehouse: "PATCH warehouse details by ID"
  },
  deletion: {
    deleteWarehouse: "Soft delete warehouse by ID",
    restoreWarehouse: "Restore soft-deleted warehouse by ID"
  }
};

/**
 * Handles Medicine inventory management associated with warehouses.
 */
const medicineCRUD = {
  createMedicine: {
    id: "number",
    name: "string",
    sku: "string (unique)",
    stock: "number",
    warehouseId: "number (FK)"
  },
  obtainment: {
    findAll: "GET all medicines with current stock",
    findOne: "GET medicine details by ID"
  },
  updating: {
    updateMedicine: "PATCH medicine stock or information by ID"
  },
  deletion: {
    deleteMedicine: "Soft delete medicine by ID",
    restoreMedicine: "Restore soft-deleted medicine by ID"
  }
};

/**
 * Handles Supply Requests lifecycle, inventory validation, and status updates.
 * @param {Middleware} stockCheck - Verifies warehouse stock before creating requests.
 */
const supplyRequestCRUD = {
  stockCheck: "Middleware checking available stock >= requested quantity",
  createRequest: {
    id: "number",
    clinicId: "number (FK)",
    medicineId: "number (FK)",
    quantity: "number (> 0)",
    warehouseId: "number (FK)",
    status: "PENDING | APPROVED | REJECTED | DELIVERED"
  },
  obtainment: {
    findAll: "GET all active supply requests",
    findOne: "GET request by ID",
    findByClinic: "GET requests filtered by clinic ID"
  },
  updating: {
    updateStatus: "PATCH request status adhering to allowed state transitions"
  },
  deletion: {
    deleteRequest: "Soft delete supply request by ID",
    restoreRequest: "Restore soft-deleted supply request by ID"
  }
};

/**
 * Population tool to load base database records from uploaded JSON files.
 * @param {Multer} upload - Handles JSON multipart file uploads.
 */
const seederUpload = {
  uploadMiddleware: "Multer file handler for JSON payload parsing",
  seedData: {
    uploadEndpoint: "POST /seed/upload to populate Users, Clinics, Warehouses, and Medicines"
  }
};
```

---
---


## TS configuration

```json
  {
    "compilerOptions": {
      "module": "nodenext",
      "target": "esnext",
      "types": ["node"],
      "jsx": "react-jsx",
      "sourceMap": true,
      "declaration": true,
      "declarationMap": true,
      "noUncheckedIndexedAccess": true,
      "exactOptionalPropertyTypes": true,
      "noEmit": true,
      "strict": true,
      "verbatimModuleSyntax": true,
      "isolatedModules": true,
      "noUncheckedSideEffectImports": true,
      "moduleDetection": "force",
      "skipLibCheck": true,
      "allowImportingTsExtensions": true
    }, 
    "include": ["src/**/*.ts", "index.ts"]
  }
```

---
---


#### backend: Nodejs con ssu package.json

```json
  {
    "main": "index.js",
    "scripts": {
      "dev": "tsx --watch index.ts",
    },
    "author": "LuisReyes970304",
    "license": "ISC",
    "type": "module",
    "dependencies": {
      "@types/sequelize": "^4.28.20",
      "dotenv": "^16.6.1",
      "express": "^5.1.0",
      "jest": "^30.4.2",
      "pg": "^8.23.0",
      "sequelize": "^6.37.8",
      "swagger-jsdoc": "^6.2.8",
      "swagger-ui-express": "^5.0.1",
      "ts-jest": "^29.4.12"
    },
    "devDependencies": {
      "@types/express": "^5.0.3",
      "@types/node": "^24.13.3",
      "@types/swagger-jsdoc": "^6.0.4",
      "@types/swagger-ui-express": "^4.1.8",
      "tsx": "^4.20.3",
      "typescript": "^5.9.2"
    }
  }
```

## API Configuration

- Docker Compose Configurations.

It is quite important to use the right version of images. in this case the more stable version for postgres is 17-alpines.

```yaml
  db:
    image: postgres:17-alpine
```

On the other hand, in order to build the nodejs image we are going to use node:24-alpine in the Dockerfile.
Also will be needed the the port 3015.

```Dockerfile
  FROM node:24-alpine

  EXPOSE 3015

  CMD ["npm", "run", "dev"]
```
