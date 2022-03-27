const Url = require('../repo/model');
const dns = require('dns');
const { resolve } = require('path');

// From: http://stackoverflow.com/questions/161738
const URL_PATTERN = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

function validatePattern(inputUrl) {
  const matchResult = inputUrl.match(URL_PATTERN);
  if (matchResult){
    console.log(inputUrl.match(URL_PATTERN)[2]);
    return inputUrl.match(URL_PATTERN)[2]
  };
  return false;
}

module.exports = (method, data, callback) => {
  //console.log('service.method:',method);
  // console.log('service.data:',data);
  if (method == 'shorten'){ 
    // check if the input url matches pattern like http://www.google.com/
    const isValidUrlPattern = validatePattern(data);
    console.log('service.shorten.isValidUrlPattern:', isValidUrlPattern);

    //if the input url does not match the pattern, return error message
    if(!isValidUrlPattern) {
      const returnedJson = {"error":"Invalid URL"};
      callback(null,returnedJson);
    } else {

      // if the input url matches the pattern
      (async () => {

        //check if the input url already exists in the db
        const isExisted = await Url.checkUrl(data);
        console.log('service.shorten.isExisted:',isExisted);
        if(!isExisted){
          // if the input url is a new url
          const short = await Url.createNew(data);
          console.log("short = ", short);
          const returnedJson = {
            'original_url':`${data}`,
            'short_url':`${short}`
          };
          console.log("returnedJson =", returnedJson);   
          callback (null, returnedJson);
        } else {
          // if the input url already exists in the db
          const returnedJson = {
            'original_url':`${data}`,
            'short_url':`${isExisted.short}`
          };
          console.log("returnedJson =", returnedJson);   
          callback (null, returnedJson);
        }
      })()
    }
  }
  if (method == 'expand'){

    
  };
}



//FCC staff's code
// app.route('/api/shorturl/new').post((req,res)=> {
//   ...
//     let urlMatch = // Match the URL to expected structure or not

//     // Lookup the matched URL
//     dns.lookup(urlMatch, (err,add,fam) => {
//       // If the URL does not exist, return expected error
//       if (err) return res.json({"error": "invalid URL"});
   
//       // Save to database, otherwise.
//     })
//   });
// });

// DNS LOOKUP - OPTIONAL

// const dnsLookup = (url) => {
//   return new Promise((resolve, reject) => {
//     // console.log('DNS lookup: ', url);
//     // setTimeout(()=>{
//       dns.lookup(url,(err)=>{
//         if(err){
//           reject('');
//         } else {
//           resolve('valid')
//         }
//       })
//     // }, 1000);
//   });
// };

// async function verifyUrl() {
//   try {
//     const isValid = !!(await dnsLookup(data));
//     console.log('service.shortern.verifyUrl:',isValid)
    
//     let isNew = true;  
//     const short = Url.checkUrl(data).then(
      
//       );
//     console.log(short)
// catch (error) {
//   console.log(error);
//   returnedJson = {"error":"Invalid URL"};
//   console.log(returnedJson);
//   return returnedJson;
// }
// };
// verifyUrl();
