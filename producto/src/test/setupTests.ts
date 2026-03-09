require("@testing-library/jest-dom");
import "@testing-library/jest-dom";

const { TextEncoder, TextDecoder } = require("node:util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
