require('dotenv').config();
require('express-async-errors');
const express = require('express');
const authMiddleware=require('./middleware/authentication');
const helmet=require('helmet');
const cors=require('cors');
const xss=require('xss-clean');
const rateLimiter=require('express-rate-limit');
const app = express();
const swaggerUI= require('swagger-ui-express');
const yaml=require('yamljs');
const swaggerDocument=yaml.load('./swagger.yaml');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const connectDB = require('./db/connect');

app.set('trust proxy',1);
app.use(rateLimiter({
  windowMs: 15*60*100,
  max:100
}));
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/',(req,res)=>{
  res.send('<h1>Documentation</h1> <a href="/api-docs"> Documentation</a>')
})
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));

app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/jobs/',authMiddleware, jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  
  try {
    await connectDB(process.env.MONGO_URI).then(console.log('Connect to DB'));
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    });
  } catch (error) {
    console.log(error);
  }
};

start();
