import { Readable } from "stream";
import { isUserProfile, assertUserProfile } from "./index";

describe("UserProfile", () => {
    const zeroPaddingString = (n: number): string =>
        n.toString().padStart(2, "0");

    const now = new Date();
    const testData = {
        userName: "test user",
        nationality: ["US", "UK"],
        isMarried: false,
        birthDay: `${zeroPaddingString(now.getFullYear())}-${zeroPaddingString(
            now.getMonth() + 1
        )}-${zeroPaddingString(now.getDate())}`,
        sex: "others",
        profileImage: Readable.from(["test user image"]),
    };
    test("is function of the codec", () => {
        expect(isUserProfile({ dummy: "dummy" })).toBeFalsy();
        expect(
            isUserProfile({ ...testData, birthDay: "bad date format" })
        ).toBeFalsy();
        expect(
            isUserProfile({
                ...testData,
                profileImage: "bad profileImage",
            })
        ).toBeFalsy();
        expect(isUserProfile(testData)).toBeTruthy();
    });
    test("decode function of the codec", () => {
        expect(() => assertUserProfile({ dummy: "dummy" })).toThrowError(Error);
        expect(() =>
            assertUserProfile({ ...testData, birthDay: "bad date format" })
        ).toThrowError(Error);
        expect(() =>
            assertUserProfile({
                ...testData,
                profileImage: "bad profileImage",
            })
        ).toThrowError(Error);
        expect(assertUserProfile(testData)).toStrictEqual(testData);
    });
});
