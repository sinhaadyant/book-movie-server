const crypto = require("crypto");
const JWT = require("jsonwebtoken");

const { z } = require("zod");
const { v4: uuidV4 } = require("uuid");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("JWT_SECRET is required!");

const userTokenSchema = z.object({
  _id: z.string(),
  role: z.string(),
});

function validateUserSignup(data) {
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
  return schema.safeParse(data);
}
function validateUserSignin(data) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
  });
  return schema.safeParse(data);
}
function generateHashForPassword(password) {
  const salt = uuidV4();
  const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");
  return { salt, hash };
}

function generateHash(password, salt) {
  const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");
  return { salt, hash };
}
function generateUserToken(data) {
  const safeParseResult = userTokenSchema.safeParse(data);
  if (safeParseResult.error) throw new Error(safeParseResult.error);

  const token = JWT.sign(JSON.stringify(safeParseResult.data), JWT_SECRET);

  return token;
}

function validateUserToken(token) {
  try {
    const payload = JWT.verify(token, JWT_SECRET);
    const safeParseResult = userTokenSchema.safeParse(payload);

    if (safeParseResult.error) throw new Error(safeParseResult.error);

    return safeParseResult.data;
  } catch (error) {
    return null;
  }
}

module.exports = {
  validateUserSignup,
  validateUserSignin,
  generateHashForPassword,
  generateUserToken,
  generateHash,
  validateUserToken,
};
