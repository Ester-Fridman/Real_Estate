const express = require('express');
const router = express.Router();

const Business = require("../Models/business");
const logger = require('../logger');

router.get('/', async (req, res) => {
    try {
        const businesses = await Business.find();
        logger.info(`Fetched ${businesses.length} businesses successfully`);
        res.status(200).json(businesses);
    } catch (error) {
        logger.error('Error fetching businesses:', error);
        res.status(500).json({ message: 'Error fetching businesses' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const business = await Business.findById(id);
        if (!business) {
            logger.warn(`Business with ID ${id} not found`);
            return res.status(404).json({ message: 'Business not found' });
        }
        logger.info(`Business with ID ${id} fetched successfully`);
        res.status(200).json(business);
    } catch (error) {
        logger.error('Error fetching business:', error);
        res.status(500).json({ message: 'Error fetching business' });
    }
});

router.post('/', async (req, res) => {
    const { name, area, phone, workingHours, ownerId } = req.body;

    if (!name || !area || !phone || !workingHours || !ownerId) {
        logger.warn('Missing required fields for business creation');
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newBusiness = new Business({
            name,
            area,
            phone,
            workingHours,
            ownerId,
            isVerified: false,
            status: 'active'
        });

        await newBusiness.save();
        logger.info(`New business created: ${newBusiness.name}`);
        res.status(201).json(newBusiness);
    } catch (error) {
        logger.error('Error creating business:', error);
        res.status(500).json({ message: 'Error creating business' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, area, phone, workingHours, ownerId, isVerified, status } = req.body;

    try {
        const updatedBusiness = await Business.findByIdAndUpdate(id, {
            name,
            area,
            phone,
            workingHours,
            ownerId,
            isVerified,
            status
        }, { new: true });

        if (!updatedBusiness) {
            logger.warn(`Business with ID ${id} not found for update`);
            return res.status(404).json({ message: 'Business not found' });
        }
        logger.info(`Business with ID ${id} updated successfully`);
        res.status(200).json(updatedBusiness);
    } catch (error) {
        logger.error('Error updating business:', error);
        res.status(500).json({ message: 'Error updating business' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBusiness = await Business.findByIdAndDelete(id);
        if (!deletedBusiness) {
            logger.warn(`Business with ID ${id} not found for deletion`);
            return res.status(404).json({ message: 'Business not found' });
        }
        logger.info(`Business with ID ${id} deleted successfully`);
        res.status(200).json({ message: 'Business deleted successfully' });
    } catch (error) {
        logger.error('Error deleting business:', error);
        res.status(500).json({ message: 'Error deleting business' });
    }
}); 

module.exports = router;