export const environment = {
  production: false,
  apiUrl: 'https://currently-lenient-platypus.ngrok-free.app/api',

  //claims que se usan para guardar la sesion devuelta por el login, en el localstorage del cliemte
  jwtClaimName: 'jwt',
  roleClaimName: 'role',
  firstClaimName: 'firstName',
  userClaimId: 'userId',
};
