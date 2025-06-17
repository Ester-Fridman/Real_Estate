const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const logger = require('./logger');
const PORT = process.env.PORT || 3000;
const businessController = require('./Controllers/businessController');
const userController = require('./Controllers/userController');
const serviceController = require('./Controllers/serviceController');
const meetingController = require('./Controllers/meetingController');
const authController = require('./Controllers/authController');
// Import Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        logger.info('המערכת עלתה בהצלחה');
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        logger.error('שגיאה בהתחברות למסד הנתונים');
        console.error('Error connecting to MongoDB:', err);
    });

app.use(cors());
app.use(express.json());
app.use('/businesses', businessController);
app.use('/users', userController);
app.use('/services', serviceController);
app.use('/meetings', meetingController);
app.use('/api/auth', authController);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
