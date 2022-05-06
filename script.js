(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTime(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m and ${sec}sec`;
    }
    function park() {
        function read() {
            return localStorage.park ? JSON.parse(localStorage.park) : [];
        }
        function save(vehicles) {
            localStorage.setItem("park", JSON.stringify(vehicles));
        }
        function render() {
            var _a;
            if (localStorage.park !== []) {
                $("#park").innerHTML = "";
                const localStorageData = JSON.parse(localStorage.park);
                for (let i = 0; i < localStorageData.length; i++) {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${localStorageData[i].name}</td>
                        <td>${localStorageData[i].licensePlate}</td>
                        <td>${localStorageData[i].entry}</td>
                        <td>
                            <button class="delete" data-license="${localStorageData[i].licensePlate}">X</button>
                        </td>
                    `;
                    (_a = $("#park")) === null || _a === void 0 ? void 0 : _a.appendChild(row);
                }
            }
        }
        function add(vehicle) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vehicle.name}</td>
                <td>${vehicle.licensePlate}</td>
                <td>${vehicle.entry}</td>
                <td>
                    <button class="delete" data-license="${vehicle.licensePlate}">X</button>
                </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.licensePlate);
            });
            (_b = $("#park")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            save([...read(), vehicle]);
        }
        function remove(licensePlate) {
            const { entry, name } = read().find((vehicle) => vehicle.licensePlate === licensePlate);
            console.log(entry, name);
            const time = calcTime(new Date().getTime() - new Date(entry).getTime());
            if (confirm(`The vehicle ${name} stayed for ${time}. Do you want to finish?`))
                return;
            save(read().filter((vehicle) => vehicle.licensePlate !== licensePlate));
            render();
        }
        return { read, add, remove, render, save };
    }
    park().render();
    (_a = $("#register")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const name = (_a = $("#name")) === null || _a === void 0 ? void 0 : _a.value;
        const licensePlate = (_b = $("#licensePlate")) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !licensePlate) {
            alert("The fields 'name' and 'license plate' are mandatory.");
            return;
        }
        park().add({ name, licensePlate, entry: new Date().toISOString() });
    });
})();
