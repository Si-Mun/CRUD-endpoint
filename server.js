const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// setup firebase
const serviceAccount = require("./key.json");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { response } = require('express');
initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();

const PORT = process.env.PORT || 8080;
const portListening = () => {
    app.listen(PORT, () => {
      console.log(`port listening on ${PORT}.`);
    });
};

// routes
// menambahkan data user
const addUser = () => {
    app.post('/add', async (req, res) => {
        try {                        
            const data = {
                name : req.body.name,
                age : req.body.age,               
            }
            const responses = await db.collection("users").add(data);
            res.send(responses);
        } catch (error) {
            res.send(error);
        }
    })
}

// get data semua user
const readAllUsers = () => {
    app.get('/get/all', async (req, res) => {
        try {
            const usersRef = db.collection("users");
            const responses = await usersRef.get();
            let usersResArr = [];
            responses.forEach(doc => {
                usersResArr.push(doc.data());
            });
            res.send(usersResArr);
        } catch (error) {
            res.send(error);
        }
    })
}

// get data satu user
const readUser = () => {
    app.get('/get/:id', async (req, res) => {
        try {
            const userRef = db.collection("users").doc(req.params.id)
            const responses = await userRef.get();
            res.send(responses.data());            
        } catch (error) {
            res.send(error);
        }
    })
}

// update data user
const updateUser = () => {
    app.post('/update', async (req, res) => {
        try {            
            const dataUpdate = {
                name : req.body.name,
                age : req.body.age,               
            }

            // dummy data untuk tes
            // const dataUpdate = {
            //     name : "Toyo",
            //     age : "24"
            // }
            // dummy data untuk tes

            const userRef = await db.collection("users").doc(req.body.id).update(dataUpdate);
            res.send(userRef);
        } catch (error) {
            res.send(error);
        }
    })
}

// delete user
const deleteUser = () => {
    app.delete('/delete', async (req, res) => {
        try {            
            const response = await db.collection("users").doc(req.body.id).delete();
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    })
}

module.exports = {
    port : PORT,
    portListening,
    addUser,
    readAllUsers,
    readUser,
    updateUser,
    deleteUser,
};
