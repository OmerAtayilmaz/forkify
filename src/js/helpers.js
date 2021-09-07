import { TIMEOUT_SEC } from "./config";
import {async} from 'regenerator-runtime';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX=async(url,uploadData=undefined)=>{
  try{ 
      const fetchPro = uploadData?
      fetch(url,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(uploadData)
      }):
      fetch(url);
      
      const res=await Promise.race([fetchPro,timeout(TIMEOUT_SEC)]);//önce yüklenen promise kazanır!
      const data=await res.json();
      if(!res.ok)throw new Error(`${data.message} (${res.status})`);
      return data;
    }
    catch(err){
        throw err; //hatayı export edilen yerde arayacak!-ki doğru olan da öyle yapması -
    }

}

/* export const getJSON=async(url)=>{
   try{ 
    const res=await Promise.race([fetch(url),timeout(TIMEOUT_SEC)]);//önce yüklenen promise kazanır!
    const data=await res.json();
    if(!res.ok)throw new Error(`${data.message} (${res.status})`);
    return data;
    }
    catch(err){
        throw err; //hatayı export edilen yerde arayacak!-ki doğru olan da öyle yapması -
    }
}

export const sendJSON=async(url,uploadData)=>{
  try{
    const fetchPro=fetch(url,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(uploadData)
    })

    const res=await Promise.race([fetchPro,timeout(TIMEOUT_SEC)]);//önce yüklenen promise kazanır!
    const data=await res.json(); 
    if(!res.ok)throw new Error(`${data.message} (${res.status})`);
    return data;
    
  }
  catch(err){
    throw err;
  }
} */