import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { loginUserValidator } from '#validators/login_user'
import { createUserValidator } from '#validators/create_user'

export default class AuthenticationController {
  async loginUsingCredentials({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginUserValidator)
      const user = await User.verifyCredentials(email, password)
      if (!user) return response.abort({ message: 'Invalid credentials' }, 404)
      const token = await User.accessTokens.create(user)
      return token
    } catch (error) {
      console.log(error)
      return response.abort({ message: 'Bad request' }, 400)
    }
  }

  async createAccountUsingCredentials({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createUserValidator)
      const { id } = await User.create(payload)
      return { id }
    } catch (error) {
      return response.abort(
        {
          message: 'Cannot perform this operation an user with this email already exists!',
        },
        409
      )
    }
  }
}
