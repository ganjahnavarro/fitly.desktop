let Formatter = {};

Formatter.format = (type, value) => {
    let mapping = [
        { "type": "date", "func": Formatter.formatDate },
        { "type": "number", "func": Formatter.formatNumber },
        { "type": "amount", "func": Formatter.formatAmount }
    ];

    let func = mapping.find((item) => item.type == type).func;
    return func(value);
}

Formatter.formatDate = (value) => {
    return value;
};

Formatter.formatNumber = (value) => {
    if (value === null || isNaN(value)) return value;
    let amount = parseFloat(value);
    return amount.toFixed();
};

Formatter.formatAmount = (value) => {
    if (value === null || isNaN(value)) return value;
    let amount = parseFloat(value);
    return formatMoney(amount);
};

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};


module.exports = Formatter;
