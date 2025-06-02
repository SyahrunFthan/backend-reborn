import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import rateLimit from 'express-rate-limit';

// import createModel from './models/ModelSubmissionService.js';

// Functions
import db from './configs/Database.js';
import RouteStallCategories from './routers/RouteStallCategories.js';
import RouteAuth from './routers/RouteAuth.js';
import RouteInComingMails from './routers/RouteInComingMails.js';
import RouteUpGoingMails from './routers/RouteUpGoingMails.js';
import RouteStall from './routers/RouteStall.js';
import RouteRole from './routers/RouteRole.js';
import RouteResidents from './routers/RouteResidents.js';
import RouteNews from './routers/RouteNews.js';
import RouteVillageApparatus from './routers/RouteVillageApparatus.js';
import RouteService from './routers/RouteService.js';
import RouteCitizenAssociation from './routers/RouteCitizenAssociation.js';
import RouteRegion from './routers/RouteRegion.js';
import RouteSubmissionService from './routers/RouteSubmissionService.js';
import optionsSwagger from './utils/swagger.js';
import verifyToken from './middlewares/VerivyToken.js';
import verifyRole from './middlewares/VerifyRole.js';

dotenv.config();

const app = express();
const specs = swaggerJSDoc(optionsSwagger);
try {
  await db.authenticate();
  console.log('Database connected');
  // await db.sync({ alter: true });
  // createModel.sync({ alter: true });
} catch (error) {
  console.log(error);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Melebihi batas request ke server.',
});

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173/'],
  })
);
app.use(limiter);
app.use(cookieParser());
app.use(fileUpload());
app.use('/public', express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// End Point API
app.use('/stall', RouteStall);
app.use('/stall-categories', RouteStallCategories);
app.use('/auth', RouteAuth);
app.use('/in-coming-mails', RouteInComingMails);
app.use('/up-going-mails', RouteUpGoingMails);
app.use('/role', RouteRole);
app.use('/residents', RouteResidents);
app.use('/news', RouteNews);
app.use('/village-apparatus', RouteVillageApparatus);
app.use('/service', RouteService);
app.use('/submission-service', RouteSubmissionService);
app.use('/citizen-association', RouteCitizenAssociation);
app.use('/region', RouteRegion);

app.use('/', verifyToken, verifyRole(['superadmin', 'admin', 'user']));

app.listen(5001, () => {
  console.log('Server running at port 5001....');
});
