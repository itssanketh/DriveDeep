// One entry per car: seven Fords, 1896 to 2017. The cutout is img/car/<id>.webp and the hero
// cards are img/card/<id>-0.jpg to img/card/<id>-<shots-1>.jpg.
// `tint` colours the light on the floor under that car in the showroom.
export const ERAS = [
  {
    id: 'quadricycle', shots: 3, tint: '#b7803c',
    year: 1896, label: '1896', theme: 'A carriage from a shed',
    name: 'Ford Quadricycle',
    text: 'Henry Ford built it in a brick shed behind his Detroit home and first drove it in June 1896. Four bicycle wheels, a two-cylinder engine and a tiller to steer.',
    specs: [['Engine', 'Two-cylinder'], ['Power', '4 hp'], ['Top speed', '32 km/h']],
  },
  {
    id: 'modelt', shots: 3, tint: '#7d8a6a',
    year: 1908, label: '1908', theme: 'A car for everyone',
    name: 'Ford Model T',
    text: 'Tall, upright and built for dirt roads. From 1913 a moving assembly line built it, and the price kept falling. By 1927 more than 15 million had been made.',
    specs: [['Engine', '2.9 L four-cylinder'], ['Power', '20 hp'], ['Built', '1908 to 1927']],
  },
  {
    id: 'v8', shots: 3, tint: '#4f6b58',
    year: 1932, label: '1932', theme: 'A V8 for everyone',
    name: 'Ford V8 (Model 18)',
    text: 'The first low-priced car with a V8, made possible by casting the whole engine block in one piece. Hot rodders have loved the 1932 body ever since.',
    specs: [['Engine', '3.6 L flathead V8'], ['Power', '65 hp'], ['Block', 'Cast in one piece']],
  },
  {
    id: 'thunderbird', shots: 3, tint: '#c0392b',
    year: 1955, label: '1955', theme: 'Two seats and a V8',
    name: 'Ford Thunderbird',
    text: 'Ford sold its two-seater as a personal luxury car rather than a sports car. A removable fibreglass hardtop came as standard.',
    specs: [['Engine', '4.8 L V8'], ['Seats', 'Two'], ['Roof', 'Removable hardtop']],
  },
  {
    id: 'mustang', shots: 3, tint: '#c9c9c4',
    year: 1964, label: '1964', theme: 'The pony car',
    name: 'Ford Mustang',
    text: 'Unveiled at the New York World\'s Fair in April 1964, with a long bonnet and a short tail. It gave its name to a whole class of cars.',
    specs: [['Debut', 'April 1964'], ['Base engine', '2.8 L straight-six'], ['Shape', 'Long hood, short deck']],
  },
  {
    id: 'gt40', shots: 3, tint: '#8a8f99',
    year: 1966, label: '1966', theme: 'Forty inches tall',
    name: 'Ford GT40 Mk II',
    text: 'Ford built it to beat Ferrari at Le Mans, and in 1966 Mk IIs finished first, second and third. It is named for its height: 40 inches.',
    specs: [['Engine', '7.0 L V8'], ['Height', '40 in'], ['Le Mans 1966', '1st, 2nd, 3rd']],
  },
  {
    id: 'fordgt', shots: 3, tint: '#2f6fd1',
    year: 2017, label: '2017', theme: 'Shaped by air',
    name: 'Ford GT',
    text: 'A carbon-fibre tub and a twin-turbo V6, with the body pulled tight around channels for the air. Its race version won its class at Le Mans in 2016.',
    specs: [['Engine', '3.5 L twin-turbo V6'], ['Power', '647 hp'], ['Top speed', '348 km/h']],
  },
];
