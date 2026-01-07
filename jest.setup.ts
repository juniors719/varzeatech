import "@testing-library/jest-dom";

// Mock do alert para evitar erro "Not implemented"
global.alert = jest.fn();

// Polyfill TextEncoder/Decoder para Next.js em ambiente de teste
import { TextEncoder, TextDecoder } from "util";
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder as any;

// Polyfill fetch/Request/Response quando não disponíveis
if (typeof global.fetch === "undefined") {
  // Lazy import para evitar dependência direta
  // @ts-ignore
  global.fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...(args as any)));
}

// Polyfill Request/Response/Headers/FormData usando implementação do Next
try {
  // next/dist/compiled/node-fetch está disponível na instalação do Next
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nextFetch = require("next/dist/compiled/node-fetch");
  // @ts-ignore
  if (!global.Request) global.Request = nextFetch.Request;
  // @ts-ignore
  if (!global.Response) global.Response = nextFetch.Response;
  // @ts-ignore
  if (!global.Headers) global.Headers = nextFetch.Headers;
  // @ts-ignore
  if (!global.FormData) global.FormData = nextFetch.FormData;
} catch (err) {
  // ignore if not available
}

// Fallback final: stubs simples para evitar ReferenceError
// @ts-ignore
if (!global.Request) global.Request = class Request {} as any;
// @ts-ignore
if (!global.Response) global.Response = class Response {} as any;
// @ts-ignore
if (!global.Headers) global.Headers = class Headers {} as any;
// @ts-ignore
if (!global.FormData) global.FormData = class FormData {} as any;
