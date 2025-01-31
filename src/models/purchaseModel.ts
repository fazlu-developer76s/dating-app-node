import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPurchase extends Document {
    _id: string
    userId: object
    servicePackageId: object
    purchaseDate: Date
    status: string
}

const purchaseSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    servicePackageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServicePackage', required: true },
    purchaseDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' }
}, { timestamps: true });

export default mongoose.model<IPurchase>("Purchase", purchaseSchema);
