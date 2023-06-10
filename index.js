const {
    portListening, 
    addUser, 
    readAllUsers, 
    readUser,
    updateUser,
    deleteUser,
} = require("./server");

addUser();
readAllUsers();
readUser();
updateUser();
deleteUser();
portListening();
