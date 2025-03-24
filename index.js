const express = require("express")
const app = express()
const router = express.Router()
const path = require("path")
const port = 5000;
const logger = require("morgan")
const multer = require("multer")

// const upload = multer({ dest: "./public/upload" })
const upload = multer({
    dest: path.join(__dirname, './public/upload/')
});


// built-in middleware

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

// application level middleware

const loggerMiddleware = (req, res, next) => {
    console.log(`${new Date()} ---- Request [${req.method}] [${req.url}] `)
    next();
}

app.use(loggerMiddleware)

// third party middleware
app.use(logger("combined"))


// router level middleware
app.use("/api/users", router)

const fakeAuth = (req, res, next) => {
    const authStatus = true
    if (authStatus) {
        console.log("user Authenticated:--", authStatus)
        next();
    } else {
        res.status(401)
        throw new Error("User is not authenticated")
    }
}

const getUsers = (req, res) => {
    res.json({ message: "This is the message from get users" })
}

const createUser = (req, res) => {
    console.log("This is the request body reciveds from client", req.body);
    res.json({ message: "This is the message from create users" })
}


router.use(fakeAuth)

router.route("/").get(getUsers).post(createUser)


// error handeling


const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode)

    switch (statusCode) {
        case 401:
            res.json({
                title: "Unauthoried",
                message: err.message,
            })
            break;
        case 404:
            res.json({
                title: "Not Found",
                message: err.message,
            })
            break;
        case 500:
            res.json({
                title: "server Error",
                message: err.message,
            })
            break;

        default:
            break;
    }


}

app.post("/upload", upload.single("image"), (req, res, next) => {
    if (!req.file) {
        // console.log(req.file)
        return res.status(400).send("No file uploaded.");
    }
    console.log("Uploaded File Details:", req.file);
    res.json({ file: req.file, message: "File uploaded successfully!" });
});

app.all("*", (req, res) => {
    res.statusCode = 404;
    throw new Error("Ghalat jagah pe aagaya miya tu")
})
app.use(errorHandler)


app.listen(port, (req, res) => {
    console.log(`hehe on ${port}`)
})


