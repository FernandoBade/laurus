import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const Tag = mongoose.model('Tag', tagSchema, 'tags');

export default Tag;
