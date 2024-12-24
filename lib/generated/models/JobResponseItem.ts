/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobFileItem } from './JobFileItem';
export type JobResponseItem = {
  id: string;
  status: string;
  runtime: number | null;
  created_at: string;
  updated_at: string;
  files?: Array<JobFileItem>;
  output_log_tail?: Array<string>;
  error_log_tail?: Array<string>;
};
