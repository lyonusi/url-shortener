require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

const urlSchema = new Schema ({
  original: { type: String, required: true },
  short: { type: String, required: true },
  counter: Number
})

const Url = mongoose.model('Url',urlSchema);

const createNew =  async (original) => {
  console.log('repo.createNew:', original)
  const newUrl = new Url({original:original, short:'', counter:0});
  console.log('repo.createNew.newUrl:', newUrl)
  newUrl.short = newUrl._id.toString().slice(-6)
  newUrl.save((err)=>{
    if (err) return console.log(err);
  });
  return newUrl.short;
} 

const decodeUrl = async (short) => {
  console.log('repo.decodeUrl: ', short)
  const result = await Url.findOne({short:short},(err, original) => {
      if(err) {
        return console.log(err);
      } 
      if(original){
        original.counter +=1;
        original.save();
        console.log('repo.decodeUrl.find: ', original);
      }
  });
  console.log('repo.decodeUrl.result: ', result)
  return result? result.original: result;
};

const checkUrl =  async (original) => {
  console.log('repo.checkUrl: ', original)
  let result = await Url.findOne({original:original});
  console.log('repo.checkUrl.result = ',result)
  return result;
} 


exports.UrlModel = Url;
exports.createNew = createNew;
exports.decodeUrl = decodeUrl;
exports.checkUrl = checkUrl;
// module.exports = Url;
