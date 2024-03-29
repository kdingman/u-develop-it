const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET all candidates
router.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                    AS party_name
                    FROM candidates
                    LEFT JOIN parties
                    ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET a single candidate
router.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                    AS party_name
                    FROM candidates
                    LEFT JOIN parties
                    ON candidates.party_id = parties.id
                    WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if(err){
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// DELETE a canidate
router.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if(err){
            res.statusMessage(400).json({ error: res.message });
        }
        else if(!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
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

// Create a candidate
router.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name','last_name', 'industry_connected');
    if(errors){
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
        VALUES (?,?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

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

// Update a candidate's party
router.put('./api/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
        if(errors){
            res.status(400).json({ error: errors });
            return;
        }
    const sql = `UPDATE candidates SET party_id = ?
                    WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if(err){
            res.status(400).json({ error: err.message });
            // check if a record was found
        }
        else if(!restoreDefaultPrompts.affectedRows) {
            res.json({
                message: 'Candidate non found'
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

module.exports = router;