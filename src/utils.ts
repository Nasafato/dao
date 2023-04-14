export function tryParseDaoIndex(i: unknown) {
  const result = Number.parseInt(i as string, 10);
  if (Number.isNaN(result)) {
    return null;
  }

  if (result > 81 || result < 1) {
    return null;
  }

  return result;
}
