const express= require("express");
const sprouter = require("./routes/spotify");


const PORT =3030;
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}));

//route handler
app.get('/home',(req,res)=>{
    res.json({
        message:"hi welcome to sportify api"
    })
})

app.use("/token",sprouter);



app.listen(PORT,()=>{console.log(`server running on port ${PORT}`)})




