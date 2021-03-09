const updateJsonFile = require('update-json-file')
const errlogjson = require('./Err_Log.json');
let mysqlconnection = require('./db_connect');

const Mysql_Tables = {
    users: "users",
    transactions: "transaction"
}


const message = {
    error: 'Sorry due to Internal Error Request cannot be completed Plese try Again',
}

let mysqldatetime = () => {
    var date = new Date();
    return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
}

let loadprojects = async function () {
    try {
        let projectsdata = await getAllprojects();
        if (projectsdata.status) {
            let prj = projectsdata.data.map(item => {
                console.log(item);
                return ({
                    prjid: item.p_name,
                    dbbucket: item.p_name,
                    backup: true,
                    token: item.p_token
                })
            });
            updateJsonFile('./db/Projects.json', (data) => {
                data.projects = prj;
                return data
            })
            // projects.splice(0)
            // projects = prj;
            return ({ data: prj, msg: "List of all Projects", status: true });
        } else {
            return ({ msg: "unable to get  Projects", status: false });
        }
    } catch (err) {
        console.log(err)
        return ({ status: false });
    }
}


const logerror = async (LoginID, err, option) => {
    return new Promise((resolve, reject) => {
        try {
            let result = {}
            let datetime = mysqldatetime();
            switch (option) {
                case 'json':
                    let logdata = {
                        DateTime: datetime,
                        LoginId: LoginID,
                        Errormsg: err
                    };
                    let errdata = errlogjson.log
                    errdata.push(logdata);
                    console.log("Logdata", (logdata));
                    updateJsonFile('./db/Err_Log.json', (data) => {
                        data.log = errdata;
                        return data;
                    })
                    result = { status: true };
                    break;
                case 'db': result = { status: true };
                    break;

            }
            resolve(result);
        } catch (err) {
            console.log(err);
            resolve({ status: false, message: "err at logging err" });
        }
    });
}

const mysqloperations = async (params) => {
    return new Promise((resolve, reject) => {
        switch (params.option) {
            case 'fetchdata':
                mysqlconnection.query(params.sql, params.data, (err, rows, fields) => {
                    if (!err) {
                        console.log("fetch your query executed", (params));
                        resolve({ status: true, data: rows });
                    } else {
                        console.log(err);
                        //Log Error to Json file 
                        logerror(params.LoginId, err, 'json').then(result => {
                            resolve(result.status ? { status: false, message: "Error log successfull Problem in fetching data" } : { status: false, message: "error log unsuccessfull Problem in fetching data" });
                        }).catch(err => {
                            console.log(err);
                            reject({ status: false, message: "error log unsuccessfull Problem in fetching data" })
                        })
                    }
                });
                break;
            default: //insert , delete, update
                console.log("Sql =" + params.sql);
                console.log("Data =" + params.data);
                mysqlconnection.query(params.sql, params.data, function (err) {
                    if (!err) {
                        console.log("Insert query executed");
                        resolve({ status: true, message: "Query Execution Successfull" })
                    } else {
                        console.log(err);
                        //Log Error to Json file 
                        logerror(params.LoginId, err, 'json').then(result => {
                            resolve(result.status ? { status: false, message: "Error log successfull Problem in fetching data" } : { status: false, message: "error log unsuccessfull Problem in fetching data" });
                        }).catch(error => {
                            console.log(error);
                            reject({ status: false, message: "error log unsuccessfull Problem in fetching data" })
                        })
                    }
                })
                break;
        }
    })
}


const Register = async (data) => {
    try {
        console.log("entered Register");
        let result = await fetchdata(data, Mysql_Tables.users, "mobileno");
        if (result.status && result.data.length > 0) {
            return { status: false, message: "User Already exists Cannot Register Again" };
        } else {
            let res = await insertdata(data, Mysql_Tables.users);
            if (res.status) {
                return { status: true, message: "User Registeration Successfull" };
            } else {
                return { status: false, message: "User Registeration UnSuccessfull" };
            }
        }
    } catch (err) {
        console.log(err)
        return { status: false, message: message.error };
    }
}

const login = async (data) => {
    try {
        console.log("entered login");
        let result = await fetchdata(data, Mysql_Tables.users, "mobileno");
        if (result.status && result.data.length > 0) {
            return { status: true, data: result.data, message: "User Login Successfull" };
        } else {
            return { status: false, message: "User Already exists Cannot Register Again" };
        }
    } catch (err) {
        console.log(err);
        return { status: false, message: message.error };
    }
}

const insertdata = async (data, tblname) => {
    try {
        let params = {
            successmessage: "Insert successfully",
            failuremessage: "Insert failed",
            sql: ``,
            data: [],
            option: '',
        }
        switch (tblname) {
            case 'users':
                params.sql = `insert into users(User_Name,User_Mobile_No) values(?,?)`;
                params.data = [data.User_Name, data.User_Mobile_No];
                break;
            case 'transaction':
                params.sql = `insert into transaction(From_User_Mobile_No,To_User_Mobile_No,Call_Duration) values(?,?,?)`;
                params.data = [data.From_User_Mobile_No, data.To_User_Mobile_No, data.Call_Duration];
                break;
            default: return { status: false, message: 'Invalid tabelname' }
        }
        let mysql_res = await mysqloperations(params)
        return mysql_res.status ? { status: true, message: params.successmessage } : { status: false, message: params.failuremessage }
    } catch (err) {
        console.log(err);
        return { status: false, message: message.error };
    }
}


const updatedata = async (data, tblname, option) => {
    try {
        let params = {
            successmessage: "Update successfully",
            failuremessage: "Update failed",
            sql: ``,
            data: [],
            option: '',
        }
        switch (tblname) {
            case 'users':
                switch (option) {
                    case 'username': params.sql = `update users set User_Name=? where User_Mobile_No=?`;
                        params.data = [data.User_Name, data.User_Mobile_No];
                        break;
                    case 'mobileno': params.sql = `update users set User_Mobile_No=? where User_Id=?`;
                        params.data = [data.User_Mobile_No, data.User_Id];
                        break;
                    case 'busystatus':
                        // if (data.From_User_Mobile_No && data.User_Mobile_No) {
                        //     params.sql = `update users set User_Busy_Status=? where User_Mobile_No=? and User_Mobile_No=?`;
                        //     params.data = [data.busystatus, data.User_Mobile_No, data.From_User_Mobile_No];
                        // } else {
                        params.sql = `update users set User_Busy_Status=? where User_Mobile_No=?`;
                        params.data = [data.busystatus, data.User_Mobile_No];
                        // }

                        break;
                    default: params.sql = `update users set User_Name=?,User_Mobile_No=? where User_Id=?`;
                        params.data = [data.User_Name, data.User_Mobile_No, data.User_Id];
                        break;
                }

                break;
            default: return { status: false, message: 'Invalid tabelname' }
        }
        let mysql_res = await mysqloperations(params)
        return mysql_res.status ? { status: true, message: params.successmessage } : { status: false, message: params.failuremessage }
    } catch (err) {
        console.log(err);
        return { status: false, message: message.error };

    }
}


const fetchdata = async (data, tblname, option) => {
    try {
        let params = {
            successmessage: "Data fetch successfully",
            failuremessage: "Data fetch failed",
            sql: ``,
            data: [],
            option: 'fetchdata',
        }
        switch (tblname) {
            case 'users':
                switch (option) {
                    case "userid":
                        params.sql = `select * from users where User_Id=?`;
                        params.data = [data.User_Id];
                        break;
                    case "mobileno":
                        params.sql = `select * from users where User_Mobile_No=?`;
                        params.data = [data.User_Mobile_No];
                        break;
                    default:
                        params.sql = `select * from users`;
                        break;
                }
                break;
            default: return { status: false, message: 'Invalid tabelname' }
        }
        let mysql_res = await mysqloperations(params)
        return mysql_res.status ? { status: true, data: mysql_res.data, message: data.successmessage } : { status: false, message: data.failuremessage }
    } catch (err) {
        console.log(err);
        return { status: false, message: message.error };

    }
}

const deletedata = async (data, tblname) => {
    try {
        let params = {
            successmessage: "Deletion successfully",
            failuremessage: "Deletion failed",
            sql: ``,
            data: [],
            option: '',
        }
        switch (tblname) {
            case 'users':
                params.sql = `delete from users where User_Id=?`;
                params.data = [data.User_Id];
                break;
            default: return { status: false, message: 'Invalid tabelname' }
        }
        let mysql_res = await mysqloperations(params)
        return mysql_res.status ? { status: true, message: data.successmessage } : { status: false, message: data.failuremessage }
    } catch (err) {
        console.log(err);
        return { status: false, message: message.error };
    }
}


module.exports = { loadprojects, login, fetchdata, insertdata, updatedata, deletedata, Register, Mysql_Tables };
