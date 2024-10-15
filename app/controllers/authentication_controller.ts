import User from '#models/user'
import { UserDTO } from '#utils/type'
import type { HttpContext } from '@adonisjs/core/http'
import { loginUserValidator } from '#validators/login_user'
import { createUserValidator } from '#validators/create_user'

type Call = {
  value: string
  countryCode: string
}

export default class AuthenticationController {
  async loginUsingCredentials({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginUserValidator)
    const user = await User.verifyCredentials(email, password)

    if (!user) return response.abort({ message: 'Invalid credentials' }, 404)

    const token = await User.accessTokens.create(user)
    return token.value?.release()
  }

  async createAccountUsingCredentials({ request, response }: HttpContext) {
    try {
      const { mobile, ...payload } = await request.validateUsing(createUserValidator)
      const { id } = await User.create({
        ...payload,
        call: this.toString(mobile),
      })
      return { id }
    } catch (error) {
      console.log(error)
      return response.abort(
        {
          message: 'Cannot perform this operation an user with this email already exists!',
        },
        409
      )
    }
  }

  toString(call: Call): string {
    return `${call.countryCode};${call.value}`
  }

  toCall(data: string): Call {
    const [countryCode, value] = data.split(';')
    return { countryCode, value }
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await User.all()
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
      call: this.toCall(user.call),
    }))
  }
}
