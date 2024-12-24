/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileLinkResponse } from '../models/FileLinkResponse';
import type { JobResponse } from '../models/JobResponse';
import type { JobResponseItem } from '../models/JobResponseItem';
import type { SignedUrlResponse } from '../models/SignedUrlResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class JobsApiV1Service {
  /**
   * Status
   * @returns any Successful Response
   * @throws ApiError
   */
  public static statusApiV1JobsStatusGet(): CancelablePromise<
    Record<string, any>
  > {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/jobs/status'
    });
  }
  /**
   * Get Zip Upload Url
   * @returns SignedUrlResponse Successful Response
   * @throws ApiError
   */
  public static getZipUploadUrlApiV1JobsGetZipUploadUrlGet(): CancelablePromise<SignedUrlResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/jobs/get_zip_upload_url'
    });
  }
  /**
   * List Jobs
   * @param limit
   * @param offset
   * @returns JobResponse Successful Response
   * @throws ApiError
   */
  public static listJobsApiV1JobsListGet(
    limit?: number | null,
    offset?: number | null
  ): CancelablePromise<JobResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/jobs/list',
      query: {
        limit: limit,
        offset: offset
      },
      errors: {
        422: `Validation Error`
      }
    });
  }
  /**
   * Get Job
   * @param jobIdentifier
   * @param tailLines
   * @returns JobResponseItem Successful Response
   * @throws ApiError
   */
  public static getJobApiV1JobsGetJobIdentifierGet(
    jobIdentifier: string,
    tailLines: number = 10
  ): CancelablePromise<JobResponseItem> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/jobs/get/{job_identifier}',
      path: {
        job_identifier: jobIdentifier
      },
      query: {
        tail_lines: tailLines
      },
      errors: {
        422: `Validation Error`
      }
    });
  }
  /**
   * Get Job Download Urls
   * Get signed URLs to download the job's files (generated files, output log, and error log).
   * @param jobId
   * @returns FileLinkResponse Successful Response
   * @throws ApiError
   */
  public static getJobDownloadUrlsApiV1JobsJobIdDownloadUrlsGet(
    jobId: string
  ): CancelablePromise<FileLinkResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/jobs/{job_id}/download_urls',
      path: {
        job_id: jobId
      },
      errors: {
        422: `Validation Error`
      }
    });
  }
}
