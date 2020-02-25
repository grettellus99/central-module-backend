const mongoose = require('mongoose');

const smartPhoneSchema = new mongoose.Schema({

   number: {
    type: String,
   },
   level: {
     type: String,
   },
});

const contactSchema = new mongoose.Schema({
  sector: {
    type: String,
  },
  name: {
    type: String,
  },
  extension: {
    type: [String],
  },
  smartphone: [smartPhoneSchema],
  localphone: {
    type: Array,
  },
});

module.exports = contactSchema;
