export const pyMessage = `
def permutations(length, alphabet=ALPHABET):
    ''' Recursively yield all permutations of alphabet up to given length. '''

    if length <= 0:
        yield ""
    elif length == 1:
        for letter in alphabet:
            yield letter
    else:
        for letter in alphabet:
            for ele in permutations(length - 1, alphabet):
                yield letter + ele`;

export const jsMessage = `
function permutations(length, alphabet = ALPHABET) {
    if (length <= 0) {
        return [""];
    }
    return alphabet.reduce((acc, letter) => {
        acc.push(...permutations(length - 1, alphabet).map(ele => letter + ele));
        return acc;
    }, []);
}`;

