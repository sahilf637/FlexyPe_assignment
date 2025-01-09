const User = require("./../model/user");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-error");

class UserRepository {
  async createUser({ name, email, phone, password, salt }) {
    try {
      const newUser = new User({
        name,
        email,
        phone,
        password,
        salt,
      });

      const createdUser = await newUser.save();

      return createdUser;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create User",
      );
    }
  }

  async findUserByEmail({ email }) {
    try {
      const foundUser = await User.findOne({ email: email });

      return foundUser;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find User",
      );
    }
  }

  async findAllUsers() {
    try {
      const users = await User.find();

      return users;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find Users",
      );
    }
  }

  async findUserById({ id }) {
    try {
      console.log(id);
      const foundUser = await User.findById(id);

      return foundUser;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find User",
      );
    }
  }

  async deleteUserById({ id }) {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      return deletedUser;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to delete User",
      );
    }
  }
}

module.exports = UserRepository;
