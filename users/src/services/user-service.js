const { userRepository } = require("./../database/repository/user-repository");
const {
  generateSalt,
  generateSignature,
  validatePassword,
  hashPassword,
  FormateData,
} = require("./../utils/index");

class userServices {
  constructor() {
    this.repository = new userRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;

    const existingUser = await this.repository.findUserByEmail({ email });

    if (existingUser) {
      const validPassword = await validatePassword(
        password,
        existingUser.password,
        existingUser.salt,
      );
      if (validPassword) {
        const token = await generateSignature({
          email: existingUser.email,
          _id: existingUser._id,
        });
        return FormateData({ id: existingUser._id, token });
      }
    }

    return FormateData(null);
  }

  async SignUp(userInputs) {
    const { name, email, phone, password } = userInputs;

    let salt = await generateSalt();

    let userPassword = await hashPassword(password, salt);

    const existingUser = await this.repository.createUser({
      name,
      email,
      phone,
      password: userPassword,
      salt,
    });

    const token = await generateSignature({
      email: email,
      _id: existingUser._id,
    });
    return FormateData({ id: existingUser._id, token });
  }

  async GetProfile(id) {
    const existingUser = await this.repository.findUserById({ id });
    return FormateData(existingUser);
  }

  async DeleteProfile(userId) {
    const data = await this.repository.deleteUserById({ userId });
    return data;
  }
}

module.exports = userServices;
