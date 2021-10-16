
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function mapNumber(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export const randomGoals = (arr, n) => {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
};

export const getGridDims= (value) => {
    // The value is entered as a string

    let allowedColumnNums = [1, 2, 3, 4, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 100];
    let gridsizeToMultiplier={

    }
    let num = value.replace(/,/g, "");
    const gridMultiplier = num > 200 ? Math.ceil(num / 200) : 1;
    num = Math.ceil(num / gridMultiplier);


    let ratio = 1/1.3;
    
    let x = Math.sqrt(num / ratio);

    const closest = allowedColumnNums.reduce((prev, curr) =>
        Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev
    );

    let y = Math.ceil(num / closest);
    return [closest, y, num, gridMultiplier];
};


export const getGridDims_new = (value, boxW, boxH) => {
    let allowedColumnNums = [1, 2, 3, 4, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 100];
    const gridMultiplier = value > 1000 ? Math.ceil(value / 1000) : 1;
    


    let ratio = boxW/boxH;
    
    let x = Math.sqrt(value / ratio);
}