
function catchError( res , error ){
    res.status(500).json({ message: " Internl Server Error " , Error: error})
}

module.exports = { catchError }