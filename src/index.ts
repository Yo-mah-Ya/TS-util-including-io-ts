import * as t from "io-ts";
import { isLeft } from "fp-ts/lib/Either";
import { PathReporter } from "io-ts/lib/PathReporter";
import { Readable } from "stream";

interface DateString {
    readonly dateString: unique symbol;
}
const dateString = t.brand(
    t.string,
    (s: string): s is t.Branded<string, DateString> =>
        /^\d{4}-\d{2}-\d{2}$/.test(s),
    "dateString"
);

const readable = new t.Type<Readable, Readable, unknown>(
    "Readable",
    (input: unknown): input is Readable => input instanceof Readable,
    (input, context) =>
        input instanceof Readable
            ? t.success(input)
            : t.failure(input, context),
    t.identity
);

const userProfile = t.intersection([
    t.type({
        userName: t.string,
        nationality: t.array(t.string),
        isMarried: t.boolean,
    }),
    t.partial({
        birthDay: dateString,
        sex: t.keyof({
            men: null,
            women: null,
            others: null,
        }),
        profileImage: readable,
    }),
]);
type UserProfile = t.TypeOf<typeof userProfile>;
export const isUserProfile = (json: unknown): json is UserProfile =>
    userProfile.is(json);
const throwOnFailure = <A>(result: t.Validation<A>): A => {
    if (isLeft(result)) {
        throw new Error(JSON.stringify(PathReporter.report(result)));
    }
    return result.right;
};
export const assertUserProfile = (json: unknown): UserProfile =>
    throwOnFailure(userProfile.decode(json));
