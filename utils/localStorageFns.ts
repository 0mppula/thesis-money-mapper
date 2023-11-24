export const getPreferredCurrency = () => {
	let currency;

	try {
		currency = localStorage.getItem('preferredCurrency');

		if (!currency) {
			currency = 'eur';
		}
	} catch (error) {
		currency = 'eur';
	}

	return currency;
};
