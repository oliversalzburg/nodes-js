export function is(nilable, InstanceType) {
  return !isNil(nilable) && nilable instanceof InstanceType;
}
export function isNil(nilable) {
  return nilable === null || nilable === void 0;
}
export function toOptional(nilable) {
  if (isNil(nilable)) {
    return void 0;
  }
  return nilable;
}
export function coalesce(nilable, to) {
  if (isNil(nilable)) {
    return to;
  }
  return nilable;
}
export function coalesceArray(nilables, to) {
  const result = new Array();
  for (const nilable of nilables) {
    if (!isNil(nilable)) {
      result.push(nilable);
    } else if (!isNil(to)) {
      result.push(to);
    }
  }
  return result;
}
export class UnexpectedNilError extends Error {
  constructor(message = "unexpected nil value") {
    super(message);
  }
}
export function mustExist(subject) {
  if (isNil(subject)) {
    throw new UnexpectedNilError();
  }
  return subject;
}
