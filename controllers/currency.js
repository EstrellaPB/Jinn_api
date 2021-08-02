'user strict'

const Currency = require('../models/currency');
const { validationResult } = require('express-validator');

function getAll(req, res) {
    Currency.find()
        .exec()
        .then((currenciesFound) => {
            res.status(200).send({ currencies: currenciesFound });
        }).catch(err => {
            res.status(500).send({ message: 'No currencies found' });
        });
}

function saveCurrency(req, res) {
    try {
        validationResult(req).throw();

        var currency = new Currency();

        var params = req.body;
        console.log(params);
        currency.code = params.code;
        currency.symbol = params.symbol;
        if (currency.code != null && currency.symbol != null) {
            currency.save((err, currencyStored) => {
                if (err) {
                    res.status(500).send({ message: 'Could not save currency'});
                } else {
                    if (!currencyStored) {
                        res.status(404).send({ message: 'Could not save currency' });

                    } else {
                        res.status(200).send({ currency: currencyStored });
                    }
                }
            });
        } else {
            res.status(500).send({ message: 'Please, introduce all inputs' });
        }
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

module.exports = {
    getAll,
    saveCurrency
}