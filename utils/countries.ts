const europeanCountries = [
	{ name: 'Germany', code: 'DEU' },
	{ name: 'United Kingdom', code: 'GBR' },
	{ name: 'France', code: 'FRA' },
	{ name: 'Spain', code: 'ESP' },
	{ name: 'Italy', code: 'ITA' },
	{ name: 'Netherlands', code: 'NLD' },
	{ name: 'Switzerland', code: 'CHE' },
	{ name: 'Belgium', code: 'BEL' },
	{ name: 'Austria', code: 'AUT' },
	{ name: 'Sweden', code: 'SWE' }
];
  
const globalCountries = [
	{ name: 'United States', code: 'USA' },
	{ name: 'Brazil', code: 'BRA' },
	{ name: 'India', code: 'IND' },
	{ name: 'China', code: 'CHN' },
	{ name: 'Japan', code: 'JPN' },
	{ name: 'Egypt', code: 'EGY' },
	{ name: 'South Africa', code: 'ZAF' },
	{ name: 'Australia', code: 'AUS' },
	{ name: 'Saudi Arabia', code: 'SAU' },
	{ name: 'Russia', code: 'RUS' }
];

export const countries = [...europeanCountries, ...globalCountries];
