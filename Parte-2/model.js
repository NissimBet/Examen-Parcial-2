let mongoose = require("mongoose");
let uuid = require("uuid");

mongoose.Promise = global.Promise;

const BookmarkSchema = new mongoose.Schema({
  id: { type: String, default: uuid.v4() },
  titulo: String,
  descripcion: String,
  url: String
});

const Bookmark = mongoose.model("bookmarks", BookmarkSchema);

module.exports = {
  updateBookmark: async (id, data) => {
    try {
      await Bookmark.updateOne({ id: id }, { ...data });
      const updatedBookmark = Bookmark.findOne({ id: id });
      return updatedBookmark;
    } catch (error) {
      throw Error(error);
    }
  }
};
