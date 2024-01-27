export function selecionarTagsAleatorias(tags: string | any[], maxTags: number) {
    const numeroDeTags = Math.floor(Math.random() * (maxTags + 1)); // Gera um número entre 0 e maxTags
    const tagsSelecionadas: string | any[] = [];

    for (let i = 0; i < numeroDeTags; i++) {
        const tagAleatoria = tags[Math.floor(Math.random() * tags.length)];
        if (!tagsSelecionadas.includes(tagAleatoria._id)) {
            tagsSelecionadas.push(tagAleatoria._id);
        }
    }

    return tagsSelecionadas;
}

export function gerarNumeroAleatorio(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function gerarDataAleatoria(dias: number, passadoOuFuturo: number | boolean) {
    const dataAtual = new Date();
    const diasAleatorios = Math.floor(Math.random() * dias);

    if (passadoOuFuturo === -1) {
        dataAtual.setDate(dataAtual.getDate() - diasAleatorios);
    } else if (passadoOuFuturo === 1) {
        dataAtual.setDate(dataAtual.getDate() + diasAleatorios);
    }

    return dataAtual;
}
