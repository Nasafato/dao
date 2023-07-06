import { punctuation } from "materials/consts";

function generateClozes(
  sentence: string,
  numClozes: number,
  clozeLength: number,
  strategy: SpacingStrategy = { name: "PACKING" }
) {
  const length = sentence.length;
  const totalClozedLength = numClozes * clozeLength;

  if (totalClozedLength > length) {
    return [{ start: 0, end: sentence.length - 1 }];
  }

  // Algorithm: Just evenly space out the clozes as much as possible.
  // I guess we need to distribute the free space.

  // Actually, it's kind of like the bin-packing problem, right? Every item is the same length.

  // How do we distribute the free space?
  // Let's start with a naive algorithm. Just pack in the clozes next to each other until we've hit the total
  // number of clozes. It's not a very good algorithm.

  const clozes: Cloze[] = [];
  switch (strategy.name) {
    case "PACKING": {
      let freeSpaceSize = strategy.freeSpaceSize ?? 1;
      let freeSpaces = length - totalClozedLength;
      let clozesUsed = 0;
      let lengthUsed = 0;
      // Invariant: freeSpaces + lengthUsed + (numClozes - clozesUsed)= length;
      while (lengthUsed < length) {
        if (clozesUsed < numClozes) {
          clozes.push({
            start: lengthUsed,
            end: lengthUsed + clozeLength - 1,
          });
          clozesUsed += 1;
          lengthUsed += clozeLength;
        }

        if (freeSpaces > 0) {
          let freeSpaceConsumed = freeSpaceSize;
          if (freeSpaceSize > freeSpaces) {
            freeSpaceConsumed = freeSpaces;
          }
          freeSpaces -= freeSpaceConsumed;
          lengthUsed += freeSpaceConsumed;
        }
      }
      return clozes;
    }
    case "RANDOM":
    // To implement the RANDOM case, we are assuming constant CLOZE lengths.
    // There's a world in which clozes are randomly-generated, too, with minimum and maximum lengths.
    // You can have random cloze length + random spacing.
    // Or random cloze length + consistent spacing algorithm.
    // Basically there are four categories: 2x2.
    // Having a random spacing algorithm in which the minimum sequence is 0 means multiple clozes may be combined into
    // a single cloze.
    // There's a world in which we could have a single algorithm, since really we're just generating a non-overlapping but
    // complete set of subsets of the sentence in which each subset is either free space or a cloze.
    // Adjacent subsets of the same type just get merged.
    // Configuration can be arbitrarily deep, but I think randomness is useful for testing memorization.
    // Difficulty is ramped up by decreasing the amount of free space (increasing cloze length and frequency).
    case "SPACE_AROUND":
    case "SPACE_BETWEEN":
      throw new Error("Not implemented");
    case "NAIVE_PACKING":
    default: {
      let start = 0;
      for (let i = 0; i < numClozes; i++) {
        clozes.push({
          start,
          end: start + clozeLength - 0,
        });
        start += clozeLength;
      }

      return clozes;
    }
  }
}

type SpacingStrategy =
  | {
      name: "SPACE_AROUND";
      example?: "__aa__aa__";
    }
  | {
      name: "SPACE_BETWEEN";
      example?: "aa______aa";
    }
  | {
      name: "RANDOM";
      example?: "aa____aa__";
    }
  | {
      name: "NAIVE_PACKING";
      example?: "______aaaa";
    }
  | {
      name: "PACKING";
      example?: "aa_aa_____";
      freeSpaceSize?: number;
    };

interface Cloze {
  start: number;
  end: number;
}

function displayClozedSentence(sentence: string, clozes: Cloze[]) {
  const newSentence = [];
  for (let i = 0; i < sentence.length; i++) {
    let char = sentence[i];
    for (const cloze of clozes) {
      if (i >= cloze.start && i <= cloze.end) {
        // We'll assume no one's using _ in their input sentences. Otherwise, we may need to use a different unicode delimiter.
        // Or we represent the sentence as an array of more complex objects: { value: '_', type: 'char' } | { type: 'cloze' }
        char = "_";
        break;
      }
    }
    newSentence.push(char);
  }

  return newSentence.join("");
}

// To make this more robust, we can record the positions of the punctuation and then insert them back in when
// displaying the clozed sentence. I think... we can cloze over punctuation, so if punctuation sits within a cloze
// it also gets clozed.
const sentence = "道可道，非常道。名可名，非常名。"
  .split("")
  .filter((x) => !punctuation.includes(x))
  .join("");

const clozes = generateClozes(sentence, 3, 2, {
  name: "PACKING",
  freeSpaceSize: 3,
});
const clozedSentence = displayClozedSentence(sentence, clozes);
console.log("clozes", clozes);
console.log(sentence);
console.log(clozedSentence);
