const axios = require('axios');
const localStorage = require('localStorage');


async function getUsersInfo() {

    const usersInfo = await axios({
        url: "http://sqstat.umcc.cu/JSONConsolidated.php",
        method: 'get',
    
    });
    
    
    localStorage.setItem('usersInfo', JSON.stringify(usersInfo.data));
    
    

}


module.exports = getUsersInfo;


