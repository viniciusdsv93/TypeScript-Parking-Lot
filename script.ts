interface Vehicle {
	name: string;
	licensePlate: string;
	entry: Date | string;
}

(function () {
	const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

	function calcTime(mil: number): String {
		const min = Math.floor(mil / 60000);
		const sec = Math.floor((mil % 60000) / 1000);

		return `${min}m and ${sec}sec`;
	}

	function park() {
		function read(): Vehicle[] {
			return localStorage.park ? JSON.parse(localStorage.park) : [];
		}

		function save(vehicles: Vehicle[]) {
			localStorage.setItem("park", JSON.stringify(vehicles));
		}

		function render() {
			if (localStorage.park !== []) {
				$("#park")!.innerHTML = "";
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
					$("#park")?.appendChild(row);
				}
			}
		}

		function add(vehicle: Vehicle) {
			const row = document.createElement("tr");
			row.innerHTML = `
                <td>${vehicle.name}</td>
                <td>${vehicle.licensePlate}</td>
                <td>${vehicle.entry}</td>
                <td>
                    <button class="delete" data-license="${vehicle.licensePlate}">X</button>
                </td>
            `;

			row.querySelector(".delete")?.addEventListener("click", function () {
				remove(this.dataset.licensePlate);
			});

			$("#park")?.appendChild(row);

			save([...read(), vehicle]);
		}

		function remove(licensePlate: string) {
			const { entry, name } = read().find((vehicle) => vehicle.licensePlate === licensePlate);
			console.log(entry, name);
			const time = calcTime(new Date().getTime() - new Date(entry).getTime());

			if (confirm(`The vehicle ${name} stayed for ${time}. Do you want to finish?`)) return;

			save(read().filter((vehicle) => vehicle.licensePlate !== licensePlate));
			render();
		}

		return { read, add, remove, render, save };
	}

	park().render();

	$("#register")?.addEventListener("click", () => {
		const name = $("#name")?.value;
		const licensePlate = $("#licensePlate")?.value;

		if (!name || !licensePlate) {
			alert("The fields 'name' and 'license plate' are mandatory.");
			return;
		}

		park().add({ name, licensePlate, entry: new Date().toISOString() });
	});
})();
