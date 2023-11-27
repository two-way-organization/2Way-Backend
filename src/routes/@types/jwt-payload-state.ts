export interface JwtPayloadState {
  user: {
    /**
     * The id of the applicant.
     *
     *
     */
    id: number;
    email: string;
    role: string;
  };
}
