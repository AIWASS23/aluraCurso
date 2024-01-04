const calcularMedia = (array) => {
    let valor = 0;
    for(let numero of array) {
        valor += numero;
    }

    const media = valor / array.length;
    return media;
}

export default calcularMedia;