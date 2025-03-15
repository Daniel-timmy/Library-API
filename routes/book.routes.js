import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { addBook, getAllBooks, getBook, borrowBook, returnBook, updateBook, deleteBook } from '../controllers/book.controller.js';

const bookRouter = Router();

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Add a new book
 *     description: Adds a new book to the collection. Requires authentication.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - pages
 *               - author
 *               - genre
 *             properties:
 *               name:
 *                 type: string
 *                 example: "The Art of War"
 *               pages:
 *                 type: number
 *                 example: 250
 *               author:
 *                 type: string
 *                 example: "Sun Tzu"
 *               genre:
 *                 type: string
 *                 enum: ["war", "technology", "sport", "history", "politics"]
 *                 example: "war"
 *     responses:
 *       201:
 *         description: Book successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "The Art of War"
 *                 pages:
 *                   type: number
 *                   example: 250
 *                 author:
 *                   type: string
 *                   example: "Sun Tzu"
 *                 genre:
 *                   type: string
 *                   example: "war"
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal Server Error
 */
bookRouter.post('/', authorize, addBook);

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Retrieve all books
 *     description: Returns a list of all books in the collection.
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "The Art of War"
 *                   pages:
 *                     type: number
 *                     example: 250
 *                   author:
 *                     type: string
 *                     example: "Sun Tzu"
 *                   genre:
 *                     type: string
 *                     enum: ["war", "technology", "sport", "history", "politics"]
 *                     example: "war"
 *       500:
 *         description: Internal Server Error
 */
bookRouter.get('/', getAllBooks);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieves details of a specific book using its ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the book
 *         schema:
 *           type: string
 *         example: "65a3bcf5e9d2a0b3c4d56789"
 *     responses:
 *       200:
 *         description: Successfully retrieved the book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "65a3bcf5e9d2a0b3c4d56789"
 *                 name:
 *                   type: string
 *                   example: "The Art of War"
 *                 pages:
 *                   type: number
 *                   example: 250
 *                 author:
 *                   type: string
 *                   example: "Sun Tzu"
 *                 genre:
 *                   type: string
 *                   enum: ["war", "technology", "sport", "history", "politics"]
 *                   example: "war"
 *       400:
 *         description: Bad request - Invalid book ID
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */

bookRouter.get('/:id', getBook);
/**
 * @swagger
 * /api/v1/books/borrow/{id}:
 *   put:
 *     summary: Borrow a book by ID
 *     description: Marks a book as borrowed. Requires authentication.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []  # Requires authentication (JWT token)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the book to borrow
 *         schema:
 *           type: string
 *         example: "65a3bcf5e9d2a0b3c4d56789"
 *     responses:
 *       200:
 *         description: Book successfully borrowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book borrowed successfully"
 *       400:
 *         description: Bad request - Invalid book ID
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Book not found
 *       409:
 *         description: Conflict - Book is already borrowed
 *       500:
 *         description: Internal Server Error
 */

bookRouter.put('/borrow/:id', authorize, borrowBook)

/**
 * @swagger
 * /api/v1/books/return/{id}:
 *   put:
 *     summary: Return a borrowed book by ID
 *     description: Marks a borrowed book as returned. Requires authentication.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []  # Requires authentication (JWT token)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the book to return
 *         schema:
 *           type: string
 *         example: "65a3bcf5e9d2a0b3c4d56789"
 *     responses:
 *       200:
 *         description: Book successfully returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book returned successfully"
 *       400:
 *         description: Bad request - Book can not be returned by another person.
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Book not found
 *       409:
 *         description: Conflict - Book is already returned
 *       500:
 *         description: Internal Server Error
 */

bookRouter.put('/return/:id', authorize, returnBook)

/**
 * @swagger
 * /api/v1/books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     description: Updates the details of an existing book using its ID. Requires authentication.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []  # Requires authentication (JWT token)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the book to be updated
 *         schema:
 *           type: string
 *         example: "65a3bcf5e9d2a0b3c4d56789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "The Art of War - Revised Edition"
 *               pages:
 *                 type: number
 *                 example: 300
 *               author:
 *                 type: string
 *                 example: "Sun Tzu"
 *               genre:
 *                 type: string
 *                 enum: ["war", "technology", "sport", "history", "politics"]
 *                 example: "war"
 *     responses:
 *       200:
 *         description: Book successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "65a3bcf5e9d2a0b3c4d56789"
 *                 name:
 *                   type: string
 *                   example: "The Art of War - Revised Edition"
 *                 pages:
 *                   type: number
 *                   example: 300
 *                 author:
 *                   type: string
 *                   example: "Sun Tzu"
 *                 genre:
 *                   type: string
 *                   enum: ["war", "technology", "sport", "history", "politics"]
 *                   example: "war"
 *       400:
 *         description: Bad request - Book can only be updated by the owner.
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Book not found- Invalid Book ID
 *       500:
 *         description: Internal Server Error
 */

bookRouter.put('/:id', authorize, updateBook)

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     description: Removes a book from the collection using its ID. Requires authentication.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []  # Requires authentication (JWT token)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the book to be deleted
 *         schema:
 *           type: string
 *         example: "65a3bcf5e9d2a0b3c4d56789"
 *     responses:
 *       200:
 *         description: Book successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book deleted successfully"
 *       400:
 *         description: Bad request - Books can only be deleted by their owner.
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Book not found- Invalid Book ID
 *       500:
 *         description: Internal Server Error
 */

bookRouter.delete('/:id', authorize, deleteBook);



export default bookRouter;