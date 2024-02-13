import { RESPONSE_STATUS_CODES, STATUS_MESSAGES } from "../constants";

export const buildFailedResponse = (error: Error) => {
  if ("cause" in error) {
    const cause = error.cause as RESPONSE_STATUS_CODES;
    return {
      message: STATUS_MESSAGES[cause],
      details: error.message,
      statusCode: cause,
    };
  }

  return {
    message: STATUS_MESSAGES[RESPONSE_STATUS_CODES.BAD_REQUEST],
    details: error,
    statusCode: RESPONSE_STATUS_CODES.BAD_REQUEST,
  };
};
