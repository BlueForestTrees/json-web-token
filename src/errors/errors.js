import {inherits} from 'util';
import NestedError from 'nested-error-stacks';


export function UnauthorizedError(message, nested) {
    NestedError.call(this, message, nested);
    this.status = 401;
}
inherits(UnauthorizedError, NestedError);
UnauthorizedError.prototype.name = 'UnauthorizedError';

export function ValidationError(errors, nested) {
    NestedError.call(this, "Validation Error", nested);
    this.status = 400;
    this.body = errors;
}
inherits(ValidationError, NestedError);
ValidationError.prototype.name = 'ValidationError';