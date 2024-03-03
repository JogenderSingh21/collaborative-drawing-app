const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.use('/api/v1', mainRouter);

app.listen(3000);