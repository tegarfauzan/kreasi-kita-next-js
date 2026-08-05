import { describe, expect, it } from "vitest";
import { getAccountNavigation } from "./account-navigation";

describe("getAccountNavigation", () => {
  it("mengarahkan guest ke login", () => {
    expect(getAccountNavigation(null)).toEqual({ href: "/login", label: "Masuk ke akun", text: "Masuk" });
  });

  it("mengarahkan customer ke profil customer", () => {
    expect(getAccountNavigation("CUSTOMER")).toEqual({ href: "/profile", label: "Buka profil", text: "Profil" });
  });

  it("mengarahkan admin ke profil admin", () => {
    expect(getAccountNavigation("ADMIN")).toEqual({ href: "/admin/profile", label: "Buka profil admin", text: "Profil Admin" });
  });
});
