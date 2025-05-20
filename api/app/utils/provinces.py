"""
Single source of truth for province data in both English and Khmer
"""

# Dictionary mapping uppercase English province names to Khmer translations
PROVINCE_DATA = {
    "CAMBODIA": "កម្ពុជា",
    "BANTEAY MEANCHEY": "បន្ទាយមានជ័យ",
    "BATTAMBANG": "បាត់ដំបង",
    "KAMPONG CHAM": "កំពង់ចាម",
    "KAMPONG CHHNANG": "កំពង់ឆ្នាំង",
    "KAMPONG SPEU": "កំពង់ស្ពឺ",
    "KAMPONG THOM": "កំពង់ធំ",
    "KAMPOT": "កំពត",
    "KANDAL": "កណ្តាល",
    "KEP": "កែប",
    "KOH KONG": "កោះកុង",
    "KRATIE": "ក្រចេះ",
    "MONDULKIRI": "មណ្ឌលគិរី",
    "ODDAR MEANCHEY": "ឧត្ដរមានជ័យ",
    "PAILIN": "ប៉ៃលិន",
    "PHNOM PENH": "ភ្នំពេញ",
    "PREAH SIHANOUK": "ព្រះសីហនុ",
    "PREAH VIHEAR": "ព្រះវិហារ",
    "PREY VENG": "ព្រៃវែង",
    "PURSAT": "ពោធិ៍សាត់",
    "RATANAKIRI": "រតនៈគិរី",
    "SIEM REAP": "សៀមរាប",
    "STUNG TRENG": "ស្ទឹងត្រែង",
    "SVAY RIENG": "ស្វាយរៀង",
    "TAKEO": "តាកែវ",
    "TBONG KHMUM": "ត្បូងឃ្មុំ",
    "SENATE": "ព្រឹទ្ធសភា",
    "POLICE": "នគរបាល",
    "RCAF": "កងយោធពលខេមរភូមិន្ទ",
    "UNREADABLE": "អានមិនដាច់"
}

# For ease of use in correction algorithms
PROVINCES_LIST = list(PROVINCE_DATA.keys())
