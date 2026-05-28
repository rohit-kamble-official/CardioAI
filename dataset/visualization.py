"""
CardioAI — Data Visualization Script
Generates all analytics charts and saves them to /dataset/charts/
Run: python visualization.py
"""
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import os

BASE = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(BASE, 'heart_attack_dataset.csv')
OUT = os.path.join(BASE, 'charts')
os.makedirs(OUT, exist_ok=True)

DARK_BG = '#111827'
CARD_BG = '#1E2A3B'
CRIMSON = '#C1121F'
GREEN = '#10B981'
AMBER = '#F59E0B'
BLUE = '#3B82F6'
TEXT = '#F9FAFB'
MUTED = '#9CA3AF'

plt.rcParams.update({
    'figure.facecolor': DARK_BG, 'axes.facecolor': CARD_BG,
    'axes.edgecolor': '#374151', 'axes.labelcolor': TEXT,
    'xtick.color': MUTED, 'ytick.color': MUTED,
    'text.color': TEXT, 'grid.color': '#374151', 'grid.alpha': 0.4,
    'font.family': 'DejaVu Sans', 'font.size': 11,
})

df = pd.read_csv(CSV)
print(f"Loaded {len(df)} records")

# ─── 1. Risk Distribution Pie ─────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(7, 5))
counts = df['RiskLevel'].value_counts()
colors_pie = [GREEN, AMBER, CRIMSON]
labels_map = {'Low': f"Low ({counts.get('Low', 0)})", 
              'Medium': f"Medium ({counts.get('Medium', 0)})", 
              'High': f"High ({counts.get('High', 0)})"}
ordered = [k for k in ['Low', 'Medium', 'High'] if k in counts.index]
wedges, texts, autotexts = ax.pie(
    [counts[k] for k in ordered],
    labels=[labels_map[k] for k in ordered],
    colors=colors_pie[:len(ordered)],
    autopct='%1.1f%%', startangle=90,
    wedgeprops={'edgecolor': DARK_BG, 'linewidth': 2},
    textprops={'color': TEXT, 'fontsize': 12}
)
for at in autotexts: at.set_color(DARK_BG); at.set_fontweight('bold')
ax.set_title('Heart Attack Risk Distribution', fontsize=15, fontweight='bold', color=TEXT, pad=15)
plt.tight_layout()
plt.savefig(os.path.join(OUT, '1_risk_distribution.png'), dpi=150, bbox_inches='tight', facecolor=DARK_BG)
plt.close()
print("✅ 1_risk_distribution.png")

# ─── 2. Age vs Risk Score ─────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 5))
bins = [17, 30, 40, 50, 60, 70, 90]
labels = ['18-30', '31-40', '41-50', '51-60', '61-70', '71+']
df['AgeGroup'] = pd.cut(df['Age'], bins=bins, labels=labels)
age_risk = df.groupby('AgeGroup', observed=True)['RiskScore'].mean()
bar_colors = [GREEN, GREEN, AMBER, AMBER, CRIMSON, CRIMSON]
bars = ax.bar(age_risk.index, age_risk.values, color=bar_colors[:len(age_risk)], 
              edgecolor=DARK_BG, linewidth=1.5, width=0.6)
for bar, val in zip(bars, age_risk.values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, 
            f'{val:.1f}', ha='center', va='bottom', fontsize=10, color=TEXT, fontweight='bold')
ax.set_xlabel('Age Group (years)', fontsize=12, labelpad=8)
ax.set_ylabel('Average Risk Score (%)', fontsize=12, labelpad=8)
ax.set_title('Age vs Average Cardiac Risk Score', fontsize=15, fontweight='bold', color=TEXT, pad=15)
ax.set_ylim(0, 100)
ax.grid(axis='y', alpha=0.3)
ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(OUT, '2_age_vs_risk.png'), dpi=150, bbox_inches='tight', facecolor=DARK_BG)
plt.close()
print("✅ 2_age_vs_risk.png")

# ─── 3. Correlation Heatmap ───────────────────────────────────────────────────
from sklearn.preprocessing import LabelEncoder
df_enc = df.copy()
for col in df_enc.select_dtypes('object').columns:
    df_enc[col] = LabelEncoder().fit_transform(df_enc[col].astype(str))
df_enc.drop(columns=['Patient_ID', 'AgeGroup'], errors='ignore', inplace=True)
corr = df_enc.corr()

fig, ax = plt.subplots(figsize=(13, 11))
import matplotlib.colors as mcolors
cmap = mcolors.LinearSegmentedColormap.from_list('rg', ['#10B981', '#243448', '#C1121F'])
im = ax.imshow(corr, cmap=cmap, vmin=-1, vmax=1)
cols = corr.columns
ax.set_xticks(range(len(cols))); ax.set_xticklabels(cols, rotation=45, ha='right', fontsize=9)
ax.set_yticks(range(len(cols))); ax.set_yticklabels(cols, fontsize=9)
for i in range(len(cols)):
    for j in range(len(cols)):
        val = corr.iloc[i, j]
        ax.text(j, i, f'{val:.2f}', ha='center', va='center', fontsize=7,
                color='white' if abs(val) > 0.4 else MUTED, fontweight='bold' if abs(val) > 0.6 else 'normal')
plt.colorbar(im, ax=ax, fraction=0.03, pad=0.02, label='Correlation Coefficient')
ax.set_title('Feature Correlation Heatmap', fontsize=15, fontweight='bold', color=TEXT, pad=15)
plt.tight_layout()
plt.savefig(os.path.join(OUT, '3_correlation_heatmap.png'), dpi=150, bbox_inches='tight', facecolor=DARK_BG)
plt.close()
print("✅ 3_correlation_heatmap.png")

# ─── 4. BP Distribution by Risk Level ────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 5))
for level, color in [('Low', GREEN), ('Medium', AMBER), ('High', CRIMSON)]:
    subset = df[df['RiskLevel'] == level]['BloodPressure']
    if len(subset): ax.hist(subset, bins=25, alpha=0.65, color=color, label=f'{level} Risk', edgecolor='none')
ax.set_xlabel('Blood Pressure (mmHg)', fontsize=12, labelpad=8)
ax.set_ylabel('Number of Patients', fontsize=12, labelpad=8)
ax.set_title('Blood Pressure Distribution by Risk Level', fontsize=15, fontweight='bold', color=TEXT, pad=15)
ax.legend(fontsize=11)
ax.grid(axis='y', alpha=0.3)
ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(OUT, '4_bp_distribution.png'), dpi=150, bbox_inches='tight', facecolor=DARK_BG)
plt.close()
print("✅ 4_bp_distribution.png")

# ─── 5. Cholesterol vs Heart Attack ──────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 5))
for ha_val, label, color in [(0, 'No Heart Attack', GREEN), (1, 'Heart Attack', CRIMSON)]:
    d = df[df['HeartAttack'] == ha_val]['Cholesterol']
    ax.hist(d, bins=30, alpha=0.65, color=color, label=label, edgecolor='none')
ax.set_xlabel('Cholesterol (mg/dL)', fontsize=12, labelpad=8)
ax.set_ylabel('Patient Count', fontsize=12, labelpad=8)
ax.set_title('Cholesterol Levels: Heart Attack vs No Event', fontsize=15, fontweight='bold', color=TEXT, pad=15)
ax.legend(fontsize=11)
ax.grid(axis='y', alpha=0.3)
ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(OUT, '5_cholesterol_analysis.png'), dpi=150, bbox_inches='tight', facecolor=DARK_BG)
plt.close()
print("✅ 5_cholesterol_analysis.png")

# ─── 6. Smoking Risk Bar ─────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(7, 5))
smoking_risk = df.groupby('Smoking')['HeartAttack'].mean() * 100
order = [s for s in ['Never', 'Former', 'Current'] if s in smoking_risk.index]
vals = [smoking_risk[s] for s in order]
colors_s = [GREEN, AMBER, CRIMSON]
bars = ax.bar(order, vals, color=colors_s, edgecolor=DARK_BG, linewidth=1.5, width=0.5)
for bar, val in zip(bars, vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{val:.1f}%', ha='center', va='bottom', fontsize=12, fontweight='bold')
ax.set_xlabel('Smoking Status', fontsize=12, labelpad=8)
ax.set_ylabel('Heart Attack Rate (%)', fontsize=12, labelpad=8)
ax.set_title('Heart Attack Rate by Smoking Status', fontsize=15, fontweight='bold', color=TEXT, pad=15)
ax.set_ylim(0, 100)
ax.grid(axis='y', alpha=0.3)
ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(OUT, '6_smoking_risk.png'), dpi=150, bbox_inches='tight', facecolor=DARK_BG)
plt.close()
print("✅ 6_smoking_risk.png")

# ─── 7. Gender Comparison ────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(11, 5))
gender_risk = df.groupby('Gender')['HeartAttack'].mean() * 100
genders = [g for g in ['Male', 'Female'] if g in gender_risk.index]
colors_g = [BLUE, '#FF4D6D']
axes[0].bar(genders, [gender_risk[g] for g in genders], color=colors_g, edgecolor=DARK_BG, linewidth=1.5, width=0.4)
for i, (g, v) in enumerate(zip(genders, [gender_risk[g] for g in genders])):
    axes[0].text(i, v + 0.5, f'{v:.1f}%', ha='center', fontsize=12, fontweight='bold')
axes[0].set_title('Heart Attack Rate by Gender', fontsize=13, fontweight='bold', color=TEXT)
axes[0].set_ylabel('Heart Attack Rate (%)', fontsize=11)
axes[0].set_ylim(0, 80)
axes[0].grid(axis='y', alpha=0.3)
axes[0].spines['top'].set_visible(False); axes[0].spines['right'].set_visible(False)
axes[0].set_facecolor(CARD_BG)

gender_counts = df['Gender'].value_counts()
axes[1].pie([gender_counts.get(g, 0) for g in genders], labels=genders,
            colors=colors_g, autopct='%1.1f%%', startangle=90,
            wedgeprops={'edgecolor': DARK_BG, 'linewidth': 2},
            textprops={'color': TEXT, 'fontsize': 12})
axes[1].set_title('Gender Distribution', fontsize=13, fontweight='bold', color=TEXT)
axes[1].set_facecolor(DARK_BG)
plt.tight_layout()
plt.savefig(os.path.join(OUT, '7_gender_comparison.png'), dpi=150, bbox_inches='tight', facecolor=DARK_BG)
plt.close()
print("✅ 7_gender_comparison.png")

# ─── 8. Feature Importance (Random Forest) ───────────────────────────────────
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
df2 = df.copy().drop(columns=['Patient_ID', 'RiskScore', 'RiskLevel', 'AgeGroup'], errors='ignore')
for col in df2.select_dtypes('object').columns:
    df2[col] = LabelEncoder().fit_transform(df2[col].astype(str))
X = df2.drop(columns=['HeartAttack']); y = df2['HeartAttack']
X_sc = StandardScaler().fit_transform(X)
rf = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1)
rf.fit(X_sc, y)
fi = pd.Series(rf.feature_importances_, index=X.columns).sort_values(ascending=True).tail(10)

fig, ax = plt.subplots(figsize=(9, 6))
colors_fi = [CRIMSON if v > 0.08 else AMBER if v > 0.05 else BLUE for v in fi.values]
bars = ax.barh(fi.index, fi.values, color=colors_fi, edgecolor=DARK_BG, linewidth=1)
for bar, val in zip(bars, fi.values):
    ax.text(bar.get_width() + 0.002, bar.get_y() + bar.get_height()/2,
            f'{val:.3f}', va='center', fontsize=10, fontweight='bold')
ax.set_xlabel('Feature Importance Score', fontsize=12, labelpad=8)
ax.set_title('Top 10 Feature Importances (Random Forest)', fontsize=15, fontweight='bold', color=TEXT, pad=15)
ax.grid(axis='x', alpha=0.3)
ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
patches = [mpatches.Patch(color=CRIMSON, label='High importance'),
           mpatches.Patch(color=AMBER, label='Medium importance'),
           mpatches.Patch(color=BLUE, label='Lower importance')]
ax.legend(handles=patches, fontsize=10, loc='lower right')
plt.tight_layout()
plt.savefig(os.path.join(OUT, '8_feature_importance.png'), dpi=150, bbox_inches='tight', facecolor=DARK_BG)
plt.close()
print("✅ 8_feature_importance.png")

print(f"\n✅ All 8 charts saved to {OUT}/")
