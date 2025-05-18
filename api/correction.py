number_mapping = {
    'O': '0', 'o': '0', 'D': '0', 'Q': '0',
    'I': '1', 'l': '1',
    'Z': '2',
    'S': '5',
    'B': '8',
    'G': '6',
}

letter_mapping = {
    '0': 'O',
    '1': 'I',
    '2': 'Z',
    '5': 'S',
    '8': 'B',
    '6': 'G',
}

CAMBODIA_PROVINCES = [
    "Cambodia"
    "Banteay Meanchey",
    "Battambang",
    "Kampong Cham",
    "Kampong Chhnang",
    "Kampong Speu",
    "Kampong Thom",
    "Kampot",
    "Kandal",
    "Kep",
    "Koh Kong",
    "Kratie",
    "Mondulkiri",
    "Oddar Meanchey",
    "Pailin",
    "Phnom Penh",
    "Preah Sihanouk",
    "Preah Vihear",
    "Prey Veng",
    "Pursat",
    "Ratanakiri",
    "Siem Reap",
    "Stung Treng",
    "Svay Rieng",
    "Takeo",
    "Tbong Khmum"
]


def levenshtein_distance(s1, s2):
    """Compute the Levenshtein distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]


def correct_province(detected):
    """Find the closest matching Cambodian province to the detected text."""
    if not detected:
        return "unreadable"
    detected = detected.strip().title()
    distances = [(province, levenshtein_distance(detected, province)) for province in CAMBODIA_PROVINCES]
    closest_province, min_distance = min(distances, key=lambda x: x[1])
    if min_distance > 2:  # Threshold for "unreadable"
        return "unreadable"
    return closest_province


def correct_plate(plate_txt, format_type):
    """Correct OCR output based on expected plate format."""
    if format_type == "nll-nnnn":
        expected_types = ['n', 'l', 'l', '-', 'n', 'n', 'n', 'n']
    elif format_type == "nl-nnnn":
        expected_types = ['n', 'l', '-', 'n', 'n', 'n', 'n']
    else:
        return plate_txt

    if len(plate_txt) != len(expected_types):
        return plate_txt

    corrected = []
    for char, et in zip(plate_txt, expected_types):
        if et == 'n':
            if char.isdigit():
                corrected.append(char)
            elif char in number_mapping:
                corrected.append(number_mapping[char])
            else:
                corrected.append(char)
        elif et == 'l':
            if char.isalpha():
                corrected.append(char)
            elif char in letter_mapping:
                corrected.append(letter_mapping[char])
            else:
                corrected.append(char)
        elif et == '-':
            corrected.append(char)
    return ''.join(corrected)
