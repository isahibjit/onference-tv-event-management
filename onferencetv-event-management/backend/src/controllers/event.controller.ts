import { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/event.service';

export const getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const events = await eventService.getEvents();
    res.status(200).json({
      success: true,
      message: 'Events fetched successfully',
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await eventService.getEventById(req.params.id as string);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Event fetched successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newEvent = await eventService.createEvent(req.body);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const eventExists = await eventService.getEventById(req.params.id as string);
    if (!eventExists) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }
    const updatedEvent = await eventService.updateEvent(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const eventExists = await eventService.getEventById(req.params.id as string);
    if (!eventExists) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }
    await eventService.deleteEvent(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const generateContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await eventService.generateContent(req.params.id as string);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Content generated successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
