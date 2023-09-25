# Backend for recognition web application

## api schema
| Methods	| Urls	| Actions
| -------- | ------- | ------- |
| POST | api/login | login
| GET | api/users | get users to recognize
| GET | api/users/:id/point | get user's recognized point
| POST | api/recognitions | create a recognition
| GET | api/activities/ | get user's recognition activities

## Database schema

```
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `loginId` varchar(36) NOT NULL COMMENT 'User login id',
  `password` varchar(45) NOT NULL DEFAULT '123456' COMMENT 'User login password',
  `userName` varchar(45) NOT NULL COMMENT 'User name',
  `userRole` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'User role\n0: staff\\\\\\\\n1: manager',
  `userMail` varchar(45) NOT NULL COMMENT 'User Email',
  `managerId` int DEFAULT NULL COMMENT 'Manager id',
  `avatarUrl` varchar(100) DEFAULT NULL COMMENT 'User’s avatar url ',
  `token` varchar(700) DEFAULT NULL COMMENT 'Authentication token',
  `createdTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
  `updatedTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Update time',
  PRIMARY KEY (`id`),
  UNIQUE KEY `employeeId_UNIQUE` (`loginId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `recognition` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `recognitionUserId` int NOT NULL COMMENT 'User id that is recognized by other user',
  `createUserId` int NOT NULL COMMENT 'User id that create recognition',
  `point` int NOT NULL DEFAULT '0' COMMENT 'Recognized point',
  `detail` varchar(512) NOT NULL COMMENT 'Recognition detail',
  `createdTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
  `updatedTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Update time',
  PRIMARY KEY (`id`),
  KEY `union index` (`createUserId`,`createdTime` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Directory

``` lua
src
├── controller -- controller
├── db -- database config
├── models -- data models
├── repositories -- repository
├── routes -- api routes
└── utils -- common methods
```
## Tech stack

| Tech                 | Detail                         |
| -------------------- | --------------------------- |
| express              | Web application framework   |
| MySQL                | Database                    |
| mysql2               | Database driver             |
| JWT                  | Authentication              |

## Implemented features

・Login with loginId and password(Password is stored in plain text).

・Authentication using JWT.

・Create and retrieve recognitions.

## Todo
・Store hashed password(with salt).

・Authenticate user by validating token and id from DB.

・Store user's avatar images in private cloud storage.

## Project setup
```
npm install
```

### Run
```
npm run start
```