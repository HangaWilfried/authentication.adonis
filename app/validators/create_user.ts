import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().unique(async (db, value) => {
      const user = await db.from('users').where('email', value).first()
      return !user
    }),
    password: vine.string().confirmed(),
    lastname: vine.string(),
    firstname: vine.string().nullable(),
    mobile: vine.object({
      countryCode: vine.string(),
      value: vine.string().alphaNumeric(),
    }),
  })
)
