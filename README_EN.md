# ALTAR-NASA: Flame in Freefall

**Language / Dil:** English | [Türkçe](./README.md)

**Microgravity & Partial-Gravity Combustion Physics, 3D Digital Twin & NASA PSI Analysis Platform**  
*NASA Space Apps Challenge — "Flame in Freefall" Engineering Solution*

**Live Web Application (No Installation):** [https://faruk042.github.io/Nasa/](https://faruk042.github.io/Nasa/)  
**Open-Source Repository:** [https://github.com/Faruk042/Nasa](https://github.com/Faruk042/Nasa)  
**License:** Apache License 2.0

---

## Executive Summary

**ALTAR-NASA: Flame in Freefall** is a physics-based combustion engineering and decision-support platform built on NASA's **Physical Sciences Informatics (PSI)** and **Technical Reports Server (NTRS)** archives. Designed for the International Space Station (ISS), Cygnus spacecraft, Artemis Lunar habitats, pressurized rovers, and EVA spacesuits, it ranks orbital combustion experiments by mathematical proximity, compares intra-run and cross-investigation findings, simulates flames inside an interactive **3D WebGL combustion chamber**, and exports predictive datasets (`.CSV` / `.JSON` / `.MD`).

The repository includes two complete runtime modes:

1. **Offline Desktop & Local Python Edition (`main_nasa.py`, `core/`, and `Nasa_4.exe`):** Runs the closed-form analytical transport solver (`d²`, `B_oq`, `Sh`, `Ra`, `Ri`, `Da`, `χ_r`, `MOC`), 15-experiment NASA PSI ranking engine, live `psi.nasa.gov` / `ntrs.nasa.gov` / `osdr.nasa.gov` telemetry stream, native NASA PSI `Experimental Table` (`.csv`, `.xlsx`, `.tsv`, `.zip`, `.pdf`, `.json`) unit normalizer, and RGB/HSV flame image analyzer locally without requiring cloud connectivity.
2. **Browser-Native Serverless Web Edition (`web_serverless/`):** Runs directly inside any modern browser on GitHub Pages with zero backend servers or installation (`build_serverless_web.py`).

---

## Application Modules & Interface Walkthrough

The interface is organized into **5 clear modules** with instant **TR / EN** bilingual switching in the top bar:

### 1. Combustion Chamber — 3D Digital Twin, ISS Flight Validation (`R² = 0.996`) & MOC Map

![Combustion Chamber — 3D Sapphire Spherical Flame & Live Measurements](docs/screenshots/01_3d_digital_twin_0g_sphere.png)

- **Three.js 3D Combustion Chamber:** Dynamically renders 4 physical specimen geometries based on the selected material (liquid droplet on quartz fiber, solid PMMA rod, Nomex/Sibal fabric sheet, and porous spherical gas burner) across `0G` sapphire spherical diffusion flames, `600 K` invisible cool flames, and `1G` buoyant plumes.
- **Real ISS Flight Data Validation:** Overlays empirical NASA Glenn Research Center flight data (FLEX, CFI, and BASS) directly onto the live charts and computes goodness-of-fit (`R² = 0.996`, `RMSE = 0.015`).
- **U-Shaped MOC Flammability Map & 0–30 s Multi-Sensor Chart:** Solves the micro-ventilation Minimum Oxygen Concentration (`MOC`) curve (`2–8 cm/s` danger trough) alongside optical, infrared (`IR`), and carbon monoxide (`CO`) sensor traces.
- **Audience Views & Predictive Data Export:** Switch between **Researcher**, **Student**, and **Engineer** views, and download full time-series and validation metrics via **Download CSV**, **Download JSON**, and **Download Report**.

![Governing Equations, Life Support Clock & Guided Tour](docs/screenshots/02_formulas_eclss_clock_and_tour.png)

- **Governing Equations & Life Support Clock:** Displays 6 dimensionless transport equations with plain-language regime labels and computes the exact countdown (in seconds) to the `NASA-STD-3001` `125 ppm CO` emergency limit across 4 spacecraft cabin volumes (ISS Module `65 m³`, Artemis Cabin `16 m³`, Pressurized Lunar Rover `11 m³`, and EVA Spacesuit `0.22 m³`).
- **Guided Tour:** Walks judges, students, and researchers through 5 interactive mission scenarios step by step.

---

### 2. NASA Experiments — 15 PSI Investigations, Hardware Filters & Earth Applications

![NASA Experiments — PSI Ranking & Orbital Hardware Filters](docs/screenshots/03_psi_ranking_and_hardware_racks.png)

- **Mathematical Experiment Ranking:** Scores 15 verified NASA PSI investigations (FLEX, FLEX-2, CFI, CFI-G, ACME, BASS, BASS-II, SoFIE, SoFIE-MIST, Saffire I–VI, SPICE, SLISE, SAME, and DAFT) by combining normalized Euclidean parameter distance (`32%`), fire hazard weight (`24%`), and TF-IDF term similarity (`44%`).
- **4 Orbital Hardware Filters & Two-Way Chamber Sync:** Filter by **ISS CIR Chamber**, **ISS MSG Flow Duct**, **Cygnus Large-Scale**, and **Smoke & Lunar Dust**; click **Load in 3D** on any row to apply that flight experiment's exact boundary conditions to the 3D chamber.
- **Test Variations, Cross-Experiment Comparison & Earth Applications:** Inspect held-constant vs. varied parameters within individual ISS test runs, compare multiple investigations side by side, and explore 5 verified terrestrial spin-offs (PBI/Nomex firefighter gear, SoFIE-MIST water-mist suppression for EV batteries and data centers, multi-angle smoke detectors, HCCI engines, and hospital oxygen safety).

---

### 3. Data & Imagery — Live NASA PSI/NTRS Stream & Dataset/Flame Analysis

![Data & Imagery — Live NASA Stream & Flame Pixel Analysis](docs/screenshots/04_live_nasa_stream_and_rag.png)

- **Live NASA PSI & NTRS Archive Search:** Queries official `psi.nasa.gov`, `ntrs.nasa.gov`, and `osdr.nasa.gov` REST APIs for microgravity combustion papers and datasets, and directly resolves `https://psi.nasa.gov/physci/repo/data/investigations/PSI-XX` URLs by downloading their `Experimental Table` records into the 3D chamber.
- **NASA PSI Experimental Table & Flame Analysis:** Directly parses raw NASA PSI `Experimental Table` files across `.csv`, `.xlsx`, `.tsv`, `.zip`, `.pdf`, and `.json` formats — automatically converting oxygen mole fractions (`X_O2 -> %O₂`), pressure units (`mmHg`/`torr`, `bar`, `atm`, `kPa -> psia`), temperatures (`°C -> K`), and helium/carbon-dioxide diluents while grouping multi-run matrices into interactive `Phase 1..N` chamber presets. Also analyzes uploaded flame photographs (`.png`, `.jpg`) pixel-by-pixel in RGB/HSV space to quantify blue `CH*` chemiluminescence vs. yellow soot incandescence and aspect-ratio (`H/W`) sphericity.

---

### 4. Engineering Analysis — Multi-Point Parameter Sweeps & Safety Auditing

![Engineering Analysis — Multi-Habitat Comparison Table](docs/screenshots/05_evidence_synthesis_console.png)

- **Multi-Point Analytical Sweeps:** Runs background parameter sweeps across ISS (`14.7 psia, 21% O₂`), Artemis Lunar Base / Pressurized Rover (`10.2 psia, 32% O₂`), Saffire-V (`8.2 psia, 34% O₂`), and EVA Spacesuit (`4.3 psia, 100% O₂`) atmospheres to generate structured comparison tables of critical `MOC`, flame temperature, spread rate, and CO survival margins.
- **NASA-STD-6001B Safety Check:** Enforces spacecraft fire-suppression rules — rejecting Halon 1301 in sealed cabins due to toxic hydrogen fluoride (`HF`) formation and recommending **Ventilation Shutoff (`U -> 0`) + Fine Water Mist (`SoFIE-MIST`, `<100 µm`)** with clickable NTRS report citations.

---

### 5. Validation & Settings — Physical Rules (`CON-01..CON-09`) & Solver Status

![Validation & Settings — Physical Rules & Solver Status](docs/screenshots/06_calibration_and_constraints.png)

- **9 Physical Validation Rules (`CON-01` – `CON-09`):** Documents the enforced transport laws, including spherical diffusion (`Sh -> 2`), `d²` droplet kinetics, micro-ventilation `MOC` minimums, cool-flame (`550–780 K` NTC chemistry), Halon prohibition, and Lunar/Martian partial-gravity bounding prior to upcoming LUCI and FM2 missions.
- **Standalone Solver & Optional Local Model Settings:** The Analytical Physics Solver operates completely standalone offline; optional local models or external gateways can also be configured from this tab.

---

## Governing Transport Equations

All equations are solved in closed form in [`core/physics_engine.py`](core/physics_engine.py) (and mirrored for client-side browser execution in [`build_serverless_web.py`](build_serverless_web.py)):

| Physical Law / Dimensionless Group | Formulation | Engineering Role |
| :--- | :--- | :--- |
| **D² Droplet Law** | `d²(t) = d₀² - K · t` | Droplet surface-area regression rate (`K`, `mm²/s`) and total burn lifetime (`t_b`). |
| **Spalding Transfer Number** | `B_oq = [Y_O2 · ΔH_c / ν_s + c_p(T_∞ - T_b)] / L_v` | Ratio of flame thermal feedback to latent heat of vaporization. |
| **Sherwood & Ranz-Marshall** | `Sh = 2.0 + 0.6 · Re^(1/2) · Sc^(1/3)` | Convective-diffusive mass transfer converging to pure spherical diffusion (`Sh -> 2.0`) in quiescent `0G`. |
| **Grashof, Rayleigh & Richardson** | `Gr = g·β·ΔT·L³ / ν²`, `Ra = Gr·Pr`, `Ri = Gr / Re²` | Collapse of buoyant convection (`Ra -> 0`) in freefall and buoyancy-to-ventilation ratio. |
| **Damköhler & Radiative Loss** | `Da = τ_flow / τ_chem`, `χ_r` | High-airflow blowoff (`Da < 1`) vs. radiative quenching (`χ_r > 0.58`) into `600 K` cool flames. |
| **Partial-Gravity & U-Curve MOC** | `V_eff = √(U_fan² + U_buoy(g)²)`, `MOC(U, P, g)` | Minimum Oxygen Concentration boundary across ISS (`0G`), Moon (`0.16G`), Mars (`0.38G`), and Earth (`1G`). |

---

## Quick Start & Build Instructions

### 1. Instant Browser Access (Zero Setup)
Open directly in any browser:  
**[https://faruk042.github.io/Nasa/](https://faruk042.github.io/Nasa/)**

### 2. Run Locally from Python Source (Windows / macOS / Linux)

```bash
git clone https://github.com/Faruk042/Nasa.git
cd Nasa
pip install -r requirements.txt

# Launch the desktop launcher and local web interface:
python main_nasa.py

# Run the automated physics, ranking, and validation test suite:
python main_nasa.py --self-test
```

To test all simulation geometries, governing equations, cool-flame diagnostics, `SoFIE-MIST` suppression, and `SAME/DAFT` aerosol discrimination in a single file upload, attach `sample_data/ALTAR_NASA_Tam_Kapsamli_Deney_Verisi.csv` or any official `Experimental Table` (`.csv`, `.xlsx`, `.zip`) downloaded from `psi.nasa.gov` inside the **Engineering Analysis** or **Data & Imagery** module.

### 3. Build Standalone `.exe` & Serverless Static Web Bundle

```bash
# Compile single-file Windows executable (dist/Nasa_4.exe):
pyinstaller --noconfirm --clean Nasa_4.spec

# Rebuild the GitHub Pages serverless static web bundle (web_serverless/):
python build_serverless_web.py
```

---

## Primary NASA References

1. **NASA Physical Sciences Informatics (PSI) Combustion Repository:** [https://psi.nasa.gov/physci/repo/search?q=combustion](https://psi.nasa.gov/physci/repo/search?q=combustion) & [https://osdr.nasa.gov/bio/repo/](https://osdr.nasa.gov/bio/repo/)
2. **NASA Technical Reports Server (NTRS):** [https://ntrs.nasa.gov/](https://ntrs.nasa.gov/) (FLEX, BASS-II, Saffire I–VI, SoFIE, SAME/DAFT reports)
3. **NASA Glenn Research Center — Combustion Science:** *Combustion Integrated Rack (CIR), Microgravity Science Glovebox (MSG), Cool Flames Investigation (CFI) & ACME.*
4. **NASA-STD-6001B & NASA-STD-3001:** *Flammability, Offgassing, and Compatibility Requirements* & *Spaceflight Human-System Standard (SMAC CO Limits).*
