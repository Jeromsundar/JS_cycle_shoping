//not found

const notFound= (req, res,next) =>{
    const error=new Error(`Not Found: ${ req.originalUrl}`);
    res.status(404);
    next(error);
};

//error hamdler
const errorHandler = (err, res, next) => {
    const statuscode = res.statuscode ==200 ? 500 : res.statusCode;
    res.jason ({ 
        messagr:err?.message,
        stack: err?.stack,
    });
};
module.exports={errorHandler,notFound};