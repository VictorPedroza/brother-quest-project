/**
 * Calcula o nível correspondente ao XP acumulado.
 * @param {number} xp - Quantidade total de XP.
 * @returns {number} Nível atual, começando em 1.
 */
export function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

/**
 * Calcula o nível e o progresso dentro dele.
 * @param {number} xp - Quantidade total de XP.
 * @returns {{level: number, xpInLevel: number, remainingXp: number}} Progresso do nível.
 */
export function calculateLevelProgress(xp) {
  const xpInLevel = xp % 100;
  const remainingXp = 100 - xpInLevel;

  return {
    level: calculateLevel(xp),
    xpInLevel,
    remainingXp,
  };
}
