const mongoose=require('mongoose');

const tutorForm1=new mongoose.Schema({
        
        email:{
            type:String,
            unique:true,
            default:null
            
        },
        name:{
            type:String,
            default:null
            
        },
        highest_degree:{
            type:String,
            default :null
        },
       
        other_degree:{
            type:String,
            default:null
        },

        university:{
            type:String,
            default :null
        },
        skills:{
            type:Array,
            default :null
        },
        other_skill:{
            type:Array,
            default:null
        },
        best_subjects:{
            type:Array,
            default :null
        },
        software_skills:{
            type:String,
            default:null
        },
        whatsapp_no:{
            type:String,
            default:null
        },
       
        
        branch:{
            type:String,
            default:null
            
        },
      
    },

    {timestamps: true}
    
    
);
module.exports=mongoose.model('tutorForm13',tutorForm1);