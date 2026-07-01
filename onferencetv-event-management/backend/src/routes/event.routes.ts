import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { eventSchema } from '../validators/event.validator';

const router = Router();

router.get('/', eventController.getEvents);
router.post('/', validateRequest(eventSchema), eventController.createEvent);
router.get('/:id', eventController.getEventById);
router.put('/:id', validateRequest(eventSchema), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.post('/:id/generate-content', eventController.generateContent);

export default router;
