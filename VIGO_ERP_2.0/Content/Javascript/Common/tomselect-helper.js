(function () {

    function initStatic(el) {
        if (el.tomselect) return;

        new TomSelect(el, {
            create: true,
           
            sortField: {
                field: "text",
                direction: "asc"
            }
        });
    }

    function initAjax(el) {
        if (el.tomselect) return;

        const url = el.dataset.url;
        const multiple = el.dataset.multiple === "true";

        new TomSelect(el, {
            valueField: "id",
            labelField: "text",
            searchField: "text",
            plugins: multiple ? ['remove_button'] : [],
            load: function (query, callback) {
                if (!query.length) return callback();
                fetch(`${url}?term=${query}`)
                    .then(res => res.json())
                    .then(callback);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".ts-static").forEach(initStatic);
        document.querySelectorAll(".ts-ajax").forEach(initAjax);
    });

})();
