const express = require('express');
const dbConnect = require('./config/dbconnect');
const app = express();
const dotenv = require('dotenv').config();
const authRouter = require("./routes/authRoute");
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorhandler');
const PORT = process.env.PORT || 4000;
const cookieparser=require("cookie-parser");
const productRouter=require("./routes/productRoute");
const morgan=require('morgan');
dbConnect(); 

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieparser());

app.use("/api/User/", authRouter);
app.use("/api/product",productRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
