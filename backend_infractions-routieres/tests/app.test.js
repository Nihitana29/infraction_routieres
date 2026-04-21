const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

// Mocks
jest.mock('./../config/database', () => jest.fn(() => Promise.resolve()));

// Mocking models before requiring app
jest.mock('./../models/voiture.model', () => ({
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    save: jest.fn()
}));

jest.mock('./../models/infraction.model', () => ({
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    save: jest.fn()
}));

const mockVoiture = require('./../models/voiture.model');
const mockInfraction = require('./../models/infraction.model');

describe('API Infractions Routières', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Gestion des Voitures', () => {
        it('POST /api/voitures - Succès', async () => {
            const data = { plaque: '1234 TAA', proprietaire: 'Jean', marque: 'Peugeot', modele: '208' };
            mockVoiture.create.mockResolvedValue(data);

            const res = await request(app).post('/api/voitures').send(data);
            expect(res.statusCode).toBe(201);
            expect(res.body.plaque).toBe('1234 TAA');
        });

        it('POST /api/voitures - Erreur Validation Plaque', async () => {
            const data = { plaque: 'INVALID', proprietaire: 'Jean', marque: 'Peugeot', modele: '208' };
            const res = await request(app).post('/api/voitures').send(data);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toContain('Erreur de validation');
        });

        it('GET /api/voitures/:id - Liste', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            mockVoiture.findById.mockResolvedValue({ _id: id, plaque: '1234 TAA' });
            const res = await request(app).get(`/api/voitures/${id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.plaque).toBe('1234 TAA');
        });

        it('PUT /api/voitures/:id - Succès', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const data = { plaque: '1234 TAA', proprietaire: 'Updated', marque: 'P', modele: 'M' };
            mockVoiture.findByIdAndUpdate.mockResolvedValue({ _id: id, ...data });
            const res = await request(app).put(`/api/voitures/${id}`).send(data);
            expect(res.statusCode).toBe(200);
            expect(res.body.proprietaire).toBe('Updated');
        });

        it('DELETE /api/voitures/:id - Succès', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            mockVoiture.findByIdAndDelete.mockResolvedValue({ _id: id });
            const res = await request(app).delete(`/api/voitures/${id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Voiture supprimée');
        });
    });

    describe('Gestion des Infractions', () => {
        it('POST /api/infractions - Succès', async () => {
            const voitureId = new mongoose.Types.ObjectId();
            const infractionData = { plaque: '1234 TAA', type: 'Vitesse', montant: 5000 };
            
            mockVoiture.findOne.mockResolvedValue({ _id: voitureId, plaque: '1234 TAA' });
            mockInfraction.create.mockResolvedValue({ ...infractionData, voiture: voitureId });

            const res = await request(app).post('/api/infractions').send(infractionData);
            expect(res.statusCode).toBe(201);
        });

        it('GET /api/infractions - Liste', async () => {
            mockInfraction.find.mockReturnThis();
            mockInfraction.populate.mockResolvedValue([{ type: 'Vitesse' }]);
            const res = await request(app).get('/api/infractions');
            expect(res.statusCode).toBe(200);
            expect(res.body[0].type).toBe('Vitesse');
        });

        it('GET /api/infractions/:id - Succès', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            mockInfraction.findById.mockReturnThis();
            mockInfraction.populate.mockResolvedValue({ _id: id, type: 'Vitesse' });
            const res = await request(app).get(`/api/infractions/${id}`);
            expect(res.statusCode).toBe(200);
        });

        it('PUT /api/infractions/:id - Succès', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const voitureId = new mongoose.Types.ObjectId();
            const data = { plaque: '1234 TAA', type: 'Vitesse', montant: 6000 };
            
            mockVoiture.findOne.mockResolvedValue({ _id: voitureId });
            mockInfraction.findByIdAndUpdate.mockResolvedValue({ _id: id, ...data });
            
            const res = await request(app).put(`/api/infractions/${id}`).send(data);
            expect(res.statusCode).toBe(200);
            expect(res.body.montant).toBe(6000);
        });

        it('DELETE /api/infractions/:id - Succès', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            mockInfraction.findByIdAndDelete.mockResolvedValue({ _id: id });
            const res = await request(app).delete(`/api/infractions/${id}`);
            expect(res.statusCode).toBe(200);
        });

        it('POST /api/paiement/:id - Succès', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            mockInfraction.findByIdAndUpdate.mockResolvedValue({ _id: id, statut: 'paye' });
            const res = await request(app).post(`/api/paiement/${id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.statut).toBe('paye');
        });

        it('POST /api/infractions - 404 si voiture non trouvée', async () => {
            mockVoiture.findOne.mockResolvedValue(null);
            const res = await request(app).post('/api/infractions').send({ 
                plaque: '1234 TAA', 
                type: 'Vitesse', 
                montant: 5000 
            });
            expect(res.statusCode).toBe(404);
        });

        it('GET /api/infractions/voiture/:id - Succès', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            mockVoiture.findById.mockResolvedValue({ _id: id });
            mockInfraction.find.mockReturnThis();
            mockInfraction.populate.mockResolvedValue([{ type: 'Vitesse' }]);
            const res = await request(app).get(`/api/infractions/voiture/${id}`);
            expect(res.statusCode).toBe(200);
        });
    });

    describe('Gestion des Voitures (Suite)', () => {
        it('GET /api/voitures - Liste', async () => {
            mockVoiture.find.mockResolvedValue([{ plaque: '1234 TAA' }]);
            const res = await request(app).get('/api/voitures');
            expect(res.statusCode).toBe(200);
        });
    });

    describe('Sécurité & XSS', () => {
        it('devrait échapper les entrées suspectes', async () => {
            const data = { 
                plaque: '1234 TAA', 
                proprietaire: '<script>alert(1)</script>', 
                marque: 'Test', 
                modele: 'Test' 
            };
            mockVoiture.create.mockImplementation(d => Promise.resolve(d));
            
            const res = await request(app).post('/api/voitures').send(data);
            // express-validator escape() change < à &lt;
            expect(res.body.proprietaire).not.toContain('<script>');
        });
    });
});
