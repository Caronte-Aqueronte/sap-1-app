export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',

  //claims que se usan para guardar la sesion devuelta por el login, en el localstorage del cliemte
  jwtClaimName: 'jwt',
  roleClaimName: 'role',
  firstClaimName: 'firstName',
  userClaimId: 'userId',
};
