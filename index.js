const color = {
	"reset": "\x1b[0m",
	"red": "\x1b[31m",
	"blue": "\x1b[34m",
	"green": "\x1b[32m"
};

let list = {};


function min_to_milis(val) {
	return val * 60 * 1000;
}

module.exports = class F2B {
	constructor(config) {
		if ((typeof config.bypass !== "boolean" && typeof config.bypass !== "undefined") ||
			(typeof config.maxTry !== "number" && typeof config.maxTry !== "undefined") ||
			(typeof config.banTime !== "number" && typeof config.banTime !== "undefined")) {
			console.error(`${color.red}Fail2ban Error: specified parameters are not correct${color.reset}`);
			console.info(`Look at the options under: ${color.blue}https://github.com/J2eBD/f2b#readme${color.reset}`);
			process.exit(1);
		}

		this.bypass = config.bypass || false;
		this.maxTry = config.maxTry || 3;
		this.banTime = min_to_milis(config.banTime || 10);

		console.log();
		console.log("Fail2ban =", this.bypass ? `${color.red}DISABLED (not for productive systems)` : `${color.green}ENABLED`, color.reset);
		console.log(`Max try  = ${this.maxTry}`);
		console.log(`Ban time = ${this.banTime / 60 / 1000} (min.)`);
		console.log();
	}

	check(ip) {
		return new Promise((resolve) => {
			if (this.bypass) {
				return resolve({
					"ok": true,
					"try": 0,
					"maxTry": this.maxTry
				});
			}

			if (ip in list) {
				if (list[ip].try < this.maxTry) {
					return resolve({
						"ok": true,
						"try": list[ip].try,
						"maxTry": this.maxTry
					});
				}

				if (list[ip].ts < Date.now()) {
					this.remove(ip)
						.then(resolve({
							"ok": true,
							"try": 0,
							"maxTry": this.maxTry
						}));
					return;
				}

				return resolve({
					"ok": false,
					"banTime": list[ip].ts - this.banTime,
					"unbanTime": list[ip].ts
				});
			}

			resolve({
				"ok": true,
				"try": 0,
				"maxTry": this.maxTry
			});

		});
	}

	add(ip) {
		return new Promise((resolve) => {
			if (ip in list) {
				if (list[ip].try >= this.maxTry) {
					return resolve({
						"ok": false,
						"banTime": list[ip].ts - this.banTime,
						"unbanTime": list[ip].ts
					});
				}

				list[ip] = {
					"try": list[ip].try + 1,
					"ts": Date.now() + this.banTime
				};

				if (list[ip].try >= this.maxTry) {
					return resolve({
						"ok": false,
						"banTime": list[ip].ts - this.banTime,
						"unbanTime": list[ip].ts
					});
				}

				return resolve({
					"ok": true,
					"try": list[ip].try,
					"maxTry": this.maxTry
				});
			}

			list[ip] = {
				"try": 1,
				"ts": Date.now() + this.banTime
			};

			resolve({
				"ok": true,
				"try": list[ip].try,
				"maxTry": this.maxTry
			});
		});
	}


	remove(ip) {
		return new Promise((resolve) => {
			delete list[ip];
			resolve();
		});
	}
};


