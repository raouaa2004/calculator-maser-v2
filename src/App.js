import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Calculator, Moon, Sun } from 'lucide-react';

const GradeCalculator = () => {
  const [specialty, setSpecialty] = useState('');
  const [semester, setSemester] = useState('');
  const [grades, setGrades] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const specialties = [
    'Réseaux et Systèmes Informatiques (RSI)',
    'Systèmes Informatiques (SI)',
    'Systèmes et Multimédia (SYM)'
  ];

  const modules = {
    'RSI-S1': [
      { name: 'Architecture des réseaux informatiques', ects: 3, coef: 3, hasTP: true, hasTD: true },
      { name: 'Modélisation et conception orienté objet', ects: 2, coef: 2, hasTP: false, hasTD: true },
      { name: 'Base de données avancées', ects: 2, coef: 2, hasTP: true, hasTD: false },
      { name: 'Programmation avancée web', ects: 2, coef: 2, hasTP: true, hasTD: false },
      { name: 'Aide à la décision', ects: 2, coef: 2, hasTP: true, hasTD: false },
      { name: 'Sécurité informatique', ects: 2, coef: 2, hasTP: true, hasTD: false },
      { name: 'Sécurité des algorithmes distribués', ects: 2, coef: 2, hasTP: false, hasTD: true },
      { name: 'Anglais scientifique 1', ects: 1, coef: 1
        , hasTP: false, hasTD: false },
      { name: 'Ethics and deontology', ects: 2, coef: 2, hasTP: false, hasTD: false }
    ],
    'SI-S1': [
      { name: 'Architecture des systèmes', ects: 3, coef: 3, hasTP: true, hasTD: true },
      { name: 'Génie logiciel avancé', ects: 2, coef: 2, hasTP: true, hasTD: true },
      { name: 'Base de données avancées', ects: 2, coef: 2, hasTP: true, hasTD: false },
      { name: 'Intelligence artificielle', ects: 2, coef: 2, hasTP: true, hasTD: false },
      { name: 'Sécurité informatique', ects: 2, coef: 2, hasTP: true, hasTD: false },
      { name: 'Sécurité des algorithmes distribués', ects: 2, coef: 2, hasTP: false, hasTD: true },
      { name: 'Anglais scientifique 1', ects: 2, coef: 2, hasTP: false, hasTD: false },
      { name: 'Ethics and deontology', ects: 2, coef: 2, hasTP: false, hasTD: false }
    ],
    'SI-S2': [
      { name: 'Systèmes distribués', ects: 3, coef: 3, hasTP: true, hasTD: true },
      { name: 'Architecture orientée services', ects: 2, coef: 2, hasTP: true, hasTD: true },
      { name: 'Big Data', ects: 2, coef: 2, hasTP: true, hasTD: false }
    ],
    'SYM-S1': [
      { name: 'Traitement d\'image et vidéo', ects: 3, coef: 3, hasTP: true, hasTD: true },
      { name: 'Infographie et animation 3D', ects: 2, coef: 2, hasTP: true, hasTD: true },
      { name: 'Programmation multimédia', ects: 2, coef: 2, hasTP: true, hasTD: false },
      { name: 'Réalité virtuelle', ects: 2, coef: 2, hasTP: true, hasTD: false },
      { name: 'Sécurité informatique', ects: 2, coef: 2, hasTP: true, hasTD: false },
      { name: 'Sécurité des algorithmes distribués', ects: 2, coef: 2, hasTP: false, hasTD: true },
      { name: 'Anglais scientifique 1', ects: 2, coef: 2, hasTP: false, hasTD: false },
      { name: 'Ethics and deontology', ects: 2, coef: 2, hasTP: false, hasTD: false }
    ],
    'SYM-S2': [
      { name: 'Design d\'interaction', ects: 3, coef: 3, hasTP: true, hasTD: true },
      { name: 'Production multimédia', ects: 2, coef: 2, hasTP: true, hasTD: true },
      { name: 'Jeux vidéo', ects: 2, coef: 2, hasTP: true, hasTD: false }
    ]
  };

  const getCurrentModules = () => {
    if (!specialty || !semester) return [];
    const specialtyCode = specialty.match(/\(([^)]+)\)/)?.[1] || '';
    const semesterNum = semester.replace('Semestre ', '');
    const key = `${specialtyCode}-S${semesterNum}`;
    return modules[key] || [];
  };

  const calculateModuleAverage = (module, moduleGrades) => {
    const exam = parseFloat(moduleGrades?.exam) || 0;
    const td = parseFloat(moduleGrades?.td) || 0;
    const tp = parseFloat(moduleGrades?.tp) || 0;

    if (module.hasTD || module.hasTP) {
      const tdtp = module.hasTD && module.hasTP ? (td + tp) / 2 : (module.hasTD ? td : tp);
      return ((exam * 2) + tdtp) / 3;
    }
    return exam;
  };

  const calculateGeneralAverage = () => {
    const currentModules = getCurrentModules();
    if (currentModules.length === 0) return 0;

    let totalWeighted = 0;
    let totalCoef = 0;

    currentModules.forEach((module, index) => {
      const moduleGrades = grades[index];
      const avg = calculateModuleAverage(module, moduleGrades);
      totalWeighted += avg * module.coef;
      totalCoef += module.coef;
    });

    return totalCoef > 0 ? (totalWeighted / totalCoef).toFixed(2) : 0;
  };

  const handleGradeChange = (moduleIndex, field, value) => {
    setGrades(prev => ({
      ...prev,
      [moduleIndex]: {
        ...prev[moduleIndex],
        [field]: value
      }
    }));
  };

  useEffect(() => {
    setGrades({});
  }, [specialty, semester]);

  const currentModules = getCurrentModules();
  const generalAverage = calculateGeneralAverage();

  const getAverageColor = (avg) => {
    return parseFloat(avg) >= 10 ? '#10b981' : '#ef4444';
  };

  const getModuleColor = (index) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
    return colors[index % colors.length];
  };

  const theme = darkMode ? {
    bg: '#0f172a',
    card: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    border: '#334155',
    input: '#334155',
    inputText: '#f1f5f9'
  } : {
    bg: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    input: '#ffffff',
    inputText: '#1e293b'
  };

  return (
    <div style={{background: theme.bg, minHeight: '100vh', fontFamily: "'Raleway', sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Raleway:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      
      {/* App Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: '#ffffff',
        padding: '16px 20px',
        boxShadow: '0 4px 24px rgba(30, 58, 138, 0.3)',
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '200px'}}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              flexShrink: 0,
            }}>
              
              <img 
                src="image.png" 
                alt="" 
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            </div>
            <div style={{minWidth: 0}}>
              <h1 style={{
                fontSize: 'clamp(18px, 4vw, 28px)',
                fontWeight: '700',
                margin: 0,
                marginBottom: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Abril Fatface', cursive",
                flexWrap: 'wrap',
              }}>
                <Calculator size={28} style={{flexShrink: 0}} />
                <span style={{wordBreak: 'break-word'}}>Calculateur de Moyenne Master</span>
              </h1>
              <p style={{fontSize: 'clamp(11px, 2.5vw, 14px)', margin: 0, opacity: 0.9}}>
                Departement de L'informatique TEBESSA
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              flexShrink: 0,
            }}
            className="button-hover"
          >
            {darkMode ? <Sun size={24} color="#fbbf24" /> : <Moon size={24} color="#ffffff" />}
          </button>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px 16px'}}>
        {/* Selection Card */}
        <div style={{...styles.card, background: theme.card, color: theme.text, borderColor: theme.border}}>
          <h2 style={{
            ...styles.sectionTitle,
            ...(darkMode ? {
              background: 'none',
              WebkitBackgroundClip: 'initial',
              WebkitTextFillColor: 'initial',
              color: '#ffffff'
            } : {})
          }}>
            <BookOpen style={styles.icon} />
            Spécialité
          </h2>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={{...styles.label, color: theme.text}}>Sélectionner votre spécialité</label>
              <select 
                value={specialty}
                onChange={(e) => {
                  setSpecialty(e.target.value);
                  setSemester('');
                }}
                style={{...styles.select, background: theme.input, color: theme.inputText, borderColor: theme.border}}
                className="input-field"
              >
                <option value="">-- Sélectionner une spécialité --</option>
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={{...styles.label, color: theme.text}}>Semestre</label>
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                disabled={!specialty}
                style={{...styles.select, background: theme.input, color: theme.inputText, borderColor: theme.border, ...(specialty ? {} : styles.selectDisabled)}}
                className="input-field"
              >
                <option value="">-- Sélectionner un semestre --</option>
                <option value="Semestre 1">Semestre 1</option>
                <option value="Semestre 2">Semestre 2</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modules */}
        {currentModules.length > 0 && (
          <div style={styles.modulesContainer}>
            {currentModules.map((module, index) => {
              const moduleGrades = grades[index] || {};
              const moduleAvg = calculateModuleAverage(module, moduleGrades);
              const avgColor = getAverageColor(moduleAvg);

              return (
                <div 
                  key={index}
                  style={{...styles.moduleCard, background: theme.card, color: theme.text, borderColor: theme.border}}
                >
                  <div style={styles.moduleHeader}>
                    <div style={styles.moduleHeaderLeft}>
                      <div style={{width: '4px', height: '40px', borderRadius: '2px', background: getModuleColor(index)}}></div>
                      <h3 style={{
                        ...styles.moduleName,
                        ...(darkMode ? {
                          background: 'none',
                          WebkitBackgroundClip: 'initial',
                          WebkitTextFillColor: 'initial',
                          color: '#ffffff'
                        } : {})
                      }}>{module.name}</h3>
                    </div>
                    <div style={styles.moduleInfo}>
                      <span style={{...styles.badge, background: `${getModuleColor(index)}20`, color: getModuleColor(index)}}>
                        Coef {module.coef}
                      </span>
                    </div>
                  </div>

                  <div style={styles.gradesGrid}>
                    <div>
                      <label style={{...styles.inputLabel, color: theme.textSecondary}}>📝 Examen</label>
                      <input 
                        type="number"
                        min="0"
                        max="20"
                        step="0.01"
                        value={moduleGrades.exam || ''}
                        onChange={(e) => handleGradeChange(index, 'exam', e.target.value)}
                        style={{...styles.input, background: theme.input, color: theme.inputText, borderColor: theme.border}}
                        className="input-field"
                        placeholder="/20"
                      />
                    </div>

                    {module.hasTD && (
                      <div>
                        <label style={{...styles.inputLabel, color: theme.textSecondary}}>📚 TD</label>
                        <input 
                          type="number"
                          min="0"
                          max="20"
                          step="0.01"
                          value={moduleGrades.td || ''}
                          onChange={(e) => handleGradeChange(index, 'td', e.target.value)}
                          style={{...styles.input, background: theme.input, color: theme.inputText, borderColor: theme.border}}
                          className="input-field"
                          placeholder="/20"
                        />
                      </div>
                    )}

                    {module.hasTP && (
                      <div>
                        <label style={{...styles.inputLabel, color: theme.textSecondary}}>💻 TP</label>
                        <input 
                          type="number"
                          min="0"
                          max="20"
                          step="0.01"
                          value={moduleGrades.tp || ''}
                          onChange={(e) => handleGradeChange(index, 'tp', e.target.value)}
                          style={{...styles.input, background: theme.input, color: theme.inputText, borderColor: theme.border}}
                          className="input-field"
                          placeholder="/20"
                        />
                      </div>
                    )}
                  </div>

                  <div style={{...styles.moduleAverage, borderColor: theme.border}}>
                    <span style={{...styles.moduleAverageLabel, color: theme.textSecondary}}>Moyenne du module</span>
                    <span style={{...styles.moduleAverageValue, color: avgColor}}>{moduleAvg.toFixed(2)} / 20</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* General Average */}
        {currentModules.length > 0 && (
          <div style={{marginTop: '32px', textAlign: 'center'}}>
            <div style={{marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
              <GraduationCap size={36} color={getAverageColor(generalAverage)} />
              <h2 style={{
                fontSize: 'clamp(24px, 5vw, 32px)',
                fontWeight: '700',
                margin: 0,
                fontFamily: "'Abril Fatface', cursive",
                color: theme.text
              }}>Moyenne Générale</h2>
            </div>

            <div style={{marginBottom: '24px'}}>
              <span style={{
                fontSize: 'clamp(56px, 12vw, 72px)',
                fontWeight: '800',
                lineHeight: 1,
                color: getAverageColor(generalAverage)
              }}>
                {generalAverage}
              </span>
              <span style={{
                fontSize: 'clamp(28px, 6vw, 36px)',
                fontWeight: '500',
                color: theme.textSecondary
              }}> / 20</span>
            </div>

            {parseFloat(generalAverage) >= 10 && (
              <div style={{...styles.validationBadge, background: '#10b981', marginBottom: '32px'}}>
                <span style={{fontSize: 'clamp(20px, 4vw, 24px)'}}>✅</span>
                <span style={{fontSize: 'clamp(16px, 3.5vw, 18px)'}}>Semestre Validé</span>
              </div>
            )}

            {parseFloat(generalAverage) > 0 && parseFloat(generalAverage) < 10 && (
              <div style={{...styles.validationBadge, background: '#ef4444', marginBottom: '32px'}}>
                <span style={{fontSize: 'clamp(20px, 4vw, 24px)'}}>❌</span>
                <span style={{fontSize: 'clamp(16px, 3.5vw, 18px)'}}>Semestre Non Validé</span>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '16px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div>
                <div style={{fontSize: '11px', fontWeight: '600', marginBottom: '8px', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px'}}>Total Modules</div>
                <div style={{fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: '800', color: '#3b82f6'}}>{currentModules.length}</div>
              </div>
              <div>
                <div style={{fontSize: '11px', fontWeight: '600', marginBottom: '8px', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px'}}>Validés</div>
                <div style={{fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: '800', color: '#10b981'}}>
                  {currentModules.filter((module, index) => {
                    const moduleGrades = grades[index];
                    const avg = calculateModuleAverage(module, moduleGrades);
                    return avg >= 10;
                  }).length}
                </div>
              </div>
              <div>
                <div style={{fontSize: '11px', fontWeight: '600', marginBottom: '8px', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px'}}>Échoués</div>
                <div style={{fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: '800', color: '#ef4444'}}>
                  {currentModules.filter((module, index) => {
                    const moduleGrades = grades[index];
                    const avg = calculateModuleAverage(module, moduleGrades);
                    return avg > 0 && avg < 10;
                  }).length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty States */}
        {!specialty && (
          <div style={{...styles.emptyState, background: theme.card, color: theme.text, borderColor: theme.border}}>
            <BookOpen size={64} color={theme.textSecondary} />
            <p style={{...styles.emptyText, color: theme.textSecondary}}>
              Veuillez sélectionner une spécialité pour commencer
            </p>
          </div>
        )}

        {specialty && !semester && (
          <div style={{...styles.emptyState, background: theme.card, color: theme.text, borderColor: theme.border}}>
            <Calculator size={64} color={theme.textSecondary} />
            <p style={{...styles.emptyText, color: theme.textSecondary}}>
              Veuillez sélectionner un semestre pour afficher les modules
            </p>
          </div>
        )}

        {specialty && semester && currentModules.length === 0 && (
          <div style={{...styles.emptyState, background: theme.card, color: theme.text, borderColor: theme.border}}>
            <BookOpen size={64} color={theme.textSecondary} />
            <p style={{...styles.emptyText, color: theme.textSecondary}}>
              Aucun module disponible pour cette combinaison
            </p>
          </div>
        )}
      </div>

      <style>{`
        .button-hover:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.25) !important;
        }
        .input-field:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
};

const styles = {
  card: {
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(30, 58, 138, 0.1)',
    padding: 'clamp(16px, 4vw, 28px)',
    marginBottom: '24px',
    border: '1px solid',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  icon: {
    fontSize: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  inputLabel: {
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '10px',
  },
  select: {
    padding: '14px 16px',
    border: '2px solid',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    fontWeight: '500',
  },
  selectDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  input: {
    padding: '12px 14px',
    border: '2px solid',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  modulesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  moduleCard: {
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(30, 58, 138, 0.1)',
    padding: 'clamp(16px, 4vw, 24px)',
    border: '1px solid',
  },
  moduleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  moduleHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  moduleName: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  moduleInfo: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  badge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  gradesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '16px',
  },
  moduleAverage: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    marginTop: '16px',
    borderTop: '2px solid',
  },
  moduleAverageLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  moduleAverageValue: {
    fontSize: '20px',
    fontWeight: '700',
  },
  generalAverageContainer: {
    marginTop: '48px',
    padding: '40px 0',
  },
  generalAverageCard: {
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(30, 58, 138, 0.1)',
    padding: '48px 24px',
    border: '1px solid',
  },
  generalAverageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '40px',
  },
  generalAverageTitle: {
    fontSize: '36px',
    fontWeight: '700',
    margin: 0,
    fontFamily: "'Abril Fatface', cursive",
  },
  generalAverageBody: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  averageDisplay: {
    marginBottom: '32px',
  },
  generalAverageNumber: {
    fontSize: 'clamp(48px, 15vw, 96px)',
    fontWeight: '800',
    lineHeight: 1,
    textShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  generalAverageMax: {
    fontSize: 'clamp(24px, 7vw, 42px)',
    fontWeight: '500',
  },
  validationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: 'clamp(12px, 3vw, 20px) clamp(20px, 5vw, 40px)',
    borderRadius: '16px',
    fontSize: 'clamp(16px, 3.5vw, 20px)',
    fontWeight: '700',
    color: 'white',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  },
  badgeIcon: {
    fontSize: '28px',
  },
  badgeText: {
    fontSize: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '24px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  statItem: {
    textAlign: 'center',
    padding: '24px',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statValue: {
    fontSize: 'clamp(32px, 8vw, 48px)',
    fontWeight: '800',
    lineHeight: 1,
  },
  emptyState: {
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(30, 58, 138, 0.1)',
    padding: '64px 24px',
    textAlign: 'center',
    border: '1px solid',
  },
  emptyText: {
    fontSize: '18px',
    marginTop: '16px',
  },
};

export default GradeCalculator;