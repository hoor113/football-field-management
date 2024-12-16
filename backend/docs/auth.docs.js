/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - fullname
 *         - email
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         fullname:
 *           type: string
 *         email:
 *           type: string
 */ 