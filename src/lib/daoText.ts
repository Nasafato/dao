import DAO_TEXT from "../fixtures/dao.json";

export const DAO_VERSES = Array.from(DAO_TEXT).map((value, index) => {
  return {
    text: value,
    id: index + 1,
  };
});
