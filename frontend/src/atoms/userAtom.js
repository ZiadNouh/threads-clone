import { atom } from "recoil";

const userAtom = atom({
  key: "useraAtom",
  default: JSON.parse(localStorage.getItem("user-threads")),
});

export default userAtom;
