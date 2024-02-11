# Typescript installation for Node and Express


## Installation of Express js

* npm init -y
* npm install express cors body-parser dotenv 
* "start": "node index.js"
* "dev": "nodemon index.js"


## Installation of Typescript

* npm install -D typescript @types/express @types/node ts-node nodemon
* npx tsc init

* Update it in the tsconfig.json
{
  "compilerOptions": {
    ...
    "outDir": "./dist"
    ...
  }
}




---------------------------------



import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});





# Script

{
  "scripts": {
    "build": "npx tsc",
    "start": "node dist/index.js",
    "dev": "nodemon index.ts"
  }
}
