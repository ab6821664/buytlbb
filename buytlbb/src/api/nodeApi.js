import axios from 'axios';
// let base='http://134.160.170.177:9090';
let  base='http://localhost:3000';

// 首页搜索
  let homeQuery=(params)=>{
      return new Promise(function (resolve,reject) {
          axios({
              url:base+'/homeQuery',
              method:'post',
              data:params
          }).then((res)=>{
              resolve(res.data)
          }).catch((err)=>{
              reject(err)
          })
      })

  }

  export {homeQuery};