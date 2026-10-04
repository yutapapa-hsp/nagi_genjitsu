(() => {
  'use strict';
  const players = Array.from(document.querySelectorAll('.voice audio'));
  players.forEach(player => {
    player.addEventListener('play', () => {
      players.forEach(other => { if (other !== player) other.pause(); });
      if (typeof window.va === 'function') {
        window.va('event', { name: 'voice_play', data: {
          position: player.closest('[data-voice-position]').dataset.voicePosition,
          audio: player.getAttribute('src').split('/').pop()
        }});
      }
    });
  });
})();
