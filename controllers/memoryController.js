const Memory = require('../models/Memory');

module.exports.memories_get = (req, res) => {
    Memory
        .find({ user: req.params.user })
        .then(memories => res.json(memories))
        .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.memory_post = (req, res) => {
    const newMemory = new Memory({
        color: req.body.color,
        user: req.body.user,
        creationDate: req.body.creationDate
    });

    newMemory
        .save()
        .then(memory => res.json(memory))
        .catch(err => res.status(404).json('Error: ' + err));
}

module.exports.memory_update = (req, res) => {
    Memory
        .findById(req.params.id)
        .then(memory => {
            let properties = ['title','author','genre','published','pages','started','finished','rating','why','words','quotes','moments','url','user','color']
            properties.map(p => memory[p] != req.body[p] ? memory[p] = req.body[p] : null)
            console.log(memory)
            console.log('^amemory')
            memory.save()
                .then(() => res.json('Memory updated!'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(404).json('Error: ' + err));
}

module.exports.memory_delete = (req, res) => {
    Memory
        .findById(req.params.id)
        .then(memory => memory.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json('Error: ' + err));
}