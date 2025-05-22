import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

// Configuration
import db from './configs/Database.js';
// import createModel from './models/ModelResidents.js';

// Router API
import RouteStallCategories from './routers/RouteStallCategories.js';
import RouteAuth from './routers/RouteAuth.js';
import RouteInComingMails from './routers/RouteInComingMails.js';
import RouteUpGoingMails from './routers/RouteUpGoingMails.js';

import { readFile } from 'fs/promises';

const apiDocs = JSON.parse(
  await readFile(new URL('../api-docs.json', import.meta.url))
);
import RouteStall from './routers/RouteStall.js';
import RouteRole from './routers/RouteRole.js';

dotenv.config();

const app = express();

try {
  await db.authenticate();
  console.log('Database connected');
  // createModel.sync({ alter: true });
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:5173/' }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/public', express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocs));

// End Point API
app.use('/stall', RouteStall);
app.use('/stall-categories', RouteStallCategories);
app.use('/auth', RouteAuth);
app.use('/in-coming-mails', RouteInComingMails);
app.use('/up-going-mails', RouteUpGoingMails);
app.use('/role', RouteRole);

app.listen(5001, () => {
  console.log('Server running at port 5001....');
});
