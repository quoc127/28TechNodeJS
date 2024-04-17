let users = [
	{
		name: "nguyenquoc",
		email: "quoc@gmail.com"
	},
	{
		name: "nguyenquoc1",
		email: "quoc1@gmail.com"
	},
	{
		name: "nguyenquoc2",
		email: "quoc2@gmail.com"
	},
];

const isCheckExistName = checkOneElementExist(
	users,
	(element) => {
		return element.name === "nguyenquoc2";
	}
);

const isCheckExistEmail = checkOneElementExist(
	users,
	(element) => {
		return element.email === "quoc2@gmail.com";
	}
);
console.log("isCheckExistName", isCheckExistName);
console.log(isCheckExistEmail);