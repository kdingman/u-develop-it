const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.get('/api/voters', (res, req) => {
    const sql = `SELECT * FROM voters ORDER by last_name`;
    db.query(sql, (err, rows) => {
        if(err){
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get single voter
router.get('/api/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id =?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if(err) {
            res.status(400).json(({ error: err.message }));
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// GET people to register through the app
router.post('/api/voter', ({ body }, res) => {
    // Data Validation
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
        if(errors) {
            res.status(400).json({ error: errors });
            return;
        }
    const sql = `INSERT INTO voters (first_name, last_name, email)
                    VALUE (?, ?, ?,)`;
    const params = [body.first_name, body.last_name, body.email];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// Update Email Address
router.put('/api/voter/:id', (req, res) => {
    // Data Validation
    const errors = inputCheck(req.body, 'email');
    if(errors) {
        res.status(400).json({ errorr: errors });
        return;
    }
    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
        }
        else if(!result.affectedRows) {
            res.json({
                message: 'Voter not found.'
            });
        }
        else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// Delete voters from database
router.delete('/api/voter/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;

    db.query(sql, req.params.id, (err, result) => {
        if(err) {
            res.status(400).json({ error: res.message });
        }
        else if(!result.affectedRows) {
            res.json({
                message: 'Voter not found'
            });
        }
        else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

module.exports = router;