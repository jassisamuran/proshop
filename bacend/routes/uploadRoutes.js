import path from 'path'
import multer from 'multer'
import express from 'express'
const router=express.Router()

const storage=multer.diskStorage({
    destination(req,file,cb){
        cb(null,'./uploads')
    },
    filename(req,file,cb){
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file,cb){
    const filetypes= /jpg|jpeg|png/
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase())
    const minetype=filetypes.test(file.minetype)
    if(extname && minetype){
        return cb(null,true)
    }else{
        cb('Images only!')
    }
}
const upload=multer({
    storage,fileFilter:function(req,file,cb){
        // checkFileType(file,cb)
        cb(null,true)
    }
})

router.post('/',upload.single('image'),(re,res)=>{
    res.send(`/${re.file.path}`)
})
export default router