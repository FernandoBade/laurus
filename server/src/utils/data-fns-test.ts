// Importe os métodos do seu módulo de utilitários de data
import {
    formatarDataPadraoUsuario,
    analisarData,
    datasSaoIguais,
    dataEhAnterior,
    dataEhPosterior,
    adicionarDias,
    subtrairDias,
  } from './commons'; // Atualize o caminho de importação conforme necessário

  // Teste de formatação de data com diferentes formatos
  const datasParaFormatar = ['2024-02-06T00:00:00Z', new Date(2024, 1, 6)];
  const formatos = ['dd/MM/yyyy', 'yyyy-MM-dd', 'MM/dd/yyyy', 'dd MMM yyyy'];

  datasParaFormatar.forEach((data) => {
    formatos.forEach((formato) => {
      console.log(`Data formatada (${formato}):`, formatarDataPadraoUsuario(data, formato));
    });
  });

  // Teste de análise de data com diferentes referências
  const datasParaAnalisar = ['06/02/2024', '02-06-2024', '2024.02.06'];
  const referencias = [new Date(2024, 0, 1), new Date(2024, 11, 31)];

  datasParaAnalisar.forEach((dataString, index) => {
    const formato = index === 0 ? 'dd/MM/yyyy' : index === 1 ? 'MM-dd-yyyy' : 'yyyy.MM.dd';
    referencias.forEach((referencia) => {
      console.log(`Data analisada (${formato}):`, analisarData(dataString, formato, referencia));
    });
  });

  // Testes adicionais de comparação de datas
  const datasParaComparar = [
    { data1: new Date(2024, 1, 6), data2: new Date(2024, 1, 6) }, // Mesma data
    { data1: new Date(2024, 1, 6), data2: new Date(2024, 1, 8) }, // Data1 anterior à Data2
    { data1: new Date(2024, 1, 10), data2: new Date(2024, 1, 8) }, // Data1 posterior à Data2
  ];

  datasParaComparar.forEach(({ data1, data2 }) => {
    console.log('Datas são iguais:', datasSaoIguais(data1, data2));
    console.log('Data1 é anterior à Data2:', dataEhAnterior(data1, data2));
    console.log('Data1 é posterior à Data2:', dataEhPosterior(data1, data2));
  });

  // Adição e subtração de dias com diferentes quantidades
  const baseData = new Date(2024, 1, 6);
  const diasParaManipular = [1, -1, 15, -15];

  diasParaManipular.forEach((quantidade) => {
    if (quantidade > 0) {
      console.log(`Adicionar ${quantidade} dias:`, adicionarDias(baseData, quantidade));
    } else {
      console.log(`Subtrair ${Math.abs(quantidade)} dias:`, subtrairDias(baseData, Math.abs(quantidade)));
    }
  });

  // Testes com diferentes zonas horárias (considerando que a função analisarData possa tratar isso)
  const dataStringComZonaHoraria = '2024-02-06T15:00:00+03:00'; // Data e hora com fuso horário +3 horas
  console.log('Data com zona horária específica:', analisarData(dataStringComZonaHoraria, "yyyy-MM-dd'T'HH:mm:ssXXX"));
