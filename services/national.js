const axios = require('axios');
const localStorage = require('localStorage');


async function getUsersNationalInfo() {

    const usersNationalInfo = await axios({
        url: "http://10.34.8.18/JSONConsolidated.php",
        method: 'get',
    
    });
    

    
    localStorage.setItem('usersNationalInfo', JSON.stringify(usersNationalInfo.data));
    
    

}


module.exports = getUsersNationalInfo;