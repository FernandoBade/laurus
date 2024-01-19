import mongoose from 'mongoose';
import Usuario from './usuario';

const tagSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

tagSchema.index({ nome: 1, usuario: 1 }, { unique: true })

const Tag = mongoose.model('Tag', tagSchema, 'Tag');

export default Tag;
