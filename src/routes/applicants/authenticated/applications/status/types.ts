interface ErrorResponse {
  message: string;
}
interface StatusResponseBody {
  applications: {
    applicationId: number;
    jobId: number;
    status: string;
    appliedAt: Date;
    updatedAt: Date;
  }[];
}

export type ApplicationStatusResponseBody = ErrorResponse | StatusResponseBody;