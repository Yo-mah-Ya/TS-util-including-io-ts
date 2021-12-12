import { parseObjectToString } from "./logger";

describe("logger", () => {
    class T {}
    test("parseObjectToString", () => {
        expect(parseObjectToString({
            a: 1,
            b: undefined,
            c: null,
            d: [0, 1, 2, 3],
            e: [{ a: "a" }, { b: true }, { c: [undefined] }],
        })).toStrictEqual(
            `{ a: 1, b: undefined, c: null, d: [0, 1, 2, 3], e: [{ a: "a" }, { b: true }, { c: [undefined] }] }`
        );
        expect(
            parseObjectToString({
                h: {
                    a: [T, new T()],
                    b: [Error, new Error()],
                    c: [
                        () => "arrow test",
                        function test() {
                            return "function test";
                        },
                        async () => "arrow promise test",
                        async function promiseTest() {
                            return "function promise test";
                        },
                    ],
                },
            })
        ).toStrictEqual(
            `{ h: { a: [T function, [object Object]], b: [Error function, Error], c: [arrow function, test function, async arrow function, async promiseTest function] } }`
        );
    });
});
