import express from 'express';
import { getFoodItems, addFoodItem, analyzeImage, claimFood, trackFood } from '../controllers/foodController.js';
const router = express.Router();
router.get('/nearby',getFoodItems);
router.post('/',addFoodItem);
router.post('/analyze',analyzeImage);
router.put('/:id/claim', claimFood);
router.post('/track', trackFood);
export default router;