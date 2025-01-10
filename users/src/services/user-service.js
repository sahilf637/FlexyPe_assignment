const UserRepository = require("./../database/repository/user-repository");
const { APIError } = require("./../utils/app-error");

const {
  generateSalt,
  generateSignature,
  validatePassword,
  hashPassword,
  FormateData,
} = require("./../utils/index");

class UserServices {
  constructor() {
    this.repository = new UserRepository();
  }

  async SignIn(userInputs) {
    try {
      const { email, password } = userInputs;
      const existingUser = await this.repository.findUserByEmail({ email });
      if (existingUser) {
        const validedPassword = await validatePassword(
          password,
          existingUser.password,
          existingUser.salt,
        );
        if (validedPassword) {
          const token = await generateSignature({
            email: existingUser.email,
            _id: existingUser._id,
          });
          return FormateData({ id: existingUser._id, token });
        }
      }

      return FormateData("User Not Present");
    } catch (error) {
      throw new APIError("Data not found", error);
    }
  }

  async SignUp(userInputs) {
    const { name, email, phone, password } = userInputs;

    try {
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
    } catch (error) {
      console.log(error)
      throw new APIError("Can't create user", error);
    }
  }

  async GetAllUsers() {
    try {
      const users = await this.repository.findAllUsers();
      return FormateData(users);
    } catch (error) {
      throw new APIError("Can't Get Users", error);
    }
  }

  async GetProfile(id) {
    try {
      const existingUser = await this.repository.findUserById({ id });
      return FormateData(existingUser);
    } catch (error) {
      throw new APIError("Data not found", error);
    }
  }

  async DeleteProfile(userId) {
    try {
      const data = await this.repository.deleteUserById({ userId });
      return data;
    } catch (error) {
      throw new APIError("Can't delete data");
    }
  }
}

module.exports = UserServices;
