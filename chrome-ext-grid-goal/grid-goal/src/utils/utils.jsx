
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

export const getGridMultiplier = (num) => {
    // The value is entered as a string
    const gridMultiplier = num > 200 ? Math.ceil(num / 200) : 1;
    return gridMultiplier
}

export const getNumColumns = (cellCount, bw, bh) => {
    // let allowedColumnNums = [1, 2, 3, 4, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 100];

    let proportion = bh / bw;
    // let allowedColumnNums = [1, 2, 3, 4, 5, 10, 20, 25, 30];
    let allowedColumnNums = [...Array(30).keys()];

    let x = Math.floor(Math.sqrt(cellCount/ proportion));

    const closest = allowedColumnNums.reduce((prev, curr) =>
        Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev
    );

    // console.log(`closest, x`, closest, x, cellCount)

    return closest
}
export const getGridDims = (value) => {
    // The value is entered as a string

    let allowedColumnNums = [1, 2, 3, 4, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 100];

    let num = value;
    const gridMultiplier = num > 200 ? Math.ceil(num / 200) : 1;
    num = Math.ceil(num / gridMultiplier);


    let ratio = 1 / 1.3;

    let x = Math.sqrt(num / ratio);


    const closest = allowedColumnNums.reduce((prev, curr) =>
        Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev
    );

    let y = Math.ceil(num / closest);
    return [closest, y, num, gridMultiplier];
};



export function listAllResizeEventListeners() {
    const allElements = Array.prototype.slice.call(document.querySelectorAll('*'));
    allElements.push(document);
    allElements.push(window);
  
    const types = [];
  
    for (let ev in window) {
      if (/^on/.test(ev)) types[types.length] = ev;
    }
  
    let elements = [];
    for (let i = 0; i < allElements.length; i++) {
      const currentElement = allElements[i];
      for (let j = 0; j < types.length; j++) {
        if (typeof currentElement[types[j]] === 'function') {
          elements.push({
            "node": currentElement,
            "type": types[j],
            "func": currentElement[types[j]].toString(),
          });
        }
      }
    }
  
    return elements.sort(function(a,b) {
      return a.type.localeCompare(b.type);
    });
  }