import Fetch from './Fetch'

let Provider = {
    filteredItems: {}
};

Provider.loadPrograms = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("program/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadPackages = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("package/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadCoaches = function(callback) {
    let parameters = {
        orderedBy: "firstName"
    };

    Fetch.get("coach/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.getStocks = (input, callback) => {
    let parameters = {
        filter: input,
        orderedBy: "name",
        pageSize: 10
    };

    Fetch.get("stock/", parameters, (items) => {
        Provider.filteredItems.stock = items;

        if (items) {
            let filteredStocks = items.map((item) => {
                return {value: item.id, label: item.name}
            });
            callback(null, { options: filteredStocks, cache: false });
        }
    });
};

module.exports = Provider;
