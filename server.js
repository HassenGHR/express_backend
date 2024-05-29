const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const signInRouter = require('./routers/authRouters');
const productRoutes = require('./routers/productRoute');
const citiesRoutes = require('./routers/citiesRoute');
const wilyaRoutes = require('./routers/wilayaRoute');
const uploadRoute = require('./routers/uploadRouter');




app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_PRODUCTS_URI);

app.use('/api', signInRouter);
app.use('/api', productRoutes);
app.use('/api', citiesRoutes);
app.use('/api', wilyaRoutes);
app.use('/api', uploadRoute);



// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
