// Progresso salvo no navegador: moedas de gosma, melhorias da loja e mundos liberados.
const PROGRESSO = (() => {
  const CHAVE = 'cdm_progresso';
  let dados = { moedas: 0, mundo: 0, up: {} };
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    if (salvo) dados = Object.assign(dados, salvo);
    // compatibilidade com a versão anterior
    const antigo = +localStorage.getItem('cdm_mundo') || 0;
    if (antigo > dados.mundo) dados.mundo = antigo;
  } catch (e) {}
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) {} };
  return {
    get moedas() { return dados.moedas; },
    ganhar(n) { dados.moedas += n; salvar(); },
    gastar(n) { if (dados.moedas < n) return false; dados.moedas -= n; salvar(); return true; },
    get mundo() { return dados.mundo; },
    liberar(n) { if (n > dados.mundo) { dados.mundo = n; salvar(); } },
    nivel(up) { return dados.up[up] || 0; },
    subir(up) { dados.up[up] = (dados.up[up] || 0) + 1; salvar(); },
    zerar() { dados = { moedas: 0, mundo: 0, up: {} }; salvar(); },
  };
})();
