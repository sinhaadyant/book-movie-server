const User = require("../models/user");
const lib = require("../lib/user");
const handleSignup = async (req, res) => {
  const safeParseResult = lib.validateUserSignup(req.body);
  if (safeParseResult.error) {
    return res
      .status(400)
      .json({ status: "error", error: safeParseResult.error });
  }
  const { firstName, lastName, email, password } = safeParseResult.data;

  try {
    const { salt, hash: hashedPassword } =
      lib.generateHashForPassword(password);
    const createUserResult = await User.create({
      firstName,
      lastName,
      email,
      salt,
      password: hashedPassword,
    });
    //generate JWT token
    return res.json({ status: "success", data: { _id: createUserResult.id } });
  } catch (error) {
    if (error?.code == "11000") {
      return res
        .status(400)
        .json({ status: "error", error: `User with ${email} already exists` });
    }
    return res.status(500).json({ status: "error", error });
  }
};
const handleSignin = async (req, res) => {
  const safeParseResult = lib.validateUserSignin(req.body);
  if (safeParseResult.error) {
    return res
      .status(400)
      .json({ status: "error", error: safeParseResult.error });
  }

  const { email, password } = safeParseResult.data;

  const userInDb = await User.findOne({ email });
  if (!userInDb)
    return res
      .status(400)
      .json({ status: "error", error: `User with ${email} not exists` });

  const salt = userInDb.salt;
  const hashedPasswordDb = userInDb.password;
  const { hash } = lib.generateHash(password, salt);
  if (hash != hashedPasswordDb) {
    return res
      .status(500)
      .json({ status: "error", error: `Incorrect Password` });
  }
  const token = lib.generateUserToken({
    _id: userInDb._id.toString(),
    role: userInDb.role,
  });
  res.json({ status: "success", data: { token } });
};
const handleGetUserProfile = async (req, res) => {
  const user = req.user;
  if (!user) return res.json({ profile: null });
  const userInDb = await User.findById(user._id);
  if (!user) return res.json({ profile: null });
  return res.json({
    profile: {
      firstName: userInDb.firstName,
      lastName: userInDb?.lastName,
      email: userInDb.email,
      role: user.role,
    },
  });
};
module.exports = { handleSignup, handleSignin, handleGetUserProfile };
