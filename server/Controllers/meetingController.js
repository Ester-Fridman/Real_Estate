const express = require('express');
const router = express.Router();

const Meetings = require("../Models/meeting");
const logger = require('../logger');

router.get('/', async (req, res) => {
    try {
        const meetings = await Meetings.find();
        logger.info(`Fetched ${meetings.length} meetings successfully`);
        res.status(200).json(meetings);
    } catch (error) {
        logger.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Error fetching meetings' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const meeting = await Meetings.findById(id);
        if (!meeting) {
            logger.warn(`Meeting with ID ${id} not found`);
            return res.status(404).json({ message: 'Meeting not found' });
        }
        logger.info(`Meeting with ID ${id} fetched successfully`);
        res.status(200).json(meeting);
    } catch (error) {
        logger.error('Error fetching meeting:', error);
        res.status(500).json({ message: 'Error fetching meeting' });
    }
});

router.post('/', async (req, res) => {
    const { userId, serviceId, date, notes } = req.body;

    if (!userId || !serviceId || !date) {
        logger.warn('Missing required fields for meeting creation');
        return res.status(400).json({ message: 'User ID, Service ID, and Date are required' });
    }

    try {
        const newMeeting = new Meetings({
            userId,
            serviceId,
            date,
            notes: notes || '',
            status: 'pending'
        });

        await newMeeting.save();
        logger.info(`New meeting created for user ${userId} on ${date}`);
        res.status(201).json(newMeeting);
    } catch (error) {
        logger.error('Error creating meeting:', error);
        res.status(500).json({ message: 'Error creating meeting' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    try {
        const updatedMeeting = await Meetings.findByIdAndUpdate(id, { status, notes }, { new: true });
        if (!updatedMeeting) {
            logger.warn(`Meeting with ID ${id} not found for update`);
            return res.status(404).json({ message: 'Meeting not found' });
        }
        logger.info(`Meeting with ID ${id} updated successfully`);
        res.status(200).json(updatedMeeting);
    } catch (error) {
        logger.error('Error updating meeting:', error);
        res.status(500).json({ message: 'Error updating meeting' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMeeting = await Meetings.findByIdAndDelete(id);
        if (!deletedMeeting) {
            logger.warn(`Meeting with ID ${id} not found for deletion`);
            return res.status(404).json({ message: 'Meeting not found' });
        }
        logger.info(`Meeting with ID ${id} deleted successfully`);
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        logger.error('Error deleting meeting:', error);
        res.status(500).json({ message: 'Error deleting meeting' });
    }
});

module.exports = router;