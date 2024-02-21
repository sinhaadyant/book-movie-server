const { z } = require("zod");

function validateCreateTheaterPayload(data) {
  const schema = z.object({
    name: z.string(),
    location: z.object({
      lon: z.string(),
      lat: z.string(),
      address: z.string(),
    }),
  });
  return schema.safeParse(data);
}

module.exports = { validateCreateTheaterPayload };
