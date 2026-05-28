import React, { useState } from 'react';
import { FiArrowLeft, FiX, FiChevronDown } from 'react-icons/fi';
import { BiBrain, BiBarChartAlt2 } from 'react-icons/bi';
import PageHeader from "../../components/PageHeader.jsx";

const SkillSelection = ({ onAnalyze }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Daftar skill
  const availableSkills = [
    "2d/3d animation", "3d mathematics", "3d modeling", "3ds max", "a/b testing",
    "accessibility (wcag)", "active directory", "adobe after effects", "adobe illustrator",
    "adobe photoshop", "adobe premiere pro", "adobe xd", "affinity mapping", "agile",
    "ahrefs", "airflow", "amazon seller central", "amplitude", "analytics reporting",
    "android studio", "angular", "ansible", "apache spark", "api testing", "appium",
    "arcore", "arkit", "attribution modeling", "audience research", "aws", "aws iot",
    "azure", "azure iot", "backup & recovery", "backup management", "bash", "bash scripting",
    "bert", "bgp", "bigquery", "blender", "blockchain architecture", "blog writing",
    "bpmn", "brand advocacy", "brand identity", "brand messaging", "brand voice",
    "budgeting", "burp suite", "business requirements documentation", "c#", "c++", "c/c++",
    "campaign coordination", "campaign performance analysis", "campaign reporting",
    "canva", "ci/cd", "cinema 4d", "cisco networking", "cloud architecture",
    "cloud infrastructure", "cloud security", "cloudformation", "cms", "cnns",
    "collaboration", "color theory", "community engagement", "compliance",
    "compliance auditing", "component design", "content analytics", "content creation",
    "content marketing", "content moderation", "content strategy", "copywriting",
    "crm", "crm analytics", "crm data management", "cro", "cryptography", "css",
    "cuda", "customer segmentation", "cyber threat intelligence", "dapps", "data analysis",
    "data entry", "data guard", "data modeling", "data vault", "data visualization",
    "data warehouse design", "data warehousing", "data-driven strategy", "database design",
    "database recovery", "dax", "dbt", "deep learning", "deep neural networks",
    "design systems", "design tokens", "digital marketing", "digital painting",
    "disaster recovery", "discord management", "dns", "docker", "documentation",
    "editing", "editorial planning", "email automation", "email communication",
    "email management", "email marketing", "embedded linux", "enterprise architecture",
    "erd design", "ethereum", "etl", "event coordination", "excel", "express.js",
    "facebook business manager", "feature engineering", "figma", "fine-tuning",
    "firebase", "firewall configuration", "firewall management", "firewalls", "flask",
    "forensics", "funnel analysis", "game interface design", "game physics", "gcp",
    "git", "google ads", "google analytics", "google search console", "google workspace",
    "gpt", "gpt-4", "gpu computing", "group policy", "hadoop", "hbase", "helm",
    "heuristic evaluation", "hive", "hootsuite", "html", "hubspot", "hugging face",
    "hugging face transformers", "hyper-v", "hyperledger", "ids/ips", "image segmentation",
    "incident response", "indesign", "index optimization", "indexing", "influencer marketing",
    "information architecture", "instagram ads", "interaction design", "interview techniques",
    "intrusion detection", "inventory management", "invision", "iot", "iso 27001",
    "java", "javascript", "jetpack compose", "jira", "journey mapping", "jwt",
    "kafka", "kali linux", "keras", "keyframing", "keyword research", "kotlin",
    "kpi reporting", "kubernetes", "lan", "landing page optimization", "langchain",
    "layout design", "link building", "linux", "llms", "load balancing", "log analysis",
    "lottie", "machine learning", "malware analysis", "mapreduce", "market research",
    "marketing attribution", "marketing automation", "maya", "meta ads", "meta ads manager",
    "meta business suite", "metadata management", "metasploit", "microcontrollers",
    "microservices", "microsoft 365", "microsoft office", "mitre att&ck", "mixpanel",
    "mlflow", "mlops", "model deployment", "model fine-tuning", "mongodb", "motion graphics",
    "mqtt", "ms project", "mysql", "nagios", "named entity recognition", "network administration",
    "network architecture", "network defense", "network security", "networking",
    "nist framework", "nlp", "nltk", "node.js", "normalization", "nosql", "notion",
    "nsx", "object detection", "on-page optimization", "opencv", "openxr", "oracle",
    "ospf", "pattern libraries", "penetration testing", "performance marketing",
    "performance tuning", "pl/sql", "pmp", "postgresql", "postman", "power bi",
    "powershell", "process mapping", "procreate", "product analytics",
    "product listing optimization", "programmatic advertising", "project management",
    "project management tools", "prometheus", "prompt engineering", "prototype testing",
    "prototyping", "proxmox", "python", "pytorch", "qos", "qradar", "r", "rag", "react",
    "redis", "rendering", "replication", "requirements analysis", "research",
    "resource planning", "rest api", "restful api", "risk assessment", "risk management",
    "rnns", "roi analysis", "rtos", "salesforce crm", "sass", "scala", "sccm",
    "scheduling", "scikit-learn", "scrum", "selenium", "sem", "semrush", "sensor integration",
    "seo", "seo basics", "seo writing", "shader graph", "shader programming", "shopify",
    "siem", "sketch", "sketching", "smart contracts", "snowflake", "social media",
    "social media content", "social media management", "social media marketing",
    "social media strategy", "solidity", "solution design", "spacy", "spark",
    "spatial audio", "spatial computing", "splunk", "sql", "ssrs", "stakeholder analysis",
    "stakeholder communication", "stakeholder management", "statistical analysis",
    "statistical modeling", "storage management", "stored procedures", "storyboarding",
    "storybook", "substance painter", "survey design", "swift", "system monitoring",
    "t-sql", "tableau", "technical seo", "tensorflow", "terraform", "testng",
    "text classification", "texturing", "threat analysis", "threat intelligence",
    "threat modeling", "tiktok", "trello", "typescript", "typography", "ui/ux design",
    "uml", "unity", "unity ui", "unreal engine", "usability testing", "user feedback analysis",
    "user interface design", "user research", "uv mapping", "ux principles", "vector databases",
    "version control", "virtualization", "visio", "visual composition", "visual effects",
    "vmware", "vmware vsphere", "vsan", "vue.js", "vulnerability assessment",
    "vulnerability management", "vulnerability scanning", "wan", "web3.js", "webpack",
    "windows", "windows server", "wireframing", "woocommerce", "xcode", "yolo", "zbrush"
  ];

  // Helper untuk mengecek apakah skill sudah dipilih
  const isSkillSelected = (skill) => 
    selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase());

  // Menyaring daftar skill untuk dropdown (berdasarkan input user & belum dipilih)
  const filteredSkills = availableSkills.filter(skill => 
    skill.toLowerCase().includes(inputValue.toLowerCase()) && 
    !isSkillSelected(skill)
  );

  // Helper untuk mengecek apakah input user saat ini BENAR-BENAR ada di dalam database
  const isValidSkillInput = availableSkills.some(
    skill => skill.toLowerCase() === inputValue.trim().toLowerCase()
  );

  // FUNGSI UTAMA: Menambah skill (dari ketikan manual/tekan Enter)
  const handleAddSkill = () => {
    const trimmedSkill = inputValue.trim().toLowerCase();
    
    // Cari apakah input ada di daftar skill yang tersedia
    const matchedSkill = availableSkills.find(
      skill => skill.toLowerCase() === trimmedSkill
    );

    // HANYA simpan jika skill ditemukan di daftar dan belum dipilih
    if (matchedSkill && !isSkillSelected(matchedSkill)) {
      setSelectedSkills([...selectedSkills, matchedSkill]);
      setInputValue('');
      setIsDropdownOpen(false);
    }
    // Jika tidak cocok, sistem diam saja (tidak menyimpan input sembarangan)
  };

  // Fungsi menambah skill dari klik list dropdown
  const handleAddSkillFromList = (skill) => {
    if (!isSkillSelected(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setInputValue('');
    setIsDropdownOpen(false);
  };

  // Menangkap aksi tekan "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = () => {
    if (selectedSkills.length >= 2) {
      onAnalyze(selectedSkills);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* Header Minimalis */}
      <PageHeader/>

      {/* Main Container */}
      <main className="grow flex flex-col items-center pt-12 md:pt-16 px-6 pb-20 w-full">
        
        <div className="text-center max-w-2xl mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#030b26] mb-4">
            Analisis Skill
          </h1>
          <p className="text-slate-500 md:text-lg leading-relaxed">
            Masukkan keahlian Anda untuk mendapatkan rekomendasi sektor yang paling sesuai.
          </p>
        </div>

        {/* Card Form Input */}
        <div className="bg-white w-full max-w-3xl rounded-4xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          
          <div className="mb-8 relative">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                Keahlian Utama
              </label>
              <span className={`text-xs font-bold ${selectedSkills.length < 2 ? 'text-red-500' : 'text-green-600'}`}>
                Min. 2 Keahlian
              </span>
            </div>

            {/* Input Group */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
              <div className="pl-5 pr-2 text-slate-400">
                 <BiBrain size={22} />
              </div>
              <input 
                type="text" 
                placeholder="Ketik atau pilih keahlian Anda..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onKeyDown={handleKeyDown}
                // Saat diklik/fokus, pastikan dropdown terbuka untuk memandu user
                onFocus={() => setIsDropdownOpen(true)} 
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className="grow py-4 px-2 outline-none text-slate-700 bg-transparent placeholder:text-slate-400"
              />
              
              {/* Icon panah penanda ada dropdown */}
              <div className="px-2 text-slate-400 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                 <FiChevronDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Tombol Tambah hanya aktif jika input SAMA PERSIS dengan skill yang ada di database */}
              <button 
                onClick={handleAddSkill}
                disabled={!isValidSkillInput}
                className="bg-slate-50 hover:bg-slate-100 text-[#030b26] disabled:text-slate-400 font-bold px-8 py-4 border-l border-slate-200 transition-colors h-full"
              >
                Tambah
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && filteredSkills.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#030b26] border border-blue-900 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                {/* List Skill yang Tersedia */}
                {filteredSkills.map((skill) => (
                  <div
                    key={skill}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleAddSkillFromList(skill);
                    }}
                    className="w-full text-left px-5 py-3.5 text-white hover:bg-[#0277b6] cursor-pointer border-b border-slate-700/50 last:border-0 transition-colors text-sm font-medium capitalize"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}

            {/* Tampilkan pesan kecil jika user mengetik sesuatu yang tidak ada di list */}
            {isDropdownOpen && inputValue.trim() !== '' && filteredSkills.length === 0 && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-4 text-center text-sm text-slate-500">
                 Keahlian "{inputValue}" tidak ditemukan. Silakan pilih dari daftar yang tersedia.
               </div>
            )}
          </div>

          {/* Area Tags Keahlian */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              {selectedSkills.map((skill) => (
                <span 
                  key={skill} 
                  className="flex items-center gap-2 bg-slate-100 text-[#030b26] px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-slate-200 capitalize"
                >
                  {skill}
                  <button 
                    onClick={() => handleRemoveSkill(skill)} 
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tombol Submit */}
          <div className={`flex justify-center ${selectedSkills.length === 0 ? 'mt-10' : 'mt-6'}`}>
            <button 
              onClick={handleSubmit}
              disabled={selectedSkills.length < 2}
              className="flex items-center gap-3 bg-[#030b26] hover:bg-[#0a194f] disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
            >
              <BiBarChartAlt2 size={24} />
              Temukan Sektor dan Analisis
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SkillSelection;