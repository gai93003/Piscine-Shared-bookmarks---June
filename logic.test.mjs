// import { expression } from "@babel/template";
import { getUserIds } from "./storage";

test("Must contain at least five users", () => {
    const users = getUserIds();
    expect(users.length).toBe(5);
})