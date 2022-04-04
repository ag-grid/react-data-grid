let sequence = 0;
let carTypes = ['Mazda MX5','BMW M3','Porsche 911',
                'Mercedes S-Class','Aston Martin DBX',
                'Bentley Bentayga'];
let colors = ['Red','Blue','Green','White','Black'];

export function createOneCarRecord() {
    const res = {
        id: sequence,
        type: carTypes[sequence%carTypes.length],
        year: 2010 + (sequence * 7) % 10,
        color: colors[sequence%colors.length],
        price: 20000 + (sequence * 3 * 17 * 19 * 5 * 7) % 40000
    }
    sequence++;
    return res;
}