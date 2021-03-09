const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const http = require('http');
const app = express();
const helmet = require('helmet');
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)
const username = require('username-generator')
const path = require('path')
const controller = require('./controllers');
const Operations = require('./db/dboperations');


//app.use(express.static('./client/build'));
app.use(express.static('./react_client/build'));


app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());

app.get('/socket', (req, res) => {
    console.log("Enterd socket");
    res.sendFile(path.resolve(__dirname, "react_client", "build", "index.html"));
})


const users = {};


io.on('connection', async (socket) => {
    console.log("socket connected")
    //generate username against a socket connection and store it
    let userid;
    /*if (!users[userid]) {
        users[userid] = socket.id    //using socket id as userid
    }
      */
    socket.on('register_user', async (data) => {
        console.log("register_user socket entered")
        userid = data.User_Mobile_No;
        if (!users[data.User_Mobile_No]) {
            users[data.User_Mobile_No] = { "User_Mobile_No": data.User_Mobile_No, "socket_id": socket.id };  //users{7483334815:{"User_Mobileno":User_Mobileno,"socket_id":socket.id }}
        }
        console.log("Users = ", (users));
        io.sockets.emit('allUsers', users)
    })

    socket.on('disconnect', () => {
        delete users[userid]
    })

    socket.on('callUser', async (data) => {
        let fetch_result = await Operations.fetchdata({ User_Mobile_No: data.userToCall }, Operations.Mysql_Tables.users, 'mobileno');
        if (fetch_result.status) {
            if (fetch_result.data && !(fetch_result.data[0].User_Busy_Status)) {
                if (users[data.userToCall]) {
                    let insert_result = await Operations.insertdata({ To_User_Mobile_No: data.userToCall, From_User_Mobile_No: data.from, Call_Duration: data.callduration }, Operations.Mysql_Tables.transactions);
                    console.log("Insert Transaction _result =", (insert_result));
                    let update_result = await Operations.updatedata({ "busystatus": 0, "User_Mobile_No": data.userToCall }, Operations.Mysql_Tables.users, 'busystatus');
                    console.log("update _1 busy status result = ", (update_result));
                    if (update_result.status) {
                        let update_result_2 = await Operations.updatedata({ "busystatus": 0, "User_Mobile_No": data.from }, Operations.Mysql_Tables.users, 'busystatus');
                        console.log("update _2 busy status result = ", (update_result_2));
                        if (update_result_2.status) {
                            io.to(users[data.userToCall].socket_id).emit('hey', { signal: data.signalData, from: data.from });
                        }
                    }
                }
            } else {
                if (users[data.from]) {
                    io.to(users[data.from].socket_id).emit('validation', { signal: data.signalData, from: data.from, message: "Friend/Peer is busy in other call" })
                }
            }

        }
        console.log("users[data.userToCall]", users[data.userToCall]);
    })

    socket.on('acceptCall', (data) => {
        console.log("socket accept call entered")
        if (users[data.to]) {
            io.to(users[data.to].socket_id).emit('callAccepted', data.signal)
        }
    })

    socket.on('close', async (data) => {
        console.log("socket closed entered", (data));
        if (data.to) {
            let update_result = await Operations.updatedata({ "busystatus": 0, "User_Mobile_No": data.to }, Operations.Mysql_Tables.users, 'busystatus');
            console.log("update _1 busy status result = ", (update_result));
            if (update_result.status) {
                let update_result_2 = await Operations.updatedata({ "busystatus": 0, "User_Mobile_No": data.from }, Operations.Mysql_Tables.users, 'busystatus');
                console.log("update _2 busy status result = ", (update_result_2));
                if (users[data.to]) {
                    io.to(users[data.to].socket_id).emit('close');
                }
            }
        }

    })

    socket.on('rejected', (data) => {
        console.log("Socket rejected entered", (data));
        if (users[data.to]) {
            io.to(users[data.to].socket_id).emit('rejected')
        }
    })
})

app.use('/', controller);
const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})