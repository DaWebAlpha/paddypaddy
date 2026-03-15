import mongoose from 'mongoose';
import createBaseModel from '../mongoose.base.model.js';


const constituencySchemaDefinition = {
    constituency:{
        type: String,
        trim: true,
        required: [true, "constituency is require"],
        minlength: [2, "constituency name is too short"],
        maxlength: [120, "constituency name is too long"]
    },
        slug: {
        type: String,
        trim: true,
        lowercase: true,
    },
    region_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true,
        index: true
    }
}

const Constituency = createBaseModel('Constituency', constituencySchemaDefinition, (schema)=>{
    schema.index(
        {constituency: 1, region_id: 1},
        {
            unique: true,
            partialFilterExpression: {is_deleted: false}, 
        }
    )

    schema.index(
        { slug: 1, country_id: 1 },
        {
          unique: true,
          partialFilterExpression: { is_deleted: false }
        }
    );

    schema.pre('save', async function(next){
        try{
            if(this.isModified('constituency') && this.constituency){
                const trimmed = this.constituency.trim().split(/\s+/);

                this.constituency = trimmed.map(item =>item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
            }
            next();
        }catch(error){
            next(error);
        }
    })
    
});

export {Constituency}
export default Constituency;