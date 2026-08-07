import { ProfileService } from './service/profile.service.js';
import { ProfileUI } from './ui/profile.ui.js';

const ui = new ProfileUI('cardsContainer');

async function init() {
  ui.showLoading();

  try {
    // Busca exclusivamente perfis
    const players = await ProfileService.getPlayerProfiles();
    
    ui.renderProfiles(players, {
      onSelectProfile: (player) => {
        console.log('Jogador selecionado:', player);
        // Exibir o overlay de boas-vindas / iniciar sessão
      }
    });
  } catch (err) {
    ui.showError('Não foi possível carregar a lista de jogadores.');
  }
}

document.addEventListener('DOMContentLoaded', init);