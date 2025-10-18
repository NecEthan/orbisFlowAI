import express from "express";
// multer removed - no file uploads needed

const router = express.Router();

// File upload endpoint removed - focusing on text input only
router.post("/upload", (req, res) => {
  res.status(501).json({ 
    error: 'File upload not supported. Please use text input in Design Standards instead.',
    message: 'This endpoint is disabled. Use the Design Standards tab to enter text for AI context.'
  });
});

export default router;
