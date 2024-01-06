import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 1000 * 5,
	limit: 10,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
  message: async (req, res) => {return res.status(429).json({message: "Rate limit exceeded"})},
  
})

export default limiter;