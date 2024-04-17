const checkOneElementExist = (userArray, callback) => {
    for (let i = 0; i < userArray.length; i++) {
        if (callback(userArray[i])) {
            return true;
        }
    }
    return false;
};