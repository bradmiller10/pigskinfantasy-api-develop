export enum AuthErrorCode {
  InvalidAccessToken = 'INVALID_ACCESS_TOKEN',
  UserNotFound = 'USER_NOT_FOUND',
  AccessTokenExpired = 'ACCESS_TOKEN_EXPIRED',
  RefreshTokenExpired = 'REFRESH_TOKEN_EXPIRED',
  AccessRevoked = 'ACCESS_REVOKED',
  InvalidCode = 'INVALID_CODE',
  CodeExpired = 'CODE_EXPIRED',
  PermissionDenied = 'PERMISSION_DENIED',
  UserLockedOut = 'USER_LOCKED_OUT',
}
