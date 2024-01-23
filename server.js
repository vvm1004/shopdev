const app = require("./src/app");

const PORT = process.env.PORT || 3055;
const HOSTNAME = "127.0.0.1"; 

const server = app.listen(PORT, HOSTNAME, () => {
    console.log(`WSV eCommerce start with ${HOSTNAME}:${PORT}`);
});

// process.on('SIGINT', () => {
//     server.close(() => console.log(`Exit Server Express`))
//     // notify.send( ping...)
// })
