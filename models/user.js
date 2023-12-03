import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: String,
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

export default User;
