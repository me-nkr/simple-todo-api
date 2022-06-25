/**
 * Provided Errors
 * - SyntaxError - Request - 400
 * - StrictModeError - Resource - 400
 * - ValidationError - Resource - 400
 * - MongoServerError - User - 409
 * - JsonWebTokenError - Auth - 401
 * - TokenExpiredError - Auth - 401

 * Custom Errors
 * - AuthError - Auth - 401 | 403
 * - InvalidAuthError - Auth - 401
 * - InvalidRequestError - Request - 400
 * - NotFoundError - Resource - 404
 */
import mongoose from 'mongoose';
import JWT from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';

const { TokenExpiredError, JsonWebTokenError } = JWT
const { StrictModeError, ValidationError } = mongoose.Error;

export class AuthError extends Error {
    constructor(type) {
        super()
        this.name = 'AuthError';
        this.type = type;
    }
}

export class InvalidAuthError extends Error {
    constructor(message = 'Invalid credentials provided') {
        super(message);
        this.name = 'InvalidAuthError';
    }
}

export class InvalidRequestError extends Error {
    constructor(message = 'Invalid request') {
        super(message)
        this.name = 'InvalidRequestError';
    }
}

export class NotFoundError extends Error {
    constructor(resource) {
        super()
        this.resource = resource;
    }
}

const respond = (response) => {
    return (statusCode, message) => {
        if (message)
        response.status(statusCode).json({ message: message });
        else
        response.status(statusCode).end();
    }
}

export default (error, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    const resp = respond(res);

    console.log(error.constructor)

    switch(error.constructor) {
        case AuthError:
            if (error.type === 'user') return resp(401, 'Invalid user');
            if (error.type === 'password') return resp(401, 'Invalid password');
            if (error.type === 'permission') return resp(403, 'You\'re not my daddy (-.^)');
            next();
            break;
        case InvalidAuthError:
            return resp(401, error.message);
        case InvalidRequestError:
            return resp(400, error.message);
        case JsonWebTokenError:
            return resp(401, 'Invalid Token');
        case TokenExpiredError:
            return resp(401, 'Token Expired');
        case SyntaxError:
            if (error.type === 'entity.parse.failed') return resp(400, 'Malformed JSON body');
            next()
            break;
        case NotFoundError:
            return resp(404, error.resource + ' not found :(');
        case StrictModeError:
            return resp(400, 'Invalid field' + error.path);
        case ValidationError:
            let message = 'Fields ';
            for (let [field, action] of Object.entries(error.errors)) message += field + ' is ' + action.kind + ', ';
            message = message.slice(0, -2);
            return resp(400, message);
        case MongoServerError:
            if (error.code === 11000) return resp(409, 'User already registered');
            next()
            break;
        default:
            console.log(error);
            resp(500)
            next()
            break;
    }

}


/**
     // auth Errors

 * Auth errors - login and authorization
 * # invalid auth method (basic and bearer, when interchanged) | 401 | InvaldiAuthError | error: { expected: 'Bearer', provided: 'None | Basic' }
 * # user not found | 401 | AuthError | { type: 'user | password | permission' }
 * # invalid password | 401 | AuthError | { type: 'user | password | permission' }

 * User Creation error
 * # invalid or incomplete data body - ValidationError - error: { errors: { name-of-field: { kind: type-of-reason}}}
 * # invalid field - StrictModeError - error: { path: name-of-invalid-field }
 * # user already exist - 409 - MongoServerError: E11000 - error: { code: 11000 }

 * Other Auth error
 * # invalid auth method | 401 | InvaldiAuthError | error: { expected: 'Basic', provided: 'None | Bearer' }
 * # token absent | 401 | InvaldiAuthError | error: { expected: 'Bearer', provided: 'None | Basic' }
 * # JWT Auth errors - 401
 *  # Invalid token - JsonWebTokenError
 *  # Expired token - TokenExpiredError

    // Resource Errors

 * Creation error
 * # invalid or incomplete data body (no items to create aka empty body) | 400 | InvalidRequestError | error: { message: 'empty body' }
 * # invalid or incomplete data body - ValidationError - error: { errors: { name-of-field: { kind: type-of-reason}}}
 * # invalid field - StrictModeError - error: { path: name-of-invalid-field }    

 * Updation or deletion errors
 * # item not found | 404 | NotFoundError | { resource: 'todo' }
 * # no access to item | 403 | AuthError | { type: 'user | password | permission' }
 * # invalid or incomplete data body - ValidationError - error: { errors: { name-of-field: { kind: type-of-reason}}}
 * # invalid field - StrictModeError - error: { path: name-of-invalid-field }

 * Request errors
 * # invalid json body - SyntaxError - error { type: 'entity.parse.failed' }
 */


