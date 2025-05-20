import axios from 'axios';

const API_KEY = process.env.RANDOMMER_API_KEY;
console.log('--------------- Using Randommer API key:', API_KEY);
const randommerHeaders = {
  headers: {
    'X-Api-Key': API_KEY
  }
};

const Pipeline = class Pipeline {
  constructor(app) {
    this.app = app;
    this.run();
  }

  run() {
    this.app.get('/pipeline', async (req, res) => {
      try {
        const userRes = await axios.get('https://randomuser.me/api');
        const user = userRes.data.results[0];
        const [iban, phone] = await Promise.all([
          axios.get('https://randommer.io/api/Finance/Iban/FR', randommerHeaders),
          axios.get('https://randommer.io/api/Phone/Generate?CountryCode=FR&Quantity=1', randommerHeaders)
          // axios.get('https://randommer.io/api/pet-names', randommerHeaders)
        ]);
        const [joke, cat] = await Promise.all([
          axios.get('https://official-joke-api.appspot.com/random_joke'),
          axios.get('https://meowfacts.herokuapp.com/')
        ]);
        const cardRes = await axios.get('https://randommer.io/api/Card', randommerHeaders);
        const { fullName, ...card } = cardRes.data;

        const profile = {
          fullName: `${user.name.first} ${user.name.last}`,
          phone: phone.data,
          iban: iban.data,
          creditCard: card,
          // pet: pet.data,
          joke: `${joke.data.setup} - ${joke.data.punchline}`,
          catFact: cat.data.data[0]
        };

        res.status(200).json(profile);
      } catch (err) {
        console.error('[ERROR] /pipeline ->', err);
        res.status(500).json({ error: 'Pipeline failed', detail: err.message });
      }
    });
  }
};

export default Pipeline;
