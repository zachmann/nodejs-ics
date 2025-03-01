"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urlRegex = void 0;
exports.validateHeader = validateHeader;
exports.validateHeaderAndEvent = validateHeaderAndEvent;
var yup = _interopRequireWildcard(require("yup"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// yup url validation blocks localhost, so use a more flexible regex instead
// taken from https://github.com/jquense/yup/issues/224#issuecomment-417172609
// This does mean that the url validation error is
// "url must match the following: ...." as opposed to "url must be a valid URL"
var urlRegex = exports.urlRegex = /^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/;
var dateTimeSchema = function dateTimeSchema(_ref) {
  var required = _ref.required;
  return yup.lazy(function (value) {
    if (typeof value === 'number') {
      return yup.number().integer().min(0);
    }
    if (typeof value === 'string') {
      return yup.string().required();
    }
    if (!required && typeof value === 'undefined') {
      return yup.mixed().oneOf([undefined]);
    }
    return yup.array().required().min(3).max(7).of(yup.lazy(function (item, options) {
      var itemIndex = options.parent.indexOf(options.value);
      return [yup.number().integer(), yup.number().integer().min(1).max(12), yup.number().integer().min(1).max(31), yup.number().integer().min(0).max(23), yup.number().integer().min(0).max(60), yup.number().integer().min(0).max(60)][itemIndex];
    }));
  });
};
var durationSchema = yup.object().shape({
  before: yup["boolean"](),
  //option to set before alaram
  weeks: yup.number(),
  days: yup.number(),
  hours: yup.number(),
  minutes: yup.number(),
  seconds: yup.number()
}).noUnknown();
var contactSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  rsvp: yup["boolean"](),
  dir: yup.string().matches(urlRegex),
  partstat: yup.string(),
  role: yup.string(),
  cutype: yup.string(),
  xNumGuests: yup.number()
}).noUnknown();
var organizerSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  dir: yup.string(),
  sentBy: yup.string()
}).noUnknown();
var alarmSchema = yup.object().shape({
  action: yup.string().matches(/^(audio|display|email)$/).required(),
  trigger: yup.mixed().required(),
  description: yup.string(),
  duration: durationSchema,
  repeat: yup.number(),
  attach: yup.string(),
  attachType: yup.string(),
  summary: yup.string(),
  attendee: contactSchema,
  'x-prop': yup.mixed(),
  'iana-prop': yup.mixed()
}).noUnknown();
var headerShape = {
  productId: yup.string(),
  method: yup.string(),
  calName: yup.string()
};
var headerSchema = yup.object().shape(headerShape).noUnknown();
var eventShape = {
  summary: yup.string(),
  timestamp: dateTimeSchema({
    required: false
  }),
  title: yup.string(),
  uid: yup.string(),
  sequence: yup.number().integer().max(2147483647),
  start: dateTimeSchema({
    required: true
  }),
  duration: durationSchema,
  startType: yup.string().matches(/^(utc|local)$/),
  startInputType: yup.string().matches(/^(utc|local)$/),
  startOutputType: yup.string().matches(/^(utc|local)$/),
  end: dateTimeSchema({
    required: false
  }),
  endInputType: yup.string().matches(/^(utc|local)$/),
  endOutputType: yup.string().matches(/^(utc|local)$/),
  description: yup.string(),
  url: yup.string().matches(urlRegex),
  geo: yup.object().shape({
    lat: yup.number(),
    lon: yup.number()
  }),
  location: yup.string(),
  status: yup.string().matches(/^(TENTATIVE|CANCELLED|CONFIRMED)$/i),
  categories: yup.array().of(yup.string()),
  organizer: organizerSchema,
  attendees: yup.array().of(contactSchema),
  alarms: yup.array().of(alarmSchema),
  recurrenceRule: yup.string(),
  busyStatus: yup.string().matches(/^(TENTATIVE|FREE|BUSY|OOF)$/i),
  transp: yup.string().matches(/^(TRANSPARENT|OPAQUE)$/i),
  classification: yup.string(),
  created: dateTimeSchema({
    required: false
  }),
  lastModified: dateTimeSchema({
    required: false
  }),
  exclusionDates: yup.array().of(dateTimeSchema({
    required: true
  })),
  exclusionDatesInputType: yup.string().matches(/^(utc|local)$/),
  exclusionDatesOutputType: yup.string().matches(/^(utc|local)$/),
  htmlContent: yup.string()
};
var headerAndEventSchema = yup.object().shape(_objectSpread(_objectSpread({}, headerShape), eventShape)).test('xor', "object should have end or duration (but not both)", function (val) {
  var hasEnd = !!val.end;
  var hasDuration = !!val.duration;
  return hasEnd && !hasDuration || !hasEnd && hasDuration || !hasEnd && !hasDuration;
}).noUnknown();
function validateHeader(candidate) {
  try {
    var value = headerSchema.validateSync(candidate, {
      abortEarly: false,
      strict: true
    });
    return {
      error: null,
      value: value
    };
  } catch (error) {
    return {
      error: Object.assign({}, error),
      value: undefined
    };
  }
}
function validateHeaderAndEvent(candidate) {
  try {
    var value = headerAndEventSchema.validateSync(candidate, {
      abortEarly: false,
      strict: true
    });
    return {
      error: null,
      value: value
    };
  } catch (error) {
    return {
      error: Object.assign({}, error),
      value: undefined
    };
  }
}