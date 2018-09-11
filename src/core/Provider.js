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

Provider.loadMembers = function(callback) {
    let parameters = {
        orderedBy: "firstName"
    };

    Fetch.get("member/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.getCoaches = (input, callback) => {
    let parameters = {
        filter: input,
        orderedBy: "firstName",
        pageSize: 10
    };

    Fetch.get("coach/", parameters, (items) => {
        Provider.filteredItems.coaches = items;

        if (items) {
            let filteredCoaches = items.map((item) => {
                const { firstName, middleName, lastName } = item;
                return {
                    value: item.id,
                    label:  `${firstName} ${middleName ? middleName + " " : ""}${lastName}`
                };
            });
            callback(null, { options: filteredCoaches, cache: false });
        }
    });
};

module.exports = Provider;
