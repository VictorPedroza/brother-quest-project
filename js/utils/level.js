// Função de Cálculo de Nível
export function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

// Função de Cálculo da Barra de Progreso do Nível
export function calculateLevelProgress(xp) {
  const xpInLevel = xp % 100;
  const remainingXp = 100 - xpInLevel;

  return {
    level: calculateLevel(xp),
    xpInLevel,
    remainingXp,
  };
}
