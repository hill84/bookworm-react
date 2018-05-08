import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { blueGrey900, cyan700, cyan900, purpleA200, purpleA400 } from 'material-ui/styles/colors';
//import { emphasize } from 'material-ui/utils/colorManipulator';

export const appName = 'Biblo';

// THEME
// https://github.com/mui-org/material-ui/blob/master/src/styles/getMuiTheme.js
export const muiTheme = getMuiTheme({
    palette: {
        primary1Color: cyan700,
        primary2Color: cyan900,
        accent1Color: purpleA200,
        accent2Color: purpleA400,
        pickerHeaderColor: cyan700
    },
    appBar: { height: 60 },
    drawer: { color: blueGrey900 },
    datePicker: { selectColor: cyan700 },
    menuItem: { hoverColor: 'rgba(0, 151, 167, 0.1)' }
});

export const muiThemeDark = getMuiTheme({
    palette: {
        textColor: '#fff',
        secondaryTextColor: 'rgba(255,255,255,.7)',
        alternateTextColor: '#303030',
        canvasColor: '#303030',
        borderColor: 'rgba(255,255,255,.3)',
        disabledColor: 'rgba(255,255,255,.3)',
        pickerHeaderColor: 'rgba(255,255,255,.12)',
        clockCircleColor: 'rgba(255,255,255,.12)',
    }
});

export const muiThemePrimary = getMuiTheme({
    palette: {
        primary1Color: 'rgba(255,255,255,.7)',
        primary2Color: '#fff',
        textColor: '#fff',
        secondaryTextColor: 'rgba(255,255,255,.7)',
        alternateTextColor: '#303030',
        canvasColor: '#303030',
        borderColor: 'rgba(255,255,255,.3)',
        disabledColor: 'rgba(255,255,255,.3)',
        pickerHeaderColor: 'rgba(255,255,255,.12)',
        clockCircleColor: 'rgba(255,255,255,.12)',
    }
});

// JUNCTION
export const join = arr => arr && (arr.length > 1) ? [arr.slice(0, -1).join(', '), arr.slice(-1)[0]].join(arr.length < 2 ? '' : ' e ') : arr;
export const joinToLowerCase = arr => arr[0] && join(arr.map(w => w.toLowerCase()));
export const joinComma = arr => (arr.length > 1) ? arr.join(', ') : arr;

// UTILITY
export const copyToClipboard = text => navigator.clipboard.writeText(text).then(() => {
  //console.log('Async: Copying to clipboard was successful!');
}, error => console.warn('Async: Could not copy text: ', error));

// VALIDATION
export const validateImg = (file, maxSize) => {
    const errors = {};
    const fileExtension = file.name.split('.').pop();
    const ext = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'svg', 'SVG', 'gif', 'GIF', 'webp', 'WEBP'];
    if (ext.indexOf(fileExtension) === -1) {
        console.warn(`Image file extension not supperted: ${fileExtension}`);
        errors.upload = 'Tipo file non valido';
    } else if (file.size > maxSize) {
        console.warn('File size too big');
        errors.upload = 'Dimensione file eccessiva';
    }
    return errors;
}

export const checkBadWords = text => {
    let result = false;
    text && text.split(' ').map(word => badWords.map(badWord => result = (word.toLowerCase() === badWord) ? true : false ));
    return result;
}

// NORMALIZATION
export const normalizeString = str => str.toString().toLowerCase()
    .replace(/\s+/g,'-')        // Replace spaces with -
    .replace(/--+/g,'-')        // Replace multiple - with single -
    .replace(/[àáâãäå]/g,"a")
    .replace(/[èéêë]/g,"e")
    .replace(/[ìíîï]/g,"i")
    .replace(/[òóôõö]/g,"o")
    .replace(/[ùúûü]/g,"u")
    .replace(/[ýÿ]/g,"y")
    .replace(/æ/g,"ae")
    .replace(/œ/g,"oe")
    .replace(/ç/g,"c")
    .replace(/ñ/g,"n")
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
export const normalizeCover = str => str && str.replace('&edge=curl', '');

// CALCULATION
const calcMinutesToTime = minutes => `${(Math.floor(minutes/60)>0) ? `${Math.floor(minutes/60)} ore` : ''} ${(Math.floor(minutes%60)>0) && `${Math.floor(minutes%60)} minuti`}`;

export const calcReadingTime = pages => calcMinutesToTime(pages * .85);

export const calcAge = birthDate => Math.abs(new Date(Date.now() - new Date(birthDate).getTime()).getUTCFullYear() - 1970);

export const timeSince = date => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) { return `${interval} anni fa`; }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) { return `${interval} mesi fa`; }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) { return `${interval} giorni fa`; }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) { return `${interval} ore fa`; }
    interval = Math.floor(seconds / 60);
    if (interval > 1) { return `${interval} minuti fa`; }
    return 'pochi secondi fa'; //`${Math.floor(seconds)} secondi fa`;
};

// MAP
export const switchGenres = array => array.map(string => {
    let g;
    switch (string) {
        case "Architecture":                g = "Architettura"; break;
        case "Art":                         
        case "Performing Arts":             g = "Arte"; break;
        case "Bibles":
        case "Religion":                    g = "Religione e spiritualità"; break;
        case "Biography & Autobiography":   g = "Biografie e autobiografie"; break;
        case "Business & Economics":        g = "Economia e finanza"; break;
        case "Comics & Graphic Novels":     g = "Fumetti e Graphic novel"; break;
        case "Cooking":                     g = "Cucina"; break;
        case "Family & Relationships":      g = "Famigliae relazioni"; break;
        case "Fiction":                     g = "Narrativa"; break;
        case "History":                     g = "Storico"; break;
        case "Humor":                       g = "Umoristico"; break;
        case "Juvenile Fiction":            g = "Per ragazzi"; break;
        case "Literary Criticism":          g = "Saggistica"; break;
        case "Medical":                     g = "Medicina e salute"; break;
        case "Mistery":                     g = "Mistero"; break;
        case "Music":                       g = "Musica"; break;
        case "Philosophy":                  g = "Filosofia"; break;
        case "Poetry":                      g = "Poesia"; break;
        case "Science":                     g = "Scienza"; break; 
        case "Science fiction":             g = "Fantascienza"; break; 
        case "Social Science":              g = "Scienze sociali"; break;
        case "Travel":                      g = "Viaggi"; break;
        default:                            g = ""; break;
    }
    return g;
});

export const switchLanguages = string => {
    let l;
    switch (string) {
        case "ar": l = "Arabo"; break;
        case "zh": l = "Cinese"; break;
        case "ko": l = "Coreano"; break;
        case "fr": l = "Francese"; break;
        case "ja": l = "Giapponese"; break;
        case "el": l = "Greco"; break;
        case "en": l = "Inglese"; break;
        case "it": l = "Italiano"; break;
        case "pt": l = "Portoghese"; break;
        case "ru": l = "Russo"; break;
        case "es": l = "Spagnolo"; break;
        case "de": l = "Tedesco"; break; 
        default: l = ""; break;
    }
    return l;
};

// LIST
export const ratingLabels = { 0: "Nessun voto", 1: "Pessimo", 2: "Scarso", 3: "Sufficiente", 4: "Buono", 5: "Ottimo" };

export const formats = [
    { id: "0", name: "Libro" },
    { id: "1", name: "Rivista" }
];

export const genres = [
    { id: "ac", name: "Architettura" },
    { id: "ar", name: "Arte" },
    { id: "av", name: "Avventura" },
    { id: "bi", name: "Biografie e autobiografie" },
    { id: "cu", name: "Cucina" },
    { id: "ef", name: "Economia e finanza" }, 
    { id: "er", name: "Erotico" },
    { id: "fa", name: "Famiglia e relazioni" },
    { id: "sf", name: "Fantascienza" },
    { id: "fy", name: "Fantasy" },
    { id: "fi", name: "Filosofia" },
    { id: "fu", name: "Fumetti e Graphic novel" },
    { id: "gl", name: "Giallo" },
    { id: "ho", name: "Horror" },
    { id: "ju", name: "Per ragazzi" },
    { id: "ms", name: "Medicina e salute" },
    { id: "mi", name: "Mistero" },
    { id: "mu", name: "Musica" },
    { id: "na", name: "Narrativa" },
    { id: "po", name: "Poesia" },
    { id: "ps", name: "Psicologico" },
    { id: "re", name: "Religione e spiritualità" },
    { id: "ro", name: "Rosa" },
    { id: "sa", name: "Saggistica" },
    { id: "sc", name: "Scienza" },
    { id: "ss", name: "Scienze sociali" },
    { id: "st", name: "Storico" },
    { id: "th", name: "Thriller" },
    { id: "um", name: "Umoristico" },
    { id: "vi", name: "Viaggi" }
];

export const languages = [
    { id: "ar", name: "Arabo", nativeName: "العربية" },
    { id: "zh", name: "Cinese", nativeName: "中文 (Zhōngwén)" },
    { id: "ko", name: "Coreano", nativeName: "한국어 (韓國語)" },
    { id: "fr", name: "Francese", nativeName: "Français" },
    { id: "ja", name: "Giapponese", nativeName: "日本語 (にほんご)" },
    { id: "el", name: "Greco", nativeName: "ελληνικά" },
    { id: "en", name: "Inglese", nativeName: "English" },
    { id: "it", name: "Italiano", nativeName: "Italiano" },
    { id: "pt", name: "Portoghese", nativeName: "Português" },
    { id: "ru", name: "Russo", nativeName: "русский язык" },
    { id: "es", name: "Spagnolo", nativeName: "Español" },
    { id: "de", name: "Tedesco", nativeName: "Deutsch" } 
];

export const continents = [
    { id: "AF", name: "Africa" },
    //{ id: "AN", name: "Antartide" },
    { id: "AS", name: "Asia" },
    { id: "EU", name: "Europa" },
    { id: "NA", name: "Nordamerica" },
    { id: "OC", name: "Oceania" },
    { id: "SA", name: "Sudamerica" }
];

export const europeanCountries = [
    //{ id: "", name: "Abcasia‎" },
    { id: "AL", name: "Albania‎" },
    { id: "AD", name: "Andorra‎" },
    { id: "AM", name: "Armenia‎" },
    { id: "AT", name: "Austria‎" },
    { id: "BE", name: "Belgio‎" },
    { id: "BY", name: "Bielorussia‎" },
    { id: "BA", name: "Bosnia ed Erzegovina" },
    { id: "BG", name: "Bulgaria‎" },
    { id: "CZ", name: "Repubblica Ceca" },
    { id: "VA", name: "Città del Vaticano" },
    { id: "HR", name: "Croazia‎" },
    { id: "DK", name: "Danimarca‎" },
    { id: "EE", name: "Estonia‎" },
    { id: "FI", name: "Finlandia‎" },
    { id: "FR", name: "Francia‎" },
    { id: "DE", name: "Germania‎" },
    { id: "GR", name: "Grecia‎" },
    { id: "IE", name: "Repubblica d'Irlanda" },
    { id: "IS", name: "Islanda‎" },
    { id: "IT", name: "Italia‎" },
    { id: "KZ", name: "Kazakistan‎" },
    //{ id: "", name: "Kosovo‎" },
    { id: "LV", name: "Lettonia‎" },
    { id: "LI", name: "Liechtenstein‎" },
    { id: "LT", name: "Lituania‎" },
    { id: "LU", name: "Lussemburgo‎" },
    { id: "MK", name: "Repubblica di Macedonia" },
    { id: "MT", name: "Malta‎" },
    { id: "MD", name: "Moldavia‎" },
    { id: "MC", name: "Principato di Monaco" },
    { id: "ME", name: "Montenegro‎" },
    //{ id: "", name: "Nagorno Karabakh" },
    { id: "NO", name: "Norvegia‎" },
    //{ id: "", name: "Ossezia del Sud" },
    { id: "NL", name: "Paesi Bassi" },
    { id: "PL", name: "Polonia‎" },
    { id: "PT", name: "Portogallo‎" },
    { id: "UK", name: "Regno Unito" },
    //{ id: "", name: "Repubblica Popolare di Doneck" },
    //{ id: "", name: "Repubblica Popolare di Lugansk‎" },
    { id: "RO", name: "Romania‎" },
    { id: "RU", name: "Russia‎" },
    { id: "SM", name: "San Marino" },
    { id: "RS", name: "Serbia‎" },
    { id: "SK", name: "Slovacchia‎" },
    { id: "SI", name: "Slovenia‎" },
    { id: "ES", name: "Spagna‎" },
    { id: "SE", name: "Svezia‎" },
    { id: "CH", name: "Svizzera‎" },
    //{ id: "", name: "Transnistria‎" },
    { id: "TR", name: "Turchia‎" },
    { id: "UA", name: "Ucraina‎" },
    { id: "HU", name: "Ungheria‎" }
];

export const northAmericanCountries = [
    { id: "AG", name: "Antigua e Barbuda" },
    { id: "BS", name: "Bahamas‎" },
    { id: "BB", name: "Barbados‎" },
    { id: "BZ", name: "Belize‎" },
    { id: "CA", name: "Canada‎" },
    { id: "CR", name: "Costa Rica" },
    { id: "CU", name: "Cuba‎" },
    { id: "DM", name: "Dominica‎" },
    { id: "SV", name: "El Salvador" },
    { id: "JM", name: "Giamaica‎" },
    { id: "GD", name: "Grenada‎" },
    { id: "GT", name: "Guatemala‎" },
    { id: "HT", name: "Haiti‎" },
    { id: "HN", name: "Honduras‎" },
    { id: "MX", name: "Messico‎" },
    { id: "NI", name: "Nicaragua‎" },
    { id: "PA", name: "Panama‎" },
    { id: "DO", name: "Repubblica Dominicana" },
    { id: "KN", name: "Saint Kitts e Nevis" },
    { id: "VC", name: "Saint Vincent e Grenadine" },
    { id: "LC", name: "Santa Lucia" },
    { id: "US", name: "Stati Uniti d'America" },
    { id: "TT", name: "Trinidad e Tobago" }
];

export const countries = [
    { id: "AF", name: "Afghanistan" },
    { id: "AX", name: "Åland Islands" },
    { id: "AL", name: "Albania" },
    { id: "DZ", name: "Algeria" },
    { id: "AS", name: "American Samoa" },
    { id: "AD", name: "Andorra" },
    { id: "AO", name: "Angola" },
    { id: "AI", name: "Anguilla" },
    { id: "AQ", name: "Antarctica" },
    { id: "AG", name: "Antigua and Barbuda" },
    { id: "AR", name: "Argentina" },
    { id: "AM", name: "Armenia" },
    { id: "AW", name: "Aruba" },
    { id: "AU", name: "Australia" },
    { id: "AT", name: "Austria" },
    { id: "AZ", name: "Azerbaijan" },
    { id: "BS", name: "Bahamas" },
    { id: "BH", name: "Bahrain" },
    { id: "BD", name: "Bangladesh" },
    { id: "BB", name: "Barbados" },
    { id: "BY", name: "Belarus" },
    { id: "BE", name: "Belgium" },
    { id: "BZ", name: "Belize" },
    { id: "BJ", name: "Benin" },
    { id: "BM", name: "Bermuda" },
    { id: "BT", name: "Bhutan" },
    { id: "BO", name: "Bolivia" },
    { id: "BQ", name: "Bonaire, Sint Eustatius and Saba" },
    { id: "BA", name: "Bosnia and Herzegovina" },
    { id: "BW", name: "Botswana" },
    { id: "BV", name: "Bouvet Island" },
    { id: "BR", name: "Brazil" },
    { id: "IO", name: "British Indian Ocean Territory" },
    { id: "BN", name: "Brunei Darussalam" },
    { id: "BG", name: "Bulgaria" },
    { id: "BF", name: "Burkina Faso" },
    { id: "BI", name: "Burundi" },
    { id: "KH", name: "Cambodia" },
    { id: "CM", name: "Cameroon" },
    { id: "CA", name: "Canada" },
    { id: "CV", name: "Cape Verde" },
    { id: "KY", name: "Cayman Islands" },
    { id: "CF", name: "Central African Republic" },
    { id: "TD", name: "Chad" },
    { id: "CL", name: "Chile" },
    { id: "CN", name: "China" },
    { id: "CX", name: "Christmas Island" },
    { id: "CC", name: "Cocos (Keeling) Islands" },
    { id: "CO", name: "Colombia" },
    { id: "KM", name: "Comoros" },
    { id: "CG", name: "Congo" },
    { id: "CD", name: "Congo, the Democratic Republic of the" },
    { id: "CK", name: "Cook Islands" },
    { id: "CR", name: "Costa Rica" },
    { id: "CI", name: "Côte d'Ivoire" },
    { id: "HR", name: "Croatia" },
    { id: "CU", name: "Cuba" },
    { id: "CW", name: "Curaçao" },
    { id: "CY", name: "Cyprus" },
    { id: "CZ", name: "Czech Republic" },
    { id: "DK", name: "Denmark" },
    { id: "DJ", name: "Djibouti" },
    { id: "DM", name: "Dominica" },
    { id: "DO", name: "Dominican Republic" },
    { id: "EC", name: "Ecuador" },
    { id: "EG", name: "Egypt" },
    { id: "SV", name: "El Salvador" },
    { id: "GQ", name: "Equatorial Guinea" },
    { id: "ER", name: "Eritrea" },
    { id: "EE", name: "Estonia" },
    { id: "ET", name: "Ethiopia" },
    { id: "FK", name: "Falkland Islands (Malvinas)" },
    { id: "FO", name: "Faroe Islands" },
    { id: "FJ", name: "Fiji" },
    { id: "FI", name: "Finland" },
    { id: "FR", name: "France" },
    { id: "GF", name: "French Guiana" },
    { id: "PF", name: "French Polynesia" },
    { id: "TF", name: "French Southern Territories" },
    { id: "GA", name: "Gabon" },
    { id: "GM", name: "Gambia" },
    { id: "GE", name: "Georgia" },
    { id: "DE", name: "Germany" },
    { id: "GH", name: "Ghana" },
    { id: "GI", name: "Gibraltar" },
    { id: "GR", name: "Greece" },
    { id: "GL", name: "Greenland" },
    { id: "GD", name: "Grenada" },
    { id: "GP", name: "Guadeloupe" },
    { id: "GU", name: "Guam" },
    { id: "GT", name: "Guatemala" },
    { id: "GG", name: "Guernsey" },
    { id: "GN", name: "Guinea" },
    { id: "GW", name: "Guinea-Bissau" },
    { id: "GY", name: "Guyana" },
    { id: "HT", name: "Haiti" },
    { id: "HM", name: "Heard Island and McDonald Islands" },
    { id: "VA", name: "Holy See" },
    { id: "HN", name: "Honduras" },
    { id: "HK", name: "Hong Kong" },
    { id: "HU", name: "Hungary" },
    { id: "IS", name: "Iceland" },
    { id: "IN", name: "India" },
    { id: "ID", name: "Indonesia" },
    { id: "IR", name: "Iran" },
    { id: "IQ", name: "Iraq" },
    { id: "IE", name: "Ireland" },
    { id: "IM", name: "Isle of Man" },
    { id: "IL", name: "Israel" },
    { id: "IT", name: "Italy" },
    { id: "JM", name: "Jamaica" },
    { id: "JP", name: "Japan" },
    { id: "JE", name: "Jersey" },
    { id: "JO", name: "Jordan" },
    { id: "KZ", name: "Kazakhstan" },
    { id: "KE", name: "Kenya" },
    { id: "KI", name: "Kiribati" },
    { id: "KP", name: "Korea (North)" },
    { id: "KR", name: "Korea (South)" },
    { id: "KW", name: "Kuwait" },
    { id: "KG", name: "Kyrgyzstan" },
    { id: "LA", name: "Lao" },
    { id: "LV", name: "Latvia" },
    { id: "LB", name: "Lebanon" },
    { id: "LS", name: "Lesotho" },
    { id: "LR", name: "Liberia" },
    { id: "LY", name: "Libya" },
    { id: "LI", name: "Liechtenstein" },
    { id: "LT", name: "Lithuania" },
    { id: "LU", name: "Luxembourg" },
    { id: "MO", name: "Macao" },
    { id: "MK", name: "Macedonia" },
    { id: "MG", name: "Madagascar" },
    { id: "MW", name: "Malawi" },
    { id: "MY", name: "Malaysia" },
    { id: "MV", name: "Maldives" },
    { id: "ML", name: "Mali" },
    { id: "MT", name: "Malta" },
    { id: "MH", name: "Marshall Islands" },
    { id: "MQ", name: "Martinique" },
    { id: "MR", name: "Mauritania" },
    { id: "MU", name: "Mauritius" },
    { id: "YT", name: "Mayotte" },
    { id: "MX", name: "Mexico" },
    { id: "FM", name: "Micronesia" },
    { id: "MD", name: "Moldova" },
    { id: "MC", name: "Monaco" },
    { id: "MN", name: "Mongolia" },
    { id: "ME", name: "Montenegro" },
    { id: "MS", name: "Montserrat" },
    { id: "MA", name: "Morocco" },
    { id: "MZ", name: "Mozambique" },
    { id: "MM", name: "Myanmar" },
    { id: "NA", name: "Namibia" },
    { id: "NR", name: "Nauru" },
    { id: "NP", name: "Nepal" },
    { id: "NL", name: "Netherlands" },
    { id: "NC", name: "New Caledonia" },
    { id: "NZ", name: "New Zealand" },
    { id: "NI", name: "Nicaragua" },
    { id: "NE", name: "Niger" },
    { id: "NG", name: "Nigeria" },
    { id: "NU", name: "Niue" },
    { id: "NF", name: "Norfolk Island" },
    { id: "MP", name: "Northern Mariana Islands" },
    { id: "NO", name: "Norway" },
    { id: "OM", name: "Oman" },
    { id: "PK", name: "Pakistan" },
    { id: "PW", name: "Palau" },
    { id: "PS", name: "Palestinian Territory" },
    { id: "PA", name: "Panama" },
    { id: "PG", name: "Papua New Guinea" },
    { id: "PY", name: "Paraguay" },
    { id: "PE", name: "Peru" },
    { id: "PH", name: "Philippines" },
    { id: "PN", name: "Pitcairn" },
    { id: "PL", name: "Poland" },
    { id: "PT", name: "Portugal" },
    { id: "PR", name: "Puerto Rico" },
    { id: "QA", name: "Qatar" },
    { id: "RE", name: "Réunion" },
    { id: "RO", name: "Romania" },
    { id: "RU", name: "Russian Federation" },
    { id: "RW", name: "Rwanda" },
    { id: "BL", name: "Saint Barthélemy" },
    { id: "SH", name: "Saint Helena, Ascension and Tristan da Cunha" },
    { id: "KN", name: "Saint Kitts and Nevis" },
    { id: "LC", name: "Saint Lucia" },
    { id: "MF", name: "Saint Martin (French part)" },
    { id: "PM", name: "Saint Pierre and Miquelon" },
    { id: "VC", name: "Saint Vincent and the Grenadines" },
    { id: "WS", name: "Samoa" },
    { id: "SM", name: "San Marino" },
    { id: "ST", name: "Sao Tome and Principe" },
    { id: "SA", name: "Saudi Arabia" },
    { id: "SN", name: "Senegal" },
    { id: "RS", name: "Serbia" },
    { id: "SC", name: "Seychelles" },
    { id: "SL", name: "Sierra Leone" },
    { id: "SG", name: "Singapore" },
    { id: "SX", name: "Sint Maarten (Dutch part)" },
    { id: "SK", name: "Slovakia" },
    { id: "SI", name: "Slovenia" },
    { id: "SB", name: "Solomon Islands" },
    { id: "SO", name: "Somalia" },
    { id: "ZA", name: "South Africa" },
    { id: "GS", name: "South Georgia and the South Sandwich Islands" },
    { id: "SS", name: "South Sudan" },
    { id: "ES", name: "Spain" },
    { id: "LK", name: "Sri Lanka" },
    { id: "SD", name: "Sudan" },
    { id: "SR", name: "Suriname" },
    { id: "SJ", name: "Svalbard and Jan Mayen" },
    { id: "SZ", name: "Swaziland" },
    { id: "SE", name: "Sweden" },
    { id: "CH", name: "Switzerland" },
    { id: "SY", name: "Syria" },
    { id: "TW", name: "Taiwan" },
    { id: "TJ", name: "Tajikistan" },
    { id: "TZ", name: "Tanzania" },
    { id: "TH", name: "Thailand" },
    { id: "TL", name: "Timor-Leste" },
    { id: "TG", name: "Togo" },
    { id: "TK", name: "Tokelau" },
    { id: "TO", name: "Tonga" },
    { id: "TT", name: "Trinidad and Tobago" },
    { id: "TN", name: "Tunisia" },
    { id: "TR", name: "Turkey" },
    { id: "TM", name: "Turkmenistan" },
    { id: "TC", name: "Turks and Caicos Islands" },
    { id: "TV", name: "Tuvalu" },
    { id: "UG", name: "Uganda" },
    { id: "UA", name: "Ukraine" },
    { id: "AE", name: "United Arab Emirates" },
    { id: "GB", name: "United Kingdom" },
    { id: "US", name: "United States" },
    { id: "UM", name: "United States Minor Outlying Islands" },
    { id: "UY", name: "Uruguay" },
    { id: "UZ", name: "Uzbekistan" },
    { id: "VU", name: "Vanuatu" },
    { id: "VE", name: "Venezuela" },
    { id: "VN", name: "Viet Nam" },
    { id: "VG", name: "Virgin Islands, British" },
    { id: "VI", name: "Virgin Islands, U.S." },
    { id: "WF", name: "Wallis and Futuna" },
    { id: "EH", name: "Western Sahara" },
    { id: "YE", name: "Yemen" },
    { id: "ZM", name: "Zambia" },
    { id: "ZW", name: "Zimbabwe" }
];

export const italianProvinces = [
    { id: "AG", name: "Agrigento" },
    { id: "AL", name: "Alessandria" },
    { id: "AN", name: "Ancona" },
    { id: "AO", name: "Aosta" },
    { id: "AR", name: "Arezzo" },
    { id: "AP", name: "Ascoli Piceno" },
    { id: "AT", name: "Asti" },
    { id: "AV", name: "Avellino" },
    { id: "BA", name: "Bari" },
    { id: "BT", name: "Barletta-Andria-Trani" },
    { id: "BL", name: "Belluno" },
    { id: "BN", name: "Benevento" },
    { id: "BG", name: "Bergamo" },
    { id: "BI", name: "Biella" },
    { id: "BO", name: "Bologna" },
    { id: "BZ", name: "Bolzano" },
    { id: "BS", name: "Brescia" },
    { id: "BR", name: "Brindisi" },
    { id: "CA", name: "Cagliari" },
    { id: "CL", name: "Caltanissetta" },
    { id: "CB", name: "Campobasso" },
    { id: "CI", name: "Carbonia-Iglesias" },
    { id: "CE", name: "Caserta" },
    { id: "CT", name: "Catania" },
    { id: "CZ", name: "Catanzaro" },
    { id: "CH", name: "Chieti" },
    { id: "CO", name: "Como" },
    { id: "CS", name: "Cosenza" },
    { id: "CR", name: "Cremona" },
    { id: "KR", name: "Crotone" },
    { id: "CN", name: "Cuneo" },
    { id: "EN", name: "Enna" },
    { id: "FM", name: "Fermo" },
    { id: "FE", name: "Ferrara" },
    { id: "FI", name: "Firenze" },
    { id: "FG", name: "Foggia" },
    { id: "FC", name: "Forlì-Cesena" },
    { id: "FR", name: "Frosinone" },
    { id: "GE", name: "Genova" },
    { id: "GO", name: "Gorizia" },
    { id: "GR", name: "Grosseto" },
    { id: "IM", name: "Imperia" },
    { id: "IS", name: "Isernia" },
    { id: "SP", name: "La Spezia" },
    { id: "AQ", name: "L'Aquila" },
    { id: "LT", name: "Latina" },
    { id: "LE", name: "Lecce" },
    { id: "LC", name: "Lecco" },
    { id: "LI", name: "Livorno" },
    { id: "LO", name: "Lodi" },
    { id: "LU", name: "Lucca" },
    { id: "MC", name: "Macerata" },
    { id: "MN", name: "Mantova" },
    { id: "MS", name: "Massa-Carrara" },
    { id: "MT", name: "Matera" },
    { id: "ME", name: "Messina" },
    { id: "MI", name: "Milano" },
    { id: "MO", name: "Modena" },
    { id: "MB", name: "Monza e della Brianza" },
    { id: "NA", name: "Napoli" },
    { id: "NO", name: "Novara" },
    { id: "NU", name: "Nuoro" },
    { id: "OT", name: "Olbia-Tempio" },
    { id: "OR", name: "Oristano" },
    { id: "PD", name: "Padova" },
    { id: "PA", name: "Palermo" },
    { id: "PR", name: "Parma" },
    { id: "PV", name: "Pavia" },
    { id: "PG", name: "Perugia" },
    { id: "PU", name: "Pesaro e Urbino" },
    { id: "PE", name: "Pescara" },
    { id: "PC", name: "Piacenza" },
    { id: "PI", name: "Pisa" },
    { id: "PT", name: "Pistoia" },
    { id: "PN", name: "Pordenone" },
    { id: "PZ", name: "Potenza" },
    { id: "PO", name: "Prato" },
    { id: "RG", name: "Ragusa" },
    { id: "RA", name: "Ravenna" },
    { id: "RC", name: "Reggio Calabria" },
    { id: "RE", name: "Reggio Emilia" },
    { id: "RI", name: "Rieti" },
    { id: "RN", name: "Rimini" },
    { id: "RM", name: "Roma" },
    { id: "RO", name: "Rovigo" },
    { id: "SA", name: "Salerno" },
    { id: "VS", name: "Medio Campidano" },
    { id: "SS", name: "Sassari" },
    { id: "SV", name: "Savona" },
    { id: "SI", name: "Siena" },
    { id: "SR", name: "Siracusa" },
    { id: "SO", name: "Sondrio" },
    { id: "TA", name: "Taranto" },
    { id: "TE", name: "Teramo" },
    { id: "TR", name: "Terni" },
    { id: "TO", name: "Torino" },
    { id: "OG", name: "Ogliastra" },
    { id: "TP", name: "Trapani" },
    { id: "TN", name: "Trento" },
    { id: "TV", name: "Treviso" },
    { id: "TS", name: "Trieste" },
    { id: "UD", name: "Udine" },
    { id: "VA", name: "Varese" },
    { id: "VE", name: "Venezia" },
    { id: "VB", name: "Verbano-Cusio-Ossola" },
    { id: "VC", name: "Vercelli" },
    { id: "VR", name: "Verona" },
    { id: "VV", name: "Vibo Valentia" },
    { id: "VI", name: "Vicenza" },
    { id: "VT", name: "Viterbo" }
];

const badWords = [
    'cagare', 
    'cagata', 
    'cagate',
    'cazzaro', 
    'cazzata', 
    'cazzate',
    'cazzi', 
    'cazzo', 
    'cazzone', 
    'cazzoni',
    'coglionando', 
    'coglionare', 
    'coglionata', 
    'coglione', 
    'coglioni',
    'culattone', 
    'culattoni',
    'fanculizzati', 
    'fanculo', 
    'ficcatelo', 
    'fottere', 
    'fottiti', 
    'fottuta', 
    'fottuto', 
    'froci',
    'frocio', 
    'fuck', 
    'minchiata', 
    'minchiate',
    'minchione', 
    'minchioni',
    'puttana', 
    'puttane',
    'puttaniere', 
    'puttanieri',
    'rottinculo', 
    'sfanculare', 
    'stronzata', 
    'stronzate', 
    'stronzo', 
    'stronzi', 
    'suca', 
    'sucare', 
    'sucamelo', 
    'succhiamelo', 
    'troiaio', 
    'troie', 
    'vaffanculo'
];