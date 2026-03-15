import mongoose from 'mongoose';
import createBaseModel from '../mongoose.base.model.js';

const countrySchemaDefinition = {
  country: {
    type: String,
    trim: true,
    required: [true, 'Country is required'],
    minlength: [2, 'Country name is too short'],
    maxlength: [120, 'Country name is too long'],
  },

  iso_code: {
    type: String,
    trim: true,
    required: [true, 'ISO code is required'],
    minlength: [2, 'Country code is too short'],
    maxlength: [4, 'Country code is too long'],
  },

  slug: {
        type: String,
        trim: true,
        lowercase: true,
  },
  country_flag: {
    type: String,
    trim: true,
    default: '',
  },
};

const Country = createBaseModel('Country', countrySchemaDefinition, (schema) => {
  schema.index(
    { country: 1 },
    {
      unique: true,
      partialFilterExpression: { is_deleted: false },
    }
  );

  schema.index(
    { iso_code: 1 },
    {
      unique: true,
      partialFilterExpression: { is_deleted: false },
    }
  );

  schema.index(
    { slug: 1, country_id: 1 },
    {
      unique: true,
      partialFilterExpression: { is_deleted: false }
    }
  );

  schema.pre('save', function (next) {
    try {
      if (this.isModified('country') && this.country) {
        const sanitizedCountry = this.country
          .trim()
          .split(/\s+/)
          .map(
            (item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
          )
          .join(' ');

        this.country = sanitizedCountry;
      }

      if (this.isModified('iso_code') && this.iso_code) {
        this.iso_code = this.iso_code.trim().toUpperCase();
      }

      if (this.isModified('country_flag') && this.country_flag) {
        this.country_flag = this.country_flag.trim();
      }

      next();
    } catch (error) {
      next(error);
    }
  });
});

export { Country };
export default Country;