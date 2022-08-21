import {AppError} from "./AppError";

export default function graphQLAppError(error: any) {

    if(error instanceof AppError) {
        return {
            __typename: error.__typename,
            message: error.message,
            code: error.statusCode,
            id: error.id,
            type: error.type,
            subType: error.subType,
            title: error.title,
            description: error.description,
            helpText: error.helpText,
        };
    } else {
        return {
            __typename: 'Error',
            message: 'A internal server error occurred',
            code: 500,
            id: new Date().getTime().toString(),
            type: 'INTERNAL_SERVER_ERROR',
            subType: 'INTERNAL_SERVER_ERROR',
            title: 'Internal server error',
            description: error.message,
            helpText: 'Please contact the system administrator',
        };
    }


}