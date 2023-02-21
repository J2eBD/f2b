const F2B = require("f2b");

const f2b = new F2B({
	"bypass": false,
	"maxTry": 2,
	"banTime": 1
});


let ip = "1.2.3.4";


function ts_to_date(ts) {
	if (!ts) {
		return "N/A"
	}

	return new Date(ts).toLocaleTimeString();
}

function run() {
	setTimeout(async () => {
		console.log("Time:", new Date().toLocaleTimeString());

		let check = await f2b.check(ip);
		console.log("Check:", check, ` | banTime: ${ts_to_date(check.banTime)} | unbanTime: ${ts_to_date(check.unbanTime)}`);

		let add = await f2b.add(ip);
		console.log("Add:", add, ` | banTime: ${ts_to_date(add.banTime)} | unbanTime: ${ts_to_date(add.unbanTime)}`);

		console.log("-----------------------------");
		return run();
	}, 20000);
}
run();