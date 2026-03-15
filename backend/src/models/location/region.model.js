import mongoose from 'mongoose';
import createBaseModel from '../mongoose.base.model.js';

const regionDefinition = {
  region: {
    type: String,
    trim: true,
    required: [true, "Region is required"],
    minlength: [2, "Region name is too short"],
    maxlength: [120, "Region name is too long"]
  },

  slug: {
    type: String,
    trim: true,
    lowercase: true,
  },

  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, "Country is required"],
    index: true
  }
};

const Region = createBaseModel('Region', regionDefinition, (schema) => {

  
  schema.index(
    { region: 1, country_id: 1 },
    {
      unique: true,
      partialFilterExpression: { is_deleted: false }
    }
  );

  
  schema.index(
    { slug: 1, country_id: 1 },
    {
      unique: true,
      partialFilterExpression: { is_deleted: false }
    }
  );

  /*
  |--------------------------------------------------------------------------
  | CAPITALIZE REGION NAME BEFORE SAVE
  |--------------------------------------------------------------------------
  |
  | Example conversions:
  | "greater accra" → "Greater Accra"
  | "ashanti" → "Ashanti"
  |
  */

  schema.pre('save', function (next) {
    try {

      if (this.isModified('region') && this.region) {

        const words = this.region.trim().split(/\s+/);

        this.region = words
          .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");
      }

      next();

    } catch (error) {
      next(error);
    }
  });

});

export { Region };
export default Region;