// 1) Um animal se sente confortável se está num bioma adequado e com espaço suficiente para cada indivíduo (OK)
// 2) Animais carnívoros devem habitar somente com a própria espécie (OK)
// 3) Animais já presentes no recinto devem continuar confortáveis com a inclusão do(s) novo(s) (OK)
// 4) Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio (OK)
// 5) Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie (OK)
// 6) Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado (OK)
// 7) Não é possível separar os lotes de animais nem trocar os animais que já existem de recinto (eles são muito apegados!). (OK)
// Por exemplo, se chegar um lote de 12 macacos, não é possível colocar 6 em 2 recintos. (OK)


class RecintosZoo {
    constructor() {
      this.recintos = [
        { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'macaco', quantidade: 3 }] },
        { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
        { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'gazela', quantidade: 1 }] },
        { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
        { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'leao', quantidade: 1 }] }
      ];
  
      this.animais = {
        leao: { tamanho: 3, biomas: ['savana'], carnivoro: true },
        leopardo: { tamanho: 2, biomas: ['savana'], carnivoro: true },
        crocodilo: { tamanho: 3, biomas: ['rio'], carnivoro: true },
        macaco: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
        gazela: { tamanho: 2, biomas: ['savana'], carnivoro: false },
        hipopotamo: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
      };
    }
  
    analisaRecintos(especie, quantidade) {
      // Verifica se o animal informado é válido
      if (!this.animais[especie.toLowerCase()]) {
        return { erro: "Animal inválido", recintosViaveis: null };
      }
  
      // Verifica se a quantidade é válida (maior que zero)
      if (quantidade <= 0) {
        return { erro: "Quantidade inválida", recintosViaveis: null };
      }
  
      // Pega as informações do animal (tamanho e biomas compatíveis)
      const animalInfo = this.animais[especie.toLowerCase()];
      // Calcula o espaço necessário para esse animal no recinto
      const tamanhoNecessario = quantidade * animalInfo.tamanho;
      const recintosViaveis = [];
  
      // Percorre cada recinto existente para verificar se o animal pode ser colocado lá
      for (let recinto of this.recintos) {
        let espacoOcupado = 0;
        let carnivoroPresente = false;
        let outraEspeciePresente = false;
        let macacoSozinho = false;
  
        // Checa se já existem animais nesse recinto e atualiza o espaço ocupado
        for (let animal of recinto.animais) {
          const infoAnimalExistente = this.animais[animal.especie];
          espacoOcupado += animal.quantidade * infoAnimalExistente.tamanho;
  
          // Marca se já existe um carnívoro no recinto
          if (infoAnimalExistente.carnivoro) {
            carnivoroPresente = true;
          }
  
          // Verifica se existe uma espécie diferente da que estamos tentando colocar
          if (animal.especie !== especie.toLowerCase()) {
            outraEspeciePresente = true;
          }
  
          // Marca se existe um macaco sozinho, pois macacos não podem ficar sozinhos
          if (animal.especie === 'macaco' && animal.quantidade === 1) {
            macacoSozinho = true;
          }
        }
  
        const espacoTotal = recinto.tamanho;
        const espacoDisponivel = espacoTotal - espacoOcupado;
  
        // Regra: Carnívoros não podem dividir recinto com outras espécies
        if (carnivoroPresente && especie.toLowerCase() !== this.animais[recinto.animais[0]?.especie]?.especie) continue;
        if (animalInfo.carnivoro && outraEspeciePresente) continue;
  
        // Regra: Macacos não gostam de ficar sozinhos
        if (macacoSozinho && especie.toLowerCase() === 'macaco') continue;
  
        // Verifica se o bioma do recinto é compatível com o bioma do animal
        if (!animalInfo.biomas.some(bioma => recinto.bioma.includes(bioma))) continue;
  
        // Se houver outra espécie no recinto, é necessário considerar 1 espaço extra
        const espacoExtra = outraEspeciePresente ? 1 : 0;
  
        // Verifica se ainda há espaço suficiente no recinto, considerando o espaço extra
        if (espacoDisponivel - espacoExtra >= tamanhoNecessario) {
          const espacoLivre = espacoDisponivel - espacoExtra - tamanhoNecessario;
          recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${espacoTotal})`);
        }
      }
  
      // Se nenhum recinto for viável, retorna uma mensagem de erro
      if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável", recintosViaveis: null };
      }
  
      // Ordena os recintos viáveis pelo número do recinto
      recintosViaveis.sort((a, b) => {
        const numA = parseInt(a.match(/Recinto (\d+)/)[1]);
        const numB = parseInt(b.match(/Recinto (\d+)/)[1]);
        return numA - numB;
      });
  
      // Retorna a lista de recintos viáveis sem erros
      return { erro: null, recintosViaveis };
    }
  }
  
  export { RecintosZoo as RecintosZoo };
  