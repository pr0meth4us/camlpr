from ..utils.provinces import PROVINCES_LIST

# Character substitution maps
NUM_MAP = {'O': '0', 'o': '0', 'D': '0', 'Q': '0', 'I': '1', 'l': '1', 'Z': '2', 'S': '5', 'B': '8', 'G': '6'}
LET_MAP = {v: k for k, v in NUM_MAP.items()}


def levenshtein(s1: str, s2: str) -> int:
    """Calculate the Levenshtein distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein(s2, s1)
    if not s2:
        return len(s1)

    prev = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        curr = [i + 1]
        for j, c2 in enumerate(s2):
            ins = prev[j + 1] + 1
            del_ = curr[j] + 1
            sub = prev[j] + (c1 != c2)
            curr.append(min(ins, del_, sub))
        prev = curr
    return prev[-1]


def correct_province(txt: str) -> str:
    """Correct province name based on Levenshtein distance."""
    if not txt:
        return "UNREADABLE"

    # Convert to uppercase immediately
    txt_upper = txt.strip().upper()

    # First try exact match
    if txt_upper in PROVINCES_LIST:
        return txt_upper

    # If no exact match, find closest by Levenshtein distance
    prov, dist = min(
        ((p, levenshtein(txt_upper, p)) for p in PROVINCES_LIST),
        key=lambda x: x[1]
    )

    return prov if dist <= 2 else "UNREADABLE"


def correct_plate(txt: str, fmt: str) -> str:
    """Correct license plate based on the expected format."""
    # Ensure uppercase for license plates
    txt = txt.upper()

    if fmt == "nll-nnnn":
        pattern = ['n', 'l', 'l', '-', 'n', 'n', 'n', 'n']
    elif fmt == "nl-nnnn":
        pattern = ['n', 'l', '-', 'n', 'n', 'n', 'n']
    else:
        return txt

    if len(txt) != len(pattern):
        return txt

    out = []
    for ch, pt in zip(txt, pattern):
        if pt == 'n':
            out.append(ch if ch.isdigit() else NUM_MAP.get(ch, ch))
        elif pt == 'l':
            out.append(ch if ch.isalpha() else LET_MAP.get(ch, ch))
        else:
            out.append(ch)

    return ''.join(out)
