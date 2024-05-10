import multer from 'multer';


export const fileValidation2={
    image:['image/jpeg','image/png','image/webp'],
    file:['application/pdf','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    
}

function fileupload2(custonValidation=[]){
  
        const storage=multer.diskStorage({});
    
  
  
   
    function fileFilter(req,file,cb){
        // if(file.mimetype=='image/jpeg' || file.mimetype=='image/png' || file.mimetype=='image/webp'){
        //     if(['image/jpeg','image/png','image/webp'].includes(file.mimetype)){
        //     cb(null,true);
        
        // }
        //console.log(file)
        if(custonValidation.includes(file.mimetype)){
            cb(null,true);
        }
        else{
            cb("invalid format",false) 
        }
    }
    
    const upload=multer({fileFilter,storage})
     
    return upload;
   

}
export default fileupload2;