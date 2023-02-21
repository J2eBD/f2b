# F2B

F2B is a Fail2ban mechanic for Node.js.

IP's, their attempts and timestamps are kept in memory for a quick response.


### Configuration

`bypass`
* Boolean
* Default: `false`
* Disables f2b function, recommended for development only


`maxTry`
* Integer
* Default: `3`
* Maximum attempts until IP is blocked


`banTime`
* Integer
* Default: `10`
* Time (in minutes) how long the IP is blocked


```js
const F2B = require("f2b");

const f2b = new F2B({
	"maxTry": 5,
	"banTime": 30
});
```


### Check

```js
let check =  await f2b.check("1.1.1.1");
console.log(check);

/*
Returns for example if the IP is not banned:
{
	"ok": true,		because ip is not banned
	"try": 2,		number of failed attempts
	"maxTry": 3		maximum attempts until ip is gifted
}


Returns when ip is banned:
{
	"ok": false,			ip is banned
	"banTime": 1676969874598,	time when the ip was banned
	"unbanTime": 1676969934598	time when the ip is unbanned
}
*/
```


### Add

```js
let add =  await f2b.add("1.1.1.1");
console.log(add);

/*
Returns for example if the IP is not banned:
{
	"ok": true,		because ip is not banned
	"try": 2,		number of failed attempts
	"maxTry": 3		maximum attempts until ip is gifted
}


Returns when ip is banned:
{
	"ok": false,			last attempt used up, ip is now banned
	"banTime": 1676969874598,	time when the ip was banned
	"unbanTime": 1676969934598	time when the ip is unbanned
}
*/
```


### Remove

```js
await f2b.remove("1.1.1.1"); // Returns nothing
```


### Example

An example for a better understanding of how it works:
```js
const F2B = require("f2b");

const f2b = new F2B({
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
```

Console output:
```
Fail2ban = ENABLED 
Max try  = 2
Ban time = 1 (min.)

Time: 10:36:05
Check: { ok: true, try: 0, maxTry: 2 }  | banTime: N/A | unbanTime: N/A
Add: { ok: true, try: 1, maxTry: 2 }  | banTime: N/A | unbanTime: N/A
-----------------------------
Time: 10:36:25
Check: { ok: true, try: 1, maxTry: 2 }  | banTime: N/A | unbanTime: N/A
Add: { ok: false, banTime: 1676972185252, unbanTime: 1676972245252 }  | banTime: 10:36:25 | unbanTime: 10:37:25
-----------------------------
Time: 10:36:45
Check: { ok: false, banTime: 1676972185252, unbanTime: 1676972245252 }  | banTime: 10:36:25 | unbanTime: 10:37:25
Add: { ok: false, banTime: 1676972185252, unbanTime: 1676972245252 }  | banTime: 10:36:25 | unbanTime: 10:37:25
-----------------------------
Time: 10:37:05
Check: { ok: false, banTime: 1676972185252, unbanTime: 1676972245252 }  | banTime: 10:36:25 | unbanTime: 10:37:25
Add: { ok: false, banTime: 1676972185252, unbanTime: 1676972245252 }  | banTime: 10:36:25 | unbanTime: 10:37:25
-----------------------------
Time: 10:37:25
Check: { ok: true, try: 0, maxTry: 2 }  | banTime: N/A | unbanTime: N/A
Add: { ok: true, try: 1, maxTry: 2 }  | banTime: N/A | unbanTime: N/A
```
