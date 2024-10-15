export type UserDTO = {
  id: number
  email: string
  lastname: string
  firstname: string | null
  call: {
    value: string
    countryCode: string
  }
}
