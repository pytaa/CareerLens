import pandas as pd

# 1. Baca dataset yang ada saat ini
file_name = 'learning_resources_ULTIMATE.csv'
df = pd.read_csv(file_name)

# 2. Daftar kata kunci spesifik yang merusak konteks (kasus Sugar, Genomic, dll)
precise_bad_keywords = [
    r'\bsugar\b', r'arqueológica', r'\bgenomic\b', r'\binvestment\b', r'\bclinical\b', 
    r'\bhealthcare\b', r'\bmedical\b', r'\bfinance\b', r'\baccounting\b', 
    r'\bbiology\b', r'\barchaeological\b', r'gestión'
]

# Combine menjadi satu regex pattern
pattern = '|'.join(precise_bad_keywords)

# 3. Buang baris yang mengandung keyword tersebut
# Menggunakan regex=True dan case=False agar pencarian akurat
df_cleaned = df[~df['nama_skill'].str.contains(pattern, case=False, na=False, regex=True)]

# 4. Simpan kembali dengan nama yang sama (menimpa file lama yang kotor)
df_cleaned.to_csv(file_name, index=False)

print(f"Selesai! {len(df) - len(df_cleaned)} baris kotor berhasil dibuang.")
print(f"File {file_name} sekarang sudah bersih dengan total {len(df_cleaned)} baris data.")