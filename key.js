import express from "express"
import fetch from "node-fetch"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

// 🔒 PUT YOUR KEYS HERE (SAFE - NOT EXPOSED)
const OPENAI_KEY = "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"
const GOOGLE_KEY = "AIzaSyCSNshWclcaJmFLi5oEbH35L3Rmhax3qDg"

// 🤖 AI ROUTE
app.post("/ai", async (req,res)=>{
    try{
        const response = await fetch("https://api.openai.com/v1/chat/completions",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${OPENAI_KEY}`
            },
            body:JSON.stringify({
                model:"gpt-4o-mini",
                messages:[
                    {role:"system",content:"You are a travel assistant."},
                    {role:"user",content:req.body.message}
                ]
            })
        })

        const data = await response.json()
        res.json(data)

    }catch(err){
        res.status(500).json({error:"AI failed"})
    }
})

// 📍 GOOGLE PLACES ROUTE
app.post("/places", async (req,res)=>{
    const {lat,lng,type} = req.body

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${type}&key=${GOOGLE_KEY}`

    try{
        const response = await fetch(url)
        const data = await response.json()
        res.json(data)

    }catch{
        res.status(500).json({error:"Places failed"})
    }
})

app.listen(3000,()=>console.log("Server running on port 3000"))
