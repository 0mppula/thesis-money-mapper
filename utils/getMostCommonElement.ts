export default (arr: string[]): string => {
	const frequencyMap: { [key: string]: number } = {};
	let maxElement = arr[0];
	let maxCount = 1;

	arr.forEach((element, index) => {
		if (frequencyMap[element]) {
			frequencyMap[element]++;
		} else {
			frequencyMap[element] = 1;
		}

		if (frequencyMap[element] > maxCount) {
			maxElement = element;
			maxCount = frequencyMap[element];
		}
	});

	return maxElement;
};
