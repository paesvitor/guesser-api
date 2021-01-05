import { User } from "@entities/User";

test("ok", () => {
  const user = new User();

  user.name = "Vitor";
  user.email = "mail";

  expect(user.name).toEqual("Vitor");
});
