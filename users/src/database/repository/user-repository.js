const { User } = require("./../model/user");

class userRepository {
  async createUser({ name, email, phone, password, salt }) {
    const newUser = {
      name,
      email,
      phone,
      password,
      salt,
    };

    const createdUser = User.save(newUser);

    return createdUser;
  }

  async findUserByEmail(email) {
    const foundUser = await User.findOne({ email: email });

    return foundUser;
  }

  async findUserById(id) {
    const foundUser = await User.findById(id);

    return foundUser;
  }

  async deleteUserById(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
  }
}

module.exports = userRepository;
