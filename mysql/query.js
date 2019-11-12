const connect = require('./index');

module.exports = (sql,params=[]) => {
    return new Promise((resolve,reject) => {
        connect.query(sql,params,(error,data) => {
            if(error){
                reject({msg:'error',error})
            }else{
                resolve({msg:'success',data})
            }
        })
    })
}