export function isSameDate(dateOne: string, dateTwo: string) {
	return new Date(dateOne).setHours(0, 0, 0, 0) === new Date(dateTwo).setHours(0, 0, 0, 0);
}
export function isSameMonth(dateOne: string, dateTwo: string) {
	return new Date(dateOne).getMonth() === new Date(dateTwo).getMonth();
}
