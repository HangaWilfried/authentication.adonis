/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const AuthenticationController = () => import('#controllers/authentication_controller')

router.post('/api/login', [AuthenticationController, 'loginUsingCredentials'])
router.post('/api/register', [AuthenticationController, 'createAccountUsingCredentials'])
router.get('/api/users', [AuthenticationController, 'getAllUsers'])
