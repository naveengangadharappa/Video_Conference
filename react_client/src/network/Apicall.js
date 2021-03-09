
import { Getdata, Postdata, Postdatanew } from './WebServices';
import { securedBrowserCache } from 'secured-browser-storage';
securedBrowserCache.config('Video_Conf@123');

let baseurl = 'http://localhost:3000/';
export const Urls = {
  Login: baseurl + 'login', //User Login
  Logout: baseurl + 'logout', // logout
  Register: baseurl + 'Register'
};

export async function Register_User(params) {
  try {
    let data = JSON.stringify(params);
    console.log("url = " + Urls.Login);
    console.log("Params  = " + data);
    let result = await Postdatanew(Urls.Register, data);
    console.log("Response = ", (result));
    return result;
  } catch (error) {
    console.log(error);
    return { status: false, message: 'Request cant be complete Try Again' };
  }
}

export async function Login(params) {
  try {
    let data = JSON.stringify(params);
    console.log("url = " + Urls.Login);
    console.log("Params  = " + data);
    let result = await Postdatanew(Urls.Login, data);
    console.log("Response = ", (result));
    return result;
  } catch (error) {
    console.log(error);
    return { status: false, message: 'Request cant be complete Try Again' };
  }
}




export async function Logout() {
  try {
    console.log("url = " + Urls.Login);
    let result = await Offlinestorage({ choice: "clear" });
    console.log("Response = ", (result));
    return result;
  } catch (error) {
    console.log(error);
    return { status: false, message: 'Request cant be complete Try Again' };
  }
}

export async function Offlinestorage(params) {
  return new Promise((resolve, reject) => {
    let result = {
      status: false,
      data: '',
      message: ''
    };
    switch (params.choice) {
      case "adddata":
        securedBrowserCache.clear();
        securedBrowserCache.setItem(params.key, params.value)
        result.status = true;
        break;
      case "getdata":
        result.data = securedBrowserCache.getItem(params.key, params.value);
        result.status = true;
        break;
      case "deletedata": securedBrowserCache.removeItem(params.key);
        result.status = true;
        break;
      case "clear": securedBrowserCache.clear();
        result.status = true;
        break;
      default: result.status = false;
        result.message = "choice cannot be identified";
        break;
    }
    resolve(result);
  });
}



