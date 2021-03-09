import axios from 'axios';

export function Postdatanew(url, data) {
  return new Promise((resolve, reject) => {
    axios.defaults.withCredentials = true;
    axios({
      method: 'post',
      url: url,
      timeout: 25000,
      baseURL: 'http://localhost:3000/',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': 'barer',
        //'deviceid': Constants.DeviceId,
      },
      data: data
    }).then(response => {
      if (response.status == 200) {
        resolve(response.data);
      } else {
        resolve({ status: false, Message: "Server Not Responding" })
      }
    }).catch(error => {
      console.error(error);
      reject(error);
    });
    setTimeout(() => {
      console.log("entered settimeout");
      resolve({ Status: false, Message: 'Network Request TimedOut' });
    }, 30000);
  });
}




