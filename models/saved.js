var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SavedSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  para: {
    type: String,
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Saved = mongoose.model("Saved", SavedSchema);

module.exports = Saved;