// One entry per car: twelve Fords, 1896 to 2025. The cutout is img/car/<id>.webp and the hero
// cards are img/card/<id>-0.jpg to img/card/<id>-<shots-1>.jpg.
// `word` is the giant name behind the car in the showroom.
export const ERAS = [
  {
    id: 'quadricycle', word: 'QUADRICYCLE', shots: 2,
    year: 1896, label: '1896', theme: 'A carriage from a shed',
    name: 'Ford Quadricycle',
    text: 'Henry Ford built it in a brick shed behind his Detroit home and first drove it in June 1896. Four bicycle wheels, a two-cylinder engine and a tiller to steer.',
    specs: [['Engine', 'Two-cylinder'], ['Power', '4 hp'], ['Top speed', '32 km/h']],
  },
  {
    id: 'modelt', word: 'MODEL T', shots: 2,
    year: 1908, label: '1908', theme: 'A car for everyone',
    name: 'Ford Model T',
    text: 'Tall, upright and built for dirt roads. From 1913 a moving assembly line built it, and the price kept falling. By 1927 more than 15 million had been made.',
    specs: [['Engine', '2.9 L four-cylinder'], ['Power', '20 hp'], ['Built', '1908 to 1927']],
  },
  {
    id: 'v8', word: 'V8', shots: 2,
    year: 1932, label: '1932', theme: 'A V8 for everyone',
    name: 'Ford V8 (Model 18)',
    text: 'The first low-priced car with a V8, made possible by casting the whole engine block in one piece. Hot rodders have loved the 1932 body ever since.',
    specs: [['Engine', '3.6 L flathead V8'], ['Power', '65 hp'], ['Block', 'Cast in one piece']],
  },
  {
    id: 'thunderbird', word: 'THUNDERBIRD', shots: 2,
    year: 1955, label: '1955', theme: 'Two seats and a V8',
    name: 'Ford Thunderbird',
    text: 'Ford sold its two-seater as a personal luxury car rather than a sports car. A removable fibreglass hardtop came as standard.',
    specs: [['Engine', '4.8 L V8'], ['Seats', 'Two'], ['Roof', 'Removable hardtop']],
  },
  {
    id: 'mustang', word: 'MUSTANG', shots: 2,
    year: 1964, label: '1964', theme: 'The pony car',
    name: 'Ford Mustang',
    text: 'Unveiled at the New York World\'s Fair in April 1964, with a long bonnet and a short tail. It gave its name to a whole class of cars.',
    specs: [['Debut', 'April 1964'], ['Base engine', '2.8 L straight-six'], ['Shape', 'Long hood, short deck']],
  },
  {
    id: 'gt40', word: 'GT40', shots: 2,
    year: 1966, label: '1966', theme: 'Forty inches tall',
    name: 'Ford GT40 Mk II',
    text: 'Ford built it to beat Ferrari at Le Mans, and in 1966 Mk IIs finished first, second and third. It is named for its height: 40 inches.',
    specs: [['Engine', '7.0 L V8'], ['Height', '40 in'], ['Le Mans 1966', '1st, 2nd, 3rd']],
  },
  {
    id: 'fordgt', word: 'FORD GT', shots: 2,
    year: 2017, label: '2017', theme: 'Shaped by air',
    name: 'Ford GT',
    text: 'A carbon-fibre tub and a twin-turbo V6, with the body pulled tight around channels for the air. Its race version won its class at Le Mans in 2016.',
    specs: [['Engine', '3.5 L twin-turbo V6'], ['Power', '647 hp'], ['Top speed', '348 km/h']],
  },
  {
    id: 'gt500', word: 'GT500', shots: 2,
    year: 2020, label: '2020', theme: 'The most powerful road Ford',
    name: 'Ford Mustang Shelby GT500',
    text: 'When it went on sale as a 2020 model, its 760 hp made it the most powerful road-legal Ford ever built. Its seven-speed dual-clutch gearbox shifts in under 100 milliseconds.',
    specs: [['Engine', '5.2 L supercharged V8'], ['Power', '760 hp'], ['Gearbox', '7-speed dual-clutch']],
  },
  {
    id: 'mache', word: 'MACH-E', shots: 2,
    year: 2021, label: '2021', theme: 'The Mustang goes electric',
    name: 'Ford Mustang Mach-E',
    text: 'The first electric Mustang, and the first with more than two doors: a crossover revealed in November 2019 and delivered from December 2020.',
    specs: [['Drive', 'Battery electric'], ['Body', 'Five-door crossover'], ['On sale', 'December 2020']],
  },
  {
    id: 'gtmk4', word: 'MK IV', shots: 2,
    year: 2023, label: '2023', theme: 'The last Ford GT',
    name: 'Ford GT Mk IV',
    text: 'A track-only farewell to the Ford GT, named after the GT40 Mk IV that won Le Mans in 1967. Multimatic hand-built 67 of them.',
    specs: [['Power', '800 hp'], ['Built', '67'], ['Use', 'Track only']],
  },
  {
    id: 'darkhorse', word: 'DARK HORSE', shots: 2,
    year: 2024, label: '2024', theme: 'The seventh generation',
    name: 'Ford Mustang Dark Horse',
    text: 'The seventh-generation Mustang was revealed in Detroit in September 2022. The Dark Horse is its track-focused version, with Ford\'s most powerful naturally aspirated V8 yet.',
    specs: [['Engine', '5.0 L V8'], ['Power', '500 hp'], ['Gearbox', '6-speed manual']],
  },
  {
    id: 'gtd', word: 'GTD', shots: 2,
    year: 2025, label: '2025', theme: 'Under seven minutes',
    name: 'Ford Mustang GTD',
    text: 'The first American production car to lap the Nürburgring in under seven minutes. It is developed from the Mustang GT3 race car and hand-built by Multimatic in Canada.',
    specs: [['Engine', '5.2 L supercharged V8'], ['Power', '815 hp'], ['Top speed', '325 km/h']],
  },
];
