import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true
});

tagSchema.index({ nome: 1, usuario: 1 }, { unique: true })

const Tag = mongoose.model('Tag', tagSchema, 'Tag');

export default Tag;
