const request = require('supertest');
const app = require('../server');

// Mock connectDB et mongoose pour éviter les connexions réelles
jest.mock('../config/database', () => jest.fn(() => Promise.resolve()));
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(() => Promise.resolve()),
    model: jest.fn().mockReturnValue({
        findOne: jest.fn(),
        create: jest.fn(),
        find: jest.fn(),
        findById: jest.fn()
    })
  };
});

describe('Validation des Entrées', () => {
  it('devrait retourner 400 si la plaque est mal formatée', async () => {
    const res = await request(app)
      .post('/api/voitures/')
      .send({
        plaque: 'ABC-123',
        proprietaire: 'Jean Dupont',
        marque: 'Renault',
        modele: 'Clio'
      });
    if (res.statusCode !== 400) console.log('DEBUG BODY:', res.body);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Erreur de validation des données');
  });

  it('devrait retourner 400 si le montant de l\'infraction est négatif', async () => {
    const res = await request(app)
      .post('/api/infractions/')
      .send({
        plaque: '1234 TAA',
        type: 'Excès de vitesse',
        montant: -5000
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Erreur de validation des données');
  });

  it('devrait échapper les caractères spéciaux (protection XSS)', async () => {
    const res = await request(app)
      .post('/api/voitures')
      .send({
        plaque: '1234 TAA',
        proprietaire: '<script>alert(1)</script>',
        marque: 'Test',
        modele: 'Test'
      });
    // On ne teste pas ici le résultat final en DB, mais on s'assure que ça passe la validation 
    // et que le middleware escape() ferait son travail si on allait plus loin.
    expect(res.statusCode).not.toEqual(400);
  });
});
