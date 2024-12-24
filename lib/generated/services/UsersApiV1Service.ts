/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountInfo } from '../models/AccountInfo';
import type { ConfirmToken } from '../models/ConfirmToken';
import type { EmailRequest } from '../models/EmailRequest';
import type { UserCreate } from '../models/UserCreate';
import type { UserResponse } from '../models/UserResponse';
import type { UserVerification } from '../models/UserVerification';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersApiV1Service {
  /**
   * Create User
   * @param requestBody
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static createUserApiV1UsersSignupPost(
    requestBody: UserCreate
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/users/signup',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    });
  }
  /**
   * Login
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static loginApiV1UsersLoginPost(
    requestBody: UserCreate
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/users/login',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    });
  }
  /**
   * Verify User
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static verifyUserApiV1UsersVerifyPost(
    requestBody: UserVerification
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/users/verify',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    });
  }
  /**
   * Resend Verification
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static resendVerificationApiV1UsersResendVerificationPost(
    requestBody: EmailRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/users/resend-verification',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    });
  }
  /**
   * Reset Password
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static resetPasswordApiV1UsersResetPasswordPost(
    requestBody: EmailRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/users/reset-password',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    });
  }
  /**
   * Confirm Reset Password
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static confirmResetPasswordApiV1UsersConfirmResetPasswordPost(
    requestBody: ConfirmToken
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/users/confirm-reset-password',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    });
  }
  /**
   * Refresh Token
   * @param refreshToken
   * @returns any Successful Response
   * @throws ApiError
   */
  public static refreshTokenApiV1UsersRefreshTokenPost(
    refreshToken: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/users/refresh-token',
      query: {
        refresh_token: refreshToken
      },
      errors: {
        422: `Validation Error`
      }
    });
  }
  /**
   * Verify Token
   * Endpoint to verify if a token is still valid.
   * The Security dependency will raise a 401 if the token is invalid.
   * @returns any Successful Response
   * @throws ApiError
   */
  public static verifyTokenApiV1UsersVerifyTokenGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/verify-token'
    });
  }
  /**
   * Get Account Info
   * @returns AccountInfo Successful Response
   * @throws ApiError
   */
  public static getAccountInfoApiV1UsersAccountInfoGet(): CancelablePromise<AccountInfo> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/account/info'
    });
  }
}
