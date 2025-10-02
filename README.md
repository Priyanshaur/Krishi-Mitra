# Krishi Mitra

Krishi Mitra is a farmer-first, full-stack digital ecosystem that fuses AI-powered crop diagnostics, a compliant B2B agri-marketplace, and precision farm management into one seamless platform. By combining multilingual conversational interfaces with a continuously improving data backbone, the solution helps Indian farmers raise yields, secure better prices, and build resilience against climate and market shocks.

---

## 🌾 Why Krishi Mitra

- **Edge-ready diagnostics:** Lightweight CNN models (EdgePlantNet/MobileNet class) deliver fast, offline-friendly disease detection tailored to Indian agro-climatic conditions.
- **Proprietary data engine:** Farmer image uploads, agronomist validation, and feedback loops fuel a self-improving dataset that augments public corpora such as PlantVillage.
- **Farmer-centric UX:** Voice and text experiences leverage Indic ASR/TTS (e.g., Bhashini) so every farmer—regardless of literacy or dialect—receives actionable guidance.
- **Transparent trade rails:** The marketplace compresses price discovery and payouts, trimming legacy mandi inefficiencies while staying aligned with APMC/APLM norms and e-NAM integrations.
- **Precision advisories:** Hyperlocal weather (Bharat Forecast System), soil health cards, and field telemetry feed AI insights that connect diagnostics directly to interventions, procurement, and certification.

---

## 🧱 Architecture Snapshot

| Layer | Key Components | Notes |
| --- | --- | --- |
| **Frontend** (`frontend/`) | React + Vite + Tailwind UI, Redux Toolkit store, multilingual i18n | Hosts dashboards, marketplace, diagnostics UI, and the multilingual assistant. |
| **Backend** (`backend/`) | Node.js + Express, MongoDB (Mongoose), Redis | Orchestrates auth, marketplace flows, diagnostics history, notifications, and ML service hand-offs. |
| **ML Service** (`ml/`) | Python microservice (Flask/FastAPI ready) | Serves crop disease inference endpoints; extensible to on-device export. |
| **Data & Ops** | Dockerfiles, docker-compose, planned integrations with FPO logistics APIs and e-NAM | Enables containerized deployment across modules. |

---

## ⚙️ Core Capabilities

### 1. AI Crop Diagnostics
- Edge-ready CNNs enable low-latency inference on rural smartphones, with cloud escalation for complex cases.
- Dataset strategy: bootstrap with public sets, expand with farmer uploads, expert audits, and seasonal feedback.
- Conversational assistant supports image capture guidance, diagnosis explanations, and remedy walkthroughs in multiple languages and voice modes.

### 2. B2B Agri-Marketplace
- Digitally disrupts mandi middle layers by linking farmers to institutional buyers with transparent pricing, escrowed payments, and digital quality certificates.
- Hybrid operating model blends DeHaat-like farmer stickiness (extension services, advisory) with Agrim-like asset-light logistics via partner networks.
- Compliance baked in: state-specific APMC licenses, APLM Act guardrails, and e-NAM interoperability ensure legality and scale.

### 3. Smart Farm Management Suite
- Hyperlocal advisories derived from Bharat Forecast System feeds, on-field IoT nodes, and Soil Health Card data.
- Integrated workflow: diagnostics → advisory → marketplace transaction → certification → financing.
- Gov-tech partnerships (PM-KISAN, KCC onboarding) accelerate trust, data quality, and farmer acquisition.

### 4. Data Flywheel
- Every interaction (images, agronomist corrections, marketplace orders, logistics milestones) enriches a knowledge graph.
- The flywheel sharpens model accuracy, demand forecasting, input recommendations, and credit risk assessment over time.

---

## 🚀 Product Roadmap

1. **Phase I – Foundations**
   - Aggregate multi-crop disease datasets, benchmark EdgePlantNet/MobileNet variants, ship MVP diagnostics.
2. **Phase II – Conversational Intelligence**
   - Roll out multilingual voice/text copilot, onboard agronomy experts for validation and feedback loops.
3. **Phase III – Marketplace Launch**
   - Deploy B2B marketplace rails with FPO partnerships, digital quality checks, and compliant payouts.
4. **Phase IV – Precision Advisory**
   - Integrate hyperlocal weather, IoT signals, and AI advisories; automate supply reordering and intervention plans.
5. **Phase V – Certification & Finance**
   - Offer traceability, certification toolkits, embedded finance (KCC/insurance), and export readiness analytics.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker (optional but recommended for full-stack spin-up)
- MongoDB & Redis instances (local or managed)

### Install dependencies
```bash
# Root helper scripts
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# ML service
cd ../ml
pip install -r requirements.txt
```

### Run locally (dev)
```bash
# Terminal 1 – backend
cd backend
npm run dev

# Terminal 2 – frontend
cd frontend
npm run dev

# Terminal 3 – ML service
cd ml
python app.py
```

> Optional: use `backend/docker-compose.yml` to orchestrate API + MongoDB + Redis containers.

---

## 🤝 Contributing

1. Fork and clone the repository.
2. Create a feature branch (`git checkout -b feature/your-idea`).
3. Commit changes with clear messages.
4. Push and open a Pull Request describing the motivation and testing performed.

---

## 📬 Contact & Next Steps

- **Founding vision:** Build a resilient, inclusive agri-stack that materially improves farmer livelihoods.
- **What’s next:** Extend multilingual coverage, expand proprietary datasets via field pilots, and integrate embedded finance partners.
- **Let’s collaborate:** FPOs, agronomists, logistics providers, and research institutions are invited to co-create the farmer-first future.
