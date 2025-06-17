const express = require('express');
const router = express.Router();

const Service = require("../Models/service");
const logger = require('../logger');

router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        logger.info(`Fetched ${services.length} services successfully`);
        res.status(200).json(services);
    } catch (error) {
        logger.error('Error fetching services:', error);
        res.status(500).json({ message: 'Error fetching services' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findById(id);
        if (!service) {
            logger.warn(`Service with ID ${id} not found`);
            return res.status(404).json({ message: 'Service not found' });
        }
        logger.info(`Service with ID ${id} fetched successfully`);
        res.status(200).json(service);
    } catch (error) {
        logger.error('Error fetching service:', error);
        res.status(500).json({ message: 'Error fetching service' });
    }
});

router.post('/', async (req, res) => {
    const { name, description, price, businessId } = req.body;

    if (!name || !description || !price || !businessId) {
        logger.warn('Missing required fields for service creation');
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newService = new Service({
            name,
            description,
            price,
            businessId
        });

        await newService.save();
        logger.info(`New service created: ${newService.name}`);
        res.status(201).json(newService);
    } catch (error) {
        logger.error('Error creating service:', error);
        res.status(500).json({ message: 'Error creating service' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    try {
        const updatedService = await Service.findByIdAndUpdate(id, { name, description, price }, { new: true });
        if (!updatedService) {
            logger.warn(`Service with ID ${id} not found for update`);
            return res.status(404).json({ message: 'Service not found' });
        }
        logger.info(`Service with ID ${id} updated successfully`);
        res.status(200).json(updatedService);
    } catch (error) {
        logger.error('Error updating service:', error);
        res.status(500).json({ message: 'Error updating service' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) {
            logger.warn(`Service with ID ${id} not found for deletion`);
            return res.status(404).json({ message: 'Service not found' });
        }
        logger.info(`Service with ID ${id} deleted successfully`);
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        logger.error('Error deleting service:', error);
        res.status(500).json({ message: 'Error deleting service' });
    }
});

module.exports = router;